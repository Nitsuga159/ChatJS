import { ObjectMap } from "@/basic-types"
import { AxiosHeaders } from "axios"

export enum HTTP_METHOD {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
}

export interface DefaultAPIProps {
    endpoint: string
    params?: ObjectMap<string> | null
    method: HTTP_METHOD
    headers?: Object
    data?: any,
}

export class DefaultAPI {
    constructor({ endpoint, params, method, headers, data }: DefaultAPIProps) {
        this.endpoint = endpoint
        this.params = params
        this.method = method
        this.headers = headers
        this.data = data
    }

    public getEndpoint() { return this.endpoint }
    public getParams() { return this.params }
    public getMethod() { return this.method }
    public getHeaders() { return this.headers }
    public getData() { return this.data }

    public setParam(key: string, value: string) {
        this.params = this.params || {}

        this.params[key] = value
    }

    private data?: Object | string | null
    private headers?: Object
    private method: HTTP_METHOD
    private endpoint: string
    private params?: ObjectMap<string> | null
}



/* LOGIN API */
export interface LoginAPIProps extends Omit<DefaultAPIProps, "endpoint" | "method"> {
    data: { mail: string, password: string }
}

export class LoginAPI extends DefaultAPI {
    constructor(data: LoginAPIProps) {
        super({
            ...data,
            method: HTTP_METHOD.POST,
            endpoint: "/user/login",
        })  
    }
}

/* USER INFO NAME API */
export interface UserInfoNameAPIProps extends Omit<DefaultAPIProps, "endpoint" | "method" | "data"> {
    params: { username: string, fields?: string }
}

export class UserInfoNameAPI extends DefaultAPI {
    constructor(data: UserInfoNameAPIProps) {
        super({
            ...data,
            method: HTTP_METHOD.GET,
            endpoint: "/user/info/name",
        })  
    }
}


/* USER INFO API */
export interface UserInfoAPIProps extends Omit<DefaultAPIProps, "endpoint" | "method"> {
    params?: { fields: string } 
}

export class UserInfoAPI extends DefaultAPI {
    constructor(data: UserInfoAPIProps) {
        super({
            ...data,
            method: HTTP_METHOD.POST,
            endpoint: "/user/login",
        })  
    }
}