import { baseUrl } from "@/constant/url";
import { getCookie } from "@/components/cookie";
import { USER } from "./actionType";
import axios from "axios";

export function userFetchSuccess(payload: object) {
  return {
    type: USER,
    payload,
  };
}

export function getUser(page: number = 1, from?: string, to?: string): any {
  return async (dispatch: Function) => {
    try {
      let url = `${baseUrl}/product/all/?page=${page}`
      // if (from) url += `&from=${from}`
      // if (to) url += `&to=${to}`


      const response = await axios({
        url,
        method: 'GET',
        headers: { access_token: getCookie("access_token") }
      })

      console.log(response.data)
      dispatch(userFetchSuccess(response.data));
    } catch (error) {
      console.log(error);
    }
  };
}