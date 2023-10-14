"use client"
import CloseIcon from '@mui/icons-material/Close';
import CategoryIcon from '@mui/icons-material/Category';
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import KeyboardDoubleArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowLeftOutlined';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import KeyboardDoubleArrowRightOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowRightOutlined';
import { getCookie } from "@/components/cookie";
import { baseUrl } from "@/constant/url";
import axios from "axios";
import { swalError, swalTopEnd } from '@/components/swal'
import { useDispatch, useSelector } from "react-redux";
import { UserState } from "@/store/reducers/user";
import { getUser } from "@/store/actions/fetchUser";
import Loading from "@/components/loading";
import { useEffect, useState, FormEvent } from "react";

import { Input, InputEmail } from '@/components/input';
import Swal from 'sweetalert2';
import Image from 'next/image';

export default function Page() {
    const currentMonthYear = (date: string = '') => {
        const today = new Date(date);

        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Add 1 to the month because it's a zero-based index
        const day = today.getDay().toString().padStart(2, '0')
        return `${year}-${month}-${day}`
    }
    const [activePage, setActivePage] = useState(1)
    const [productInfo, setProductInfo] = useState<any>({
        product_name: "",
        qty: 0,
        brand: "",
        date_input: "",
        image: "",
        id: ""
    })
    const dispatch = useDispatch()
    const [openModal, setOpenModal] = useState(false)
    const [action, setAction] = useState("")


    const product: any = useSelector((state: UserState) => state.UserReducer.user);

    function changePage(page: number) {
        dispatch(getUser(page))
        setActivePage(page)
    }

    function handleClick(id: string) {
        setOpenModal(true)
        setAction("edit")
        const { product_name, qty, brand, date_input, image, _id } = product.find(({ _id }: any) => _id === id)
        setProductInfo({ product_name, qty, brand, date_input, image, id: _id })
    }
    useEffect(() => {
        dispatch(getUser())
    }, [dispatch])

    const totalPage: any = useSelector((state: UserState) => state.UserReducer.totalPage);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { product_name, qty, brand, image, id } = productInfo
        // Append the form fields to formData

        try {
            const method = action === "edit" ? "PATCH" : "POST"
            const url = action === "edit" ? `${baseUrl}/product/admin/${id}` : `${baseUrl}/product`
            console.log(url)
            await axios({
                method,
                url,
                headers: { access_token: getCookie('access_token') },
                data: { product_name, qty, brand, image }
            }).then(() => {
                swalTopEnd(`${action} Success`)
                dispatch(getUser())
                setOpenModal(false)
            })
        } catch (error) {
            swalError(error);
        }
    };

    const handleDelete = async (name: string, id: string) => {
        Swal.fire({
            title: `Are you sure you want delete this product "${name}"`,
            showCancelButton: true,
            cancelButtonText: "No",
            confirmButtonText: 'Yes',
            confirmButtonColor: '#d33',
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axios({
                    method: "DELETE",
                    url: baseUrl + `/product/admin/${id}`,
                    headers: { access_token: getCookie('access_token') }
                }).then(() => {
                    swalTopEnd("Delete Success")
                    dispatch(getUser())
                    setOpenModal(false)
                }).catch(err => {
                    swalError(err)
                })
            }
        });
    };

    return (
        <div className="page">
            <div className='card-box'>
                <p className='title'><CategoryIcon /><b>Product</b></p>
                <table className='history'>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Brand</th>
                            <th>Qty</th>
                            <th>Uploaded by</th>
                            <th>Date Input</th>
                            <th>Image</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            product.map(({ product_name, qty, brand, date_input, image, _id, uploaded_by }: any, i: number) => {
                                return (
                                    <tr key={i}>
                                        <td>{product_name}</td>
                                        <td>{brand}</td>
                                        <td>{qty}</td>
                                        <td>{uploaded_by}</td>
                                        <td>{currentMonthYear(date_input)}</td>
                                        <td><Image src={image} alt="" /></td>
                                        <td><button onClick={() => handleClick(_id)}>Edit</button><button onClick={() => handleDelete(product_name, _id)} className='delete'>Delete</button></td>
                                    </tr>
                                )
                            })
                        }
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
            {openModal ? <div className="modal">
                <div className="modal-content">
                    <div className="header">
                        <h2>Edit Product</h2>
                        <CloseIcon onClick={() => setOpenModal(false)} />
                    </div>
                    <form className="main" onSubmit={handleSubmit}>
                        <div className="inputBox">
                            <Input placeHolder={"Product Name"} state={productInfo} setState={setProductInfo} value={"product_name"} />
                        </div>
                        <div className="inputBox">
                            <Input placeHolder={"Brand"} state={productInfo} setState={setProductInfo} value={"brand"} />
                        </div>
                        <div className="inputBox">
                            <Input placeHolder={"Qty"} state={productInfo} setState={setProductInfo} value={"qty"} />
                        </div>
                        <div className="inputBox">
                            <Input placeHolder={"Image url"} state={productInfo} setState={setProductInfo} value={"image"} />
                        </div>
                        <span></span>
                        <button className='basic-button' type='submit'>Simpan</button>
                    </form>
                </div>
            </div> : null}
        </div>
    );
}
