"use client"
import { io } from "socket.io-client";
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import EmailIcon from '@mui/icons-material/Email';
import CloseIcon from '@mui/icons-material/Close';
import { useState, useEffect, FormEvent } from 'react';
import { Input, InputEmail, InputFile, PasswordInput } from '@/components/input';
import { useDispatch, useSelector } from 'react-redux';
import { UserState } from '@/store/reducers/user';
import { getUser } from '@/store/actions/fetchUser';
import Loading from '@/components/loading';
import axios from 'axios';
import { baseUrl, baseUrl1 } from '@/constant/url';
import { getCookie } from '@/components/cookie';
import { swalError, swalTopEnd } from '@/components/swal';
import Image from "next/image";


export default function Page() {
    const dispatch = useDispatch();
    const user: any = useSelector((state: UserState) => state.UserReducer.user);

    const [socket, setSocket] = useState<any>(null);
    const [openModal, setOpenModal] = useState(false)
    const [userInfo, setUserInfo] = useState<any>({
        email: 'email@yahoo.com',
        phone: '+12 3456789',
        position: 'Fullstack Developer',
        name: 'Jaden Smith',
        image: "",
        password: ''
    })

    useEffect(() => {
        const newSocket = io(baseUrl, { transports: ['websocket'] });
        setSocket(newSocket);
        async function fetchData() {
            dispatch(getUser(1))
            const response: any = await axios({
                method: "GET",
                url: baseUrl + '/user?page=1',
                headers: { access_token: getCookie("access_token") }
            })
            const user = response.data.userInfo
            setUserInfo({
                email: user?.email || "",
                phone: user?.phone || "",
                position: user?.position || "",
                name: user?.name || "",
                image: user?.image || "",
                password: user?.password || "",
            })
        }
        fetchData()

        return () => {
            newSocket.disconnect();
        }
    }, [dispatch])

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData();

        // Append the form fields to formData
        for (const key in userInfo) {
            formData.append(key, userInfo[key]);
        }

        try {
            await axios.patch(baseUrl + `/user`, formData, {
                headers: { access_token: getCookie('access_token') },
            }).then((res) => {
                setUserInfo({ ...userInfo, image: res.data.imagePath })
                swalTopEnd("Update Success")
                dispatch(getUser())
                setOpenModal(false)
            })
            await axios({
                url: `${baseUrl1}/logger`,
                method: 'POST',
                headers: { access_token: getCookie("access_token") },
                data: { description: `User dengan nama ${user.name} telah mengganti profile` }
            })
            socket.emit("notification", { message: `${user.name} telah mengganti profile` })

        } catch (error) {
            swalError(error);
        }
    };

    if (Array.isArray(user)) return <Loading />
    return (
        <div className="profile-container">
            <div className="card-box">
                <Image src={`${baseUrl}/${userInfo.image}`} alt="profile" />
                <p className="name">{userInfo.name}</p>
                <p className="position">{userInfo.position}</p>
                <div className="other-info">
                    <span>
                        <EmailIcon />
                        <p>{userInfo.email}</p>
                    </span>
                    |
                    <span>
                        <LocalPhoneIcon />
                        <p>{userInfo.phone}</p>
                    </span>
                </div>
            </div>
            <button onClick={() => setOpenModal(true)}>Ubah</button>
            {openModal ? <div className="modal">
                <div className="content">
                    <div className="header">
                        <h2>Edit Profile</h2>
                        <CloseIcon onClick={() => setOpenModal(false)} />
                    </div>
                    <form className="main" onSubmit={handleSubmit}>
                        <div className="inputBox">
                            <Input placeHolder={"Name"} state={userInfo} setState={setUserInfo} value={"name"} />
                        </div>
                        <div className="inputBox">
                            <Input placeHolder={"Posisi"} state={userInfo} setState={setUserInfo} value={"position"} />
                        </div>
                        <div className="inputBox">
                            <InputEmail placeHolder={"Email"} state={userInfo} setState={setUserInfo} value={"email"} />
                        </div>
                        <div className="inputBox">
                            <Input placeHolder={"Phone Number"} state={userInfo} setState={setUserInfo} value={"phone"} />
                        </div>
                        <div className="inputBox">
                            <PasswordInput required={false} placeHolder={"New Password"} state={userInfo} setState={setUserInfo} value={"password"} strength={true} />
                        </div>
                        <div className="inputBox">
                            <InputFile required={false} state={userInfo} setState={setUserInfo} value={"image"} />
                        </div>
                        <span></span>
                        <button className='basic-button' type='submit'>Simpan</button>
                    </form>
                </div>
            </div> : null}
        </div>
    )
}
