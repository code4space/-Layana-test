'use client'
import '@/assets/css/error.css'
import { useRouter } from "next/navigation"

interface AnimationSetting {
    [key: string]: object
}

export default function Error({ error, reset }: { error: Error, reset: () => void }) {
    const animationSetting: AnimationSetting = {
        1: { '--err-duration': '2.5s', '--err-delay': '0s' },
        2: { '--err-duration': '2s', '--err-delay': '0.5s' },
        3: { '--err-duration': '3s', '--err-delay': '1s' },
        4: { '--err-duration': '1.5s', '--err-delay': '2s' },
    }
    const router = useRouter()

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
                        return <h1 style={style} key={i}>ERROR</h1>
                    })}
                </div>
                <h2>{error.message || 'Something went wrong'}</h2>
                <h3>Please try again later or contact support if the problem persists.</h3>
                <div className='err-button'>
                    <button onClick={reset}>Try Again</button>
                    <button onClick={() => router.push('/')}>Go Back Home</button>
                </div>
            </div>
        </div>
    )
}