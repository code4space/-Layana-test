'use client'
import { Provider } from 'react-redux'
import store from '../store/store'
import './globals.css'
import "@/assets/css/historyPage.css"
import "@/assets/css/loading.css"
import "@/assets/css/homePage.css"
import "@/assets/css/loginPage.css"
import "@/assets/css/profile.css"
import "@/assets/css/navigation.css"
import { Inter } from 'next/font/google'
import Navigation from '@/components/navigation'
import { usePathname } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children, }: { children: React.ReactNode }) {

  const pathname = usePathname()
  const withoutNav = ['/login', '/signup']

  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider store={store}>
          {withoutNav.some(el => el === pathname) ? children :
            <Navigation>
              {children}
            </Navigation>}
        </Provider>
      </body>
    </html>
  )
}
