"use client"
import { usePathname, useRouter } from 'next/navigation';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import LocalFireDepartmentSharpIcon from '@mui/icons-material/LocalFireDepartmentSharp';
import HistorySharpIcon from '@mui/icons-material/HistorySharp';
import MovingSharpIcon from '@mui/icons-material/MovingSharp';
import LogoutSharpIcon from '@mui/icons-material/LogoutSharp';
import DesktopMacSharpIcon from '@mui/icons-material/DesktopMacSharp';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from './loading';

export default function Navigation({ children }) {
    const [active, setActive] = useState(0)
    const [loading, setLoading] = useState(true)
    const [showDetail, setShowDetail] = useState(true)
    const [activeMobNav, setAvtiveMobNav] = useState(false)
    const [activeMobTopNav, setAvtiveMobTopNav] = useState(false)

    const [isMobile, setIsMobile] = useState(false);

    const pathname = usePathname()

    function handleDetail() {
        setShowDetail(!showDetail)
        setAvtiveMobNav(!activeMobNav)
    }


    useEffect(() => {
        const handleResize = () => {
            const isMobileDevice = window.innerWidth <= 768; // Set the breakpoint for mobile devices
            setIsMobile(isMobileDevice);
        };

        if (pathname === '/product') setActive(1)
        else setActive(0)

        handleResize();

        window.addEventListener('resize', handleResize);
        setLoading(false)

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);


    const router = useRouter()

    function handleNavigate(route, number) {
        setActive(number)
        router.push(route)
    }

    function logout() {
        document.cookie = "access_token=; max-age=0; path=/";
        router.push('/login')
    }

    // const dispatch = useDispatch();
    if (loading) return <Loading />
    return (
        <div style={{display: 'flex'}}>
            <div className="navbar">
                {isMobile ?
                    <> {activeMobNav && <div className='blur' onClick={handleDetail}></div>}
                        <div className='sideNav-mobile' style={activeMobNav ? { maxWidth: '230px' } : { maxWidth: '0px', padding: '0' }}>
                            <div className='logo' onClick={() => { window.location.reload() }}> <LocalFireDepartmentSharpIcon /> <p>Layana</p></div>
                            <div className='active-container' style={{ top: `${active * 60 + 80}px` }}><div className='active-mob'></div></div>
                            <ul>
                                <li className={pathname === '/' ? 'activeNav' : null} onClick={() => { handleNavigate('/', 0) }}><HomeRoundedIcon /> <p>&nbsp; Dashboard</p> </li>
                                <li className={pathname === '/product' ? 'activeNav' : null} onClick={() => { handleNavigate('/product', 1) }}><DesktopMacSharpIcon />&nbsp; <p>Product</p></li>
                            </ul>
                        </div></> :
                    <div className='sideNav' style={showDetail ? { width: '230px' } : { width: '70px' }}>
                        <div className='logo' onClick={() => { window.location.reload() }}> <LocalFireDepartmentSharpIcon /> {showDetail && <p>Layana</p>}</div>
                        <div className='active-container' style={{ top: `${active * 60 + 80}px` }}><div className='active'></div></div>
                        <ul>
                            <li className={pathname === '/' ? 'activeNav' : null} onClick={() => { handleNavigate('/', 0) }}><HomeRoundedIcon /> {showDetail && <p>Dashboard</p>} </li>
                            <li className={pathname === '/product' ? 'activeNav' : null} onClick={() => { handleNavigate('/product', 1) }}><DesktopMacSharpIcon /> {showDetail && <p>Product</p>}</li>
                        </ul>
                    </div>}
            </div>
            <div className='content' style={isMobile ? null : showDetail ? { width: 'calc(100% - 230px)' } : { width: 'calc(100% - 70px)' }}>
                <div className='topNav'>
                    <button onClick={handleDetail} className='menu'><MenuOutlinedIcon /></button>
                    <div className='topNav-right'>
                        {isMobile ?
                            <button className='menu' onClick={() => { setAvtiveMobTopNav(!activeMobTopNav) }}><MoreVertIcon /></button> :
                            <> <button className='menu'><PersonIcon /></button>
                                <button className='menu'> <SettingsIcon /></button>
                                <button className='menu' onClick={logout}><LogoutSharpIcon /></button></>}
                    </div>
                    {(isMobile && activeMobTopNav) && <div className='popOut-setting'>
                        <button className='menu'><PersonIcon /> &nbsp;Account</button>
                        <button className='menu'> <SettingsIcon /> &nbsp;Setting</button>
                        <button className='menu' onClick={logout}><LogoutSharpIcon /> &nbsp;Logout</button>
                    </div>}
                </div>
                {children}
            </div>
        </div>
    )
}