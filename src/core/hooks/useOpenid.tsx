import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import AuthManager from "../redux/auth/api";

const useOpenid = () => {
  const dispatch = useAppDispatch();
  const username = useAppSelector((state) => state.auth.user?.name);
  const [ready, setReady] = useState(false);

  const auth = async () => {
    const urlParams = new URLSearchParams(new URL(window.location.href).searchParams.toString());
    // const clientId = urlParams.get("clientId");
    // const env = urlParams.get("env");
    const code = urlParams.get("code");
    let isCodeStale = false;
    if (code) {
      const _code = localStorage.getItem("code");
      isCodeStale = _code === code;
      if (!isCodeStale) localStorage.setItem("code", code);
    }

    // if (clientId && env) {
    // localStorage.setItem("clientId", clientId);
    // localStorage.setItem("env", env);
    // } else {
    //   return;
    // }

    if (!code || isCodeStale) {
      const loginUrl = await AuthManager.getComposedUrl();
      if (loginUrl.clientId) localStorage.setItem("clientId", loginUrl.clientId);
      if (loginUrl.composedUrl) window.location.replace(loginUrl.composedUrl);
    } else {
      const userInfo = await AuthManager.login(code);
      
      if (userInfo) {
        dispatch.auth.setUser(userInfo);
        localStorage.setItem("username", userInfo.name);
        localStorage.setItem("token", userInfo.access_token);
        setReady(true);
      }
    }
  };

  useEffect(() => {
    if (username) {
      setReady(true);
      return;
    }
    auth();
  }, []);

  return [ready];
};

export default useOpenid;
