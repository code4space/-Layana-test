'use client'
import { InputEmail, PasswordInput } from '@/components/input';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '@/constant/url'
import Swal from "sweetalert2";

export default function Page() {
    const router = useRouter()
    const [data, setData] = useState({
        email: '',
        password: '',
    })

    async function login(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const { email, password, } = data
        await axios({
            url: baseUrl + `/user/login`,
            method: "POST",
            data: { email, password }
        })
            .then((res) => {
                if (res.status !== 200) throw new Error("something went wrong");
                return res.data;
            })
            .then(({ access_token }) => {
                router.push('/')
                document.cookie = `access_token=${access_token}; path=/; max-age=3600`
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Login Success',
                    showConfirmButton: false,
                    timer: 1500
                })
            }).catch(error => {
                Swal.fire({
                    icon: "error",
                    title: `ERROR ${error.response.status}`,
                    text: error.response.data.message,
                });
            })
    }
    return (
        <div className='login-container'>
            <div className='border-container'>
                <div className='login-box'>
                    <h3>KARYAWAN SIGN IN</h3>
                    <form className='input-container' onSubmit={login}>

                        <InputEmail setState={setData} state={data} value={'email'} placeHolder={'Email'} />
                        <PasswordInput setState={setData} state={data} value={'password'} placeHolder={'Password'} strength={true} />

                        <button className='basic-button' type='submit'>Sign in</button>
                        <p className='sign-up'>New user ? <b onClick={() => router.push('/signup')}>Sign Up</b></p>
                    </form>
                </div>
            </div>
        </div>
    )
}
