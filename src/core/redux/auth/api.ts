import { API_BASE_URL, API_PATHS, CALLBACK_URL } from "@/constants";
import { composedUrl, UserType } from "@/types";
import axios from "axios";

class AuthManager {
  public static getComposedUrl = async () => {
    const params = `?redirect_uri=${CALLBACK_URL}&scope=openid&response_type=code&response_mode=query`;

    const response: any = await axios.get(
      `${API_BASE_URL}${API_PATHS.GET_COMPOSED_URL}${params}`
    );
    const composedUrl: composedUrl = response.data;
    return composedUrl;
  };

  public static login = async (code: string) => {
    const clientId = localStorage.getItem("clientId");
    const payload = { code, clientId, redirectUri: CALLBACK_URL };
    const response: any = await axios.post(`${API_BASE_URL}${API_PATHS.LOGIN}`, payload, {
      headers: {
        "Skip-Auth": true,
      },
    });

    const userInfo: UserType = response.data;
    console.log(response.data);
    return userInfo;
  };
}

export default AuthManager;
