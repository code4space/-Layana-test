import '@/assets/css/error.css'
import Link from 'next/link'

interface AnimationSetting {
    [key: string]: object
}

export default function NotFound() {
    const animationSetting: AnimationSetting = {
        1: { '--err-duration': '2.5s', '--err-delay': '0s' },
        2: { '--err-duration': '2s', '--err-delay': '0.5s' },
        3: { '--err-duration': '3s', '--err-delay': '1s' },
        4: { '--err-duration': '1.5s', '--err-delay': '2s' },
    }

    return (
        <div className="error">
            <div className="drop">
                {Array.from({ length: 4 }, (_, i) => i + 1).map((el, i) => {
                    return <span style={animationSetting[el]} key={i}></span>
                })}
            </div>
            <div className='error-content'>
                <div className="stack">
                    {Array.from({ length: 3 }, (_, i) => i).map((el, i) => {
                        const style: object = { '--index': el }
                        return <h1 style={style} key={i}>404</h1>
                    })}
                </div>
                <h2>PAGE NOT FOUND</h2>
                <h3>We could not find the page you were looking for.</h3>
                <div className='err-button'>
                    <Link href="/">Back</Link>
                </div>
            </div>
        </div>
    )
}