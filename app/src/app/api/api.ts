import store from "../../../store";
// import {showLoading} from '../actions/utils/showLoading';
// import {hideLoading} from '../actions/utils/hideLoading';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AxiosInstance } from "axios";

const pkg = require("../../../package.json");
const axios = require("axios");


const Api: AxiosInstance = axios.create({
  baseURL: "http://10.0.2.2:3000/",
  timeout: 5000,
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json"
  }
});


Api.interceptors.request.use(async (config: any) => {
    // dispatch(showLoading());
    const token = await AsyncStorage.getItem("token");
    config.headers["Authorization"] = token ? `Bearer ${token}` : "";
    return config;
  }, (error: any) => {
    // dispatch(hideLoading());
    Promise.reject(error);
  }
);

/*Api.interceptors.response.use(async (response) => {
    dispatch(hideLoading());
    return response;
}, (error: any) => {
    dispatch(hideLoading());
    return Promise.reject(error);
});*/

export default Api;