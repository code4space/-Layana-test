"use client"
import { usePathname, useRouter } from 'next/navigation';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import CelebrationIcon from '@mui/icons-material/Celebration';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SchoolIcon from '@mui/icons-material/School';
import Person4Icon from '@mui/icons-material/Person4';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import CircleIcon from '@mui/icons-material/Circle';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import NoteAltOutlinedIcon from '@mui/icons-material/NoteAltOutlined';
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function SubCategory({ Icon, title, option, id, active, setActive }) {
    const router = useRouter()
    const pathname = usePathname()
    function handleClick() {
        if (id === active) return setActive(null)
        setActive(id)
    }

    function navigationTo(path) {
        router.push(path)
    }


    return (
        <div className={id === active ? "sub-category-container active" : "sub-category-container"}>
            <div className="sub-category" onClick={handleClick}>
                <Icon />
                {title}
                <ExpandMoreOutlinedIcon />
            </div>
            <ul>
                {option.map((el, i) => {
                    return <li className={pathname === option[i].path ? "active" : null} key={i} onClick={() => navigationTo(option[i].path)}>{pathname === option[i].path ? <CircleIcon /> : <CircleOutlinedIcon />}{el.name}</li>
                })}
            </ul>
        </div>
    )
}

function SubCategory1({ title, alert = 0, handleClick, Icon, path }) {
    const pathname = usePathname()

    return (
        <div className={pathname === path ? "sub-category-container active" : "sub-category-container"}>
            <div className="sub-category" onClick={handleClick}>
                <Icon />
                {title}
                <span>{alert > 0 ? <p>{alert}</p> : null}</span>
            </div>
        </div>
    )
}

export default function Navigation({ children }) {
    const [active, setActive] = useState(null)
    const [isMinimize, setMinimize] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const [countNew, setCountNew] = useState(0)
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const isMobileDevice = window.innerWidth <= 800; // Set the breakpoint for mobile devices
            setIsMobile(isMobileDevice);
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);


    const router = useRouter()

    function handleNavigate(route) {
        router.push(route)
    }

    function logout() {
        document.cookie = "access_token=; max-age=0; path=/";
        router.push('/login')
    }

    // const dispatch = useDispatch();
    // const notification = useSelector((state) => state.StudentReducer.notification);

    function sideNavClass() {
        let className = ['side-navigation']
        if (isMobile) className.push('mobile')
        if (isMinimize) className.push('minimize')
        return className.join(' ')
    }
    return (
        <div className="navigation-container">

            <div className={sideNavClass()}>
                <h2>Karyawan {(isMobile && !isMinimize) ? <ChevronLeftOutlinedIcon onClick={() => setMinimize(!isMinimize)} /> : null}</h2>
                <div className="category">
                    <h4>Menu</h4>
                    < SubCategory Icon={NoteAltOutlinedIcon}
                        title={'Absen'}
                        option={[
                            { name: 'Masuk', path: '/absen' },
                            { name: 'History Kehadiran', path: '/absen/history' },
                        ]}
                        id={2}
                        active={active}
                        setActive={setActive}
                    />
                    < SubCategory1
                        Icon={Person4Icon}
                        title={'Profile'}
                        path={'/profile'}
                        handleClick={() => { handleNavigate('/profile') }} />
                    < SubCategory1
                        Icon={LogoutOutlinedIcon}
                        title={'Logout'}
                        handleClick={logout} />
                </div>
                <div className="category">
                    <h4>Profile</h4>
                    <div className="profile">
                        <AccountCircleIcon />
                        <div>
                        </div>
                        <MoreHorizOutlinedIcon />
                    </div>
                </div>
            </div>
            {(isMobile && !isMinimize) ? <div className="bg-blur" onClick={() => setMinimize(true)}></div> : null}

            <div className={isMinimize || isMobile ? "container minimize" : "container"}>
                <div className={isMinimize || isMobile ? "top-navigation minimize" : "top-navigation"}>
                    <span
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onClick={() => setMinimize(!isMinimize)}>{isMinimize && !isHovered ? <MenuOutlinedIcon /> : <ChevronLeftOutlinedIcon />}</span>
                    <div className="introduction">
                        <h2>Welcome<CelebrationIcon /></h2>
                        <p>Aplikasi absensi karyawan</p>
                    </div>
                    <div className="right-nav">
                        <NotificationsNoneIcon />
                    </div>
                </div>
                <div className="page">
                    {children}
                </div>
            </div>
        </div>
    )
}