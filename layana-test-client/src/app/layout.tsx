'use client'
import { Provider } from 'react-redux'
import store from '../store/store'
import './globals.css'
import "@/assets/css/login.css"
import "@/assets/css/absen.css"
import "@/assets/css/history.css"
import "@/assets/css/profile.css"
import "@/assets/css/loading.css"
import "@/assets/css/navigation.css"
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider store={store}>
          {children}
        </Provider>
      </body>
    </html>
  )
}
