import axios from "axios"

async function register(payload) {
    try {
        const response = await axios.post("http://localhost:3000/api/auth/register",
            payload,
            {withCredentials:true}
        )
        return response.data
    } catch (error) {
        throw error
    }
}

async function login({email,password}) {
    try {
        const response = await axios.post("http://localhost:3000/api/auth/login",
            {email,password},
            {withCredentials: true} // for access to cookies
        )
        return response.data
    } catch (error) {
        throw error
    }
}

async function logout() {
    try {
        const response = await axios.post("http://localhost:3000/api/auth/logout",{},
            {withCredentials: true}
        )
    } catch (error) {
        throw error
    }
}

async function getuser() {
    try {
        const response = await axios.get("http://localhost:3000/api/auth/me",
            {withCredentials: true}
        )
        return response.data
    } catch (error) {
        throw error
    }
}

async function otpSubmit({otp,email}) {
    try {
        const response = await axios.post("http://localhost:3000/api/auth/verify-email",
            {otp,email},
            {withCredentials: true}
        )
        return response.data
    } catch (error) {
        throw error
    }
}

export {
    register,
    login,
    logout,
    getuser,
    otpSubmit
}