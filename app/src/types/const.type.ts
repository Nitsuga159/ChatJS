enum CONST_ID {
  LOADER = "global-loader-application",
}

export interface ErrorType {
  message: string;
  code: string | number;
}

export interface DefaultResponse {
  ok: boolean;
  error?: string;
  data: any;
}

export default CONST_ID;
