'use client'
import { useEffect ,useState} from "react"
import { useAuthStore } from "@/store/authStore"
import { useRouter } from "next/navigation"


export const CheckAuth = () => {

    const { registerUser, logoutUser } = useAuthStore()
    const router = useRouter()

   
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch('http://localhost:4000/auth/check-auth', {
                    method: 'GET',
                    credentials: 'include',
                })
                const data = await res.json()
                console.log(data)

                if (res.ok) {
                    console.log("User is authenticated")
                    registerUser(data.user)
                } else {
                    console.error("User is not authenticated")
                    logoutUser()
                    router.push("/login")
                }
            } catch (error) {
                console.error("Error checking authentication:", error)
            }
        }
        checkAuth()
     
        const interval = setInterval(checkAuth, 5 * 60 * 1000)
        return () => clearInterval(interval)
    }, [])
    return null

}