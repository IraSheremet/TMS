import axios from "axios";
import authHeader from "./auth.header";

const API_URL = process.env.REACT_APP_API_URL;


export default class AuthService {
    static login(username: string, password: string) {
        return axios
            .post(API_URL + "api/token/", {username: username, password: password})
            .then((response) => {
                if (response.data.access) {
                    localStorage.setItem("accessToken", response.data.access);
                    localStorage.setItem("refreshToken", response.data.refresh);
                }
            })
    }

    static refreshToken() {
        const token = localStorage.getItem("refreshToken");
        return axios
            .post(API_URL + "api/token/refresh/", {refresh: token})
            .then((response) => {
                if (response.data.access) {
                    localStorage.setItem("accessToken", response.data.access);
                }
            })
    }

    static logout() {
        axios.get(API_URL + "logout/", {headers: authHeader(), params: {"token": localStorage.getItem('token')}})
            .then(() => {})
        localStorage.removeItem("accessToken");
    }

    static getCurrentAccessToken() {
        return localStorage.getItem("accessToken");
    }
}
