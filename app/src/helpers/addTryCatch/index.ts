import { DefaultResponse } from "@/types/const.type";

export default (fn: (...args: any) => any) =>
  async (...args: any): Promise<DefaultResponse> => {
    try {
      const data = await fn(...args);

      return { ok: true, data };
    } catch (e: any) {
      return {
        ok: false,
        data: null,
        error: e.response?.data.message || "unknown error",
      };
    }
  };
