"use client"
import { getCookie } from "@/components/cookie";
import { baseUrl } from "@/constant/url";
import axios from "axios";
import { swalError, swalTopEnd } from '@/components/swal'
import { useDispatch, useSelector } from "react-redux";
import { UserState } from "@/store/reducers/user";
import { getUser } from "@/store/actions/fetchUser";
import Loading from "@/components/loading";
import { useEffect, useState } from "react";

export default function Page() {
    const [absenMasuk, setAbsenMasuk] = useState<any>(null)
    const style: object = { "--color": 'rgb(110, 133, 235)' };
    const absenData: any = useSelector((state: UserState) => state.UserReducer.absen);
    const user: any = useSelector((state: UserState) => state.UserReducer.user);
    const dispatch = useDispatch()

    async function absen(name: "masuk" | "pulang"): Promise<void> {
        try {
            const response = await axios({
                method: "POST",
                url: `${baseUrl}/user/absen/${name}`,
                headers: { access_token: getCookie('access_token') }
            })
            swalTopEnd(response.data.message)
            dispatch(getUser())
        } catch (error) {
            swalError(error)
        }
    }

    useEffect(() => {
        const today = new Date()
        if (absenData.length === 0) return setAbsenMasuk(false)

        const absenToday = new Date(absenData[0].tgl_masuk)
        if (
            absenToday.getDate() === today.getDate() &&
            absenToday.getMonth() === today.getMonth() &&
            absenToday.getFullYear() === today.getFullYear()
        ) {
            setAbsenMasuk(true)
        } else setAbsenMasuk(false)
    }, [absenData])

    useEffect(() => {
        dispatch(getUser())
    }, [dispatch])

    if (!absenData || absenMasuk === null) return <Loading />
    return (
        <div className="absen">
            <h1>{absenMasuk ? "Jangan lupa absen pulangnya :)" : `Hai ${user.name}, Hari ini kamu belum absen`}</h1>
            <div>
                <button onClick={() => absen('masuk')} className={absenMasuk ? "deactive" : ""}>Hadir</button>
                <button onClick={() => absen('pulang')} style={style} className={absenMasuk ? "" : "deactive"}>Pulang</button>
            </div>
        </div>
    );
}
