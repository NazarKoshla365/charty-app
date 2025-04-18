interface FormData {
    username?: string;
    email: string;
    password: string;
  }
  
  interface Errors {
    username: string;
    email: string;
    password: string;
  }

export const ValidateForm = (formData: FormData) => {
    const validationErrors : Errors ={
        username: '',
        email: '',
        password: ''
    }

    let isValid = true;
    if (!formData.username) {
        validationErrors.username = 'Username is required'
        isValid = false;
    }
    if (!formData.email) {
        validationErrors.email =  'Email is required' 
        isValid = false;
    } else {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
        if (!emailRegex.test(formData.email)) {
            validationErrors.email = 'Please enter a valid email address'
            isValid = false;
        }
    }
    if (!formData.password) {
         validationErrors.password = 'Password is required' 
        isValid = false;
    }
    else if (formData.password.length < 6) {
        validationErrors.password = 'Password must be at least 6 characters' 
        isValid = false;
    }

    return {isValid,validationErrors}

}