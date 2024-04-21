import axios, { Axios, AxiosError, AxiosHeaders, AxiosResponse } from "axios";
import { createContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserState } from "@/redux/slices/user";
import ENVS from "@/envs";
import { userActions } from "@/redux/actions/user";
import Logger from "@/utils/logger";
import { DefaultAPI, HTTP_METHOD, LoginAPI, UserInfoAPI } from "./api-interface";

const HttpClientContext = createContext<((args: DefaultAPI) => any | undefined) | null>(null);

export const APIs = {
}

function HttpClientProvider({ children }: any) {
    const dispatch = useDispatch()
    const { user } = useSelector(getUserState);
    const [axiosInstance, setAxiosIntance] = useState<Axios | null>(null);

    const httpClient = async function(args: DefaultAPI) {
        return (await axiosInstance?.request({
            url: args.getEndpoint(),
            data: args.getData(),
            headers: args.getHeaders() as AxiosHeaders,
            method: args.getMethod(),
            params: args.getParams()
        }))
    }

    useEffect(() => {
        // Crear una instancia de Axios sin configuración inicial
        const axiosIntance = axios.create({
            baseURL: ENVS.BACKEND_URL,
        });

        axiosIntance.interceptors.response.use(null, (err: AxiosError) => {
            const { response } = err

            Logger.debug("Response", response?.data, response?.headers)

            if(response?.status === 401) {
                dispatch(userActions.logout())
            } else if(response?.status === 500) {
                console.log("error")
            }

            return Promise.resolve(response)
        })

        setAxiosIntance(() => axiosIntance);
    }, []);

    useEffect(() => {
        // Verificar si el token de acceso está disponible
        if (user?.accessToken && axiosInstance) {
            // Actualizar los interceptores de la instancia de Axios
            axiosInstance.interceptors.request.use((req) => {
                req.headers.Authorization = `Bearer ${user.accessToken}`;
                return req;
            });
        } else if (axiosInstance) {
            // Limpiar los interceptores si el token de acceso está vacío
            axiosInstance.interceptors?.request.clear();
        }
    }, [user?.accessToken, axiosInstance]);

    return (
        <HttpClientContext.Provider value={httpClient}>
            {children}
        </HttpClientContext.Provider>
    );
}

export { HttpClientProvider, HttpClientContext };
