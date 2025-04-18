'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { GoogleLogin } from '@react-oauth/google';
import { ValidateForm } from '@/utils/ValidatorForm'

export function SignUpComponent() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    })
    const [errors, setErrors] = useState({
        username: '',
        email: '',
        password: ''
    })

  
    const router = useRouter()


    const handleGoogleResponse = async (response: any) => {
        try {
            const res = await fetch('http://localhost:4000/auth/google', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: response.credential })
            })

            const data = await res.json()
           
            if (res.ok) {
        
                router.push("/")
                console.log(data)
            } else {
                console.error("Google login error:", data.message)

            }
        } catch (err) {
            console.error("Google login error:", err)
        }
    }




    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        })
        )
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const { isValid, validationErrors } = ValidateForm(formData)

        if (!isValid) {
            setErrors(validationErrors)
            return;
        }
        try {
            const response = await fetch('http://localhost:4000/auth/signup', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: formData.username, email: formData.email, password: formData.password }),

            })
            const data = await response.json()
            console.log(data)
            if (response.ok) {
               
                router.push("/")
            } else {
                console.error("Something went wrong")
            }
        }
        catch (err) {
            console.error(err)
        }
    }

    return (
        <div className='bg-[#e3effa] h-screen flex justify-center'>
            <div className='bg-white rounded-xl flex flex-col items-center py-14 px-40  my-10'>
                <h1 className='text-3xl'>Get started</h1>
                <p className='text-sm mt-2 mb-4 font-normal text-gray-600'>Sign up with your email</p>
                <form onSubmit={handleSubmit} className='flex flex-col items-center gap-y-4'>
                    <div className='flex flex-col w-76'>
                        {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}

                        <input
                            name='username'
                            type="text"
                            value={formData.username}
                            onChange={handleChange}
                            className='py-2 px-4 border border-gray-300 rounded-xl outline-0'
                            placeholder='Your username'
                        />
                    </div>
                    <div className='flex flex-col w-76'>
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}

                        <input
                            name='email'
                            type='email'
                            value={formData.email}
                            onChange={handleChange}
                            className='py-2 px-4 border  border-gray-300 rounded-xl outline-0'
                            placeholder="Your email"
                        />
                    </div>

                    <div className='flex flex-col w-76'>
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}

                        <input
                            name='password'
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            className='py-2 px-4 border border-gray-300 rounded-xl outline-0'
                            placeholder='Your password'
                        />
                    </div>

                    <button type="submit" className='bg-[#56a6f1]  w-60 text-white text-xl py-2 px-8 rounded-xl mt-4'>Sign up</button>
                    <GoogleLogin onSuccess={handleGoogleResponse} onError={() => console.log('Login Failed')} />
                </form>


                <div className='flex items-center gap-x-1 mt-4'>
                    <p className="text-gray-600">You have an account?</p>
                    <Link href="/login">Login</Link>
                </div>
            </div>
        </div>
    )
}