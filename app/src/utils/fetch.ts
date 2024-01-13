import axios from "axios"

export interface AxiosRequest {
    query: { [key: string]: string | null },
    headers?: {}, 
    body?: {},
    endpoint: string
}

export const queryParse = (query: { [key: string]: string | null }) =>  Object.entries(query).filter(([_, value]) => value).map(([key, value]) => `${key}=${value}`).join("&") 

export const getFetch = async (request: Omit<AxiosRequest, 'body'>) => {
    let endpoint = request.endpoint
    
    if(request.query) {
        endpoint += `?${queryParse(request.query)}`
    }

    return (await axios.get(endpoint, request.headers || {})).data
}

export const deleteFetch = async (request: Omit<AxiosRequest, 'body'>) => {
    let endpoint = request.endpoint
    
    if(request.query) {
        endpoint += `?${queryParse(request.query)}`
    }

    return (await axios.delete(endpoint, request.headers || {})).data
}

export const postFetch = async (request: AxiosRequest) => {
    let endpoint = request.endpoint
    
    if(request.query) {
        endpoint += `?${queryParse(request.query)}`
    }

    return (await axios.post(endpoint, request.body || {}, request.headers || {})).data
}

export const putFetch = async (request: AxiosRequest) => {
    let endpoint = request.endpoint
    
    if(request.query) {
        endpoint += `?${queryParse(request.query)}`
    }

    return (await axios.put(endpoint, request.body || {}, request.headers || {})).data
}