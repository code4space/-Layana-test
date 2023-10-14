"use client"
import { useEffect, useState } from "react"
import HistorySharpIcon from '@mui/icons-material/HistorySharp';
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import KeyboardDoubleArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowLeftOutlined';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import KeyboardDoubleArrowRightOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowRightOutlined';
import { useDispatch, useSelector } from "react-redux";
import { UserState } from "@/store/reducers/user";
import { getUser } from "@/store/actions/fetchUser";
import { swalErrorWithMessage } from "@/components/swal";

export default function Page() {
    const currentMonthYear = (date: string = '') => {
        const today = new Date();

        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Add 1 to the month because it's a zero-based index

        return `${year}-${month}`
    }

    const [activePage, setActivePage] = useState(1)
    const [date, setDate] = useState({ from: currentMonthYear(), to: currentMonthYear() })
    const absenData: any = useSelector((state: UserState) => state.UserReducer.absen);
    const totalPage: any = useSelector((state: UserState) => state.UserReducer.totalPage);
    const dispatch = useDispatch()

    function changePage(page: number) {
        dispatch(getUser(page))
        setActivePage(page)
    }

    useEffect(() => {
        dispatch(getUser(1))
    }, [dispatch])

    useEffect(() => {
        if (date.from.length > 0 && date.to.length > 0) {
            const [fromYear, fromMonth] = date.from.split('-')
            const [toYear, toMonth] = date.to.split('-')
            if (+toYear < +fromYear) {
                swalErrorWithMessage("to date must be more than from")
            } else if (fromYear === toYear && +toMonth < +fromMonth) {
                swalErrorWithMessage("to date must be more than from")
            } else dispatch(getUser(1, date.from, date.to))
        }
    }, [date.from, date.to, dispatch])

    function dateFormat(dateStr: string): string {
        const dateTime = new Date(dateStr)
        const date = dateTime.toISOString().split('T')[0]; // Extract the date part
        const hour = `${dateTime.getHours()}`.padStart(2, '0'); // Get the hour (0-23)
        const minute = `${dateTime.getMinutes()}`.padStart(2, '0'); // Get the minute (0-59)
        const time = `${hour}:${minute}`
        return date + ' ' + time
    }

    return (
        <>
            <div className="card-box filter">
                <div className="dual-input">
                    <div className="inputBox">
                        <label htmlFor="from">From: </label>
                        <input type="month" name="from" onChange={(e) => setDate({ ...date, from: e.target.value })} value={date.from} />
                    </div>
                    <div className="inputBox">
                        <label htmlFor="to">To: </label>
                        <input type="month" name="to" onChange={(e) => setDate({ ...date, to: e.target.value })} value={date.to} />
                    </div>
                </div>
            </div>

            <div className='card-box'>
                <p className='title'><HistorySharpIcon /><b>History</b></p>
                <table className='history'>
                    <thead>
                        <tr>
                            <th>Masuk</th>
                            <th>Pulang</th>
                        </tr>
                    </thead>
                    <tbody>
                        {absenData.map(({ tgl_masuk, tgl_pulang }: { tgl_masuk: string, tgl_pulang: string }, i: number) => {
                            return (
                                <tr key={i}>
                                    <td>{dateFormat(tgl_masuk)}</td>
                                    <td>{tgl_pulang || '---'}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            <div className='center'>
                <div className='pagination'>
                    {activePage > 1 && <><KeyboardDoubleArrowLeftOutlinedIcon onClick={() => { changePage(1) }} />
                        <ChevronLeftOutlinedIcon onClick={() => { changePage(activePage - 1) }} /></>}
                    {totalPage > 5 ?
                        <>
                            {[...Array(totalPage - 4 >= activePage ? 3 : 5)].map((_, i) => {
                                if (activePage >= totalPage - 4) return <span key={i} onClick={() => changePage(totalPage - 4 + i)} className={totalPage - 4 + i === activePage ? 'active-page' : ''}>{totalPage - 4 + i}</span>
                                else if (activePage > 1) return <span onClick={() => changePage(activePage - 1 + i)} className={activePage - 1 + i === activePage ? 'active-page' : ''} key={i}>{activePage - 1 + i}</span>
                                else return <span key={i} onClick={() => changePage(i + 1)} className={i + 1 === activePage ? 'active-page' : ''}>{i + 1}</span>
                            })}
                            {totalPage - 4 >= activePage &&
                                <><p>...</p>
                                    <span onClick={() => changePage(totalPage)} className={totalPage === activePage ? 'active-page' : ''} >{totalPage}</span></>
                            }
                        </> :
                        [...Array(totalPage)].map((_, i) => {
                            return <span onClick={() => changePage(i + 1)} className={i + 1 === activePage ? 'active-page' : ''} key={i}>{i + 1}</span>
                        })
                    }
                    {activePage < totalPage && <><KeyboardArrowRightOutlinedIcon onClick={() => { changePage(activePage + 1) }} />
                        <KeyboardDoubleArrowRightOutlinedIcon onClick={() => { changePage(totalPage) }} /></>}
                </div>
            </div>
        </>
    )
}
