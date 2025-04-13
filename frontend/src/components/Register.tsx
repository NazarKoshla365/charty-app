import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { useState } from 'react'
export function Register() {
    const [value, setValue] = useState<string | undefined>()
    return (
        <div>
            <h1>Get Started Now</h1>
            <p>Create an account to explore about our app</p>
            <div>
                <label>Phone Number</label>
                <input type="text" />
                <PhoneInput placeholder="Enter phone number" value={value}
                    onChange={setValue} />
                <button type="submit">Register your number</button>
            </div>
        </div>
    )
}