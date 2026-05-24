import axios from "axios"

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://sreyhackathon2k26-invincible.onrender.com/api';

async function register(payload) {
    try {
        const response = await axios.post(`${API_BASE}/auth/register`,
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
        const response = await axios.post(`${API_BASE}/auth/login`,
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
        const response = await axios.post(`${API_BASE}/auth/logout`,{},
            {withCredentials: true}
        )
    } catch (error) {
        throw error
    }
}

async function getuser() {
    try {
        const response = await axios.get(`${API_BASE}/auth/me`,
            {withCredentials: true}
        )
        return response.data
    } catch (error) {
        throw error
    }
}

async function otpSubmit({otp,email}) {
    try {
        const response = await axios.post(`${API_BASE}/auth/verify-email`,
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