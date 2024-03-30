import { getUserState } from "@/redux/slices/user";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function useUserManager() {
    const navigate = useNavigate()
    const userState = useSelector(getUserState).user

    const logout = () => {
        navigate('/auth')
    }

    const login = () => {

    }

    const getUserData = () => {
    }

    const getAccessToken = () => {

    }

    return {
        getUserData,
        getAccessToken,
        logout,
        login
    }
}