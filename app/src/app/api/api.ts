import store from "../../../store";
// import {showLoading} from '../actions/utils/showLoading';
// import {hideLoading} from '../actions/utils/hideLoading';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {AxiosInstance, AxiosResponse} from "axios";
import firebaseAuth from '@react-native-firebase/auth';
import {Platform} from 'react-native';

const pkg = require("../../../package.json");
const axios = require("axios");


const Api: AxiosInstance = axios.create({
  baseURL: Platform.OS === 'android' ? "http://10.0.2.2:3000/" : "http://localhost:3000/",
  timeout: 5000,
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json"
  }
});


Api.interceptors.request.use(async (config: any) => {
    // dispatch(showLoading());
    const user = firebaseAuth().currentUser;
    if (user) {
        const token = await user.getIdToken();
        config.headers["Authorization"] = token ? `Bearer ${token}` : "";
    }
    return config;
  }, (error: any) => {
    // dispatch(hideLoading());
    Promise.reject(error);
  }
);

/*Api.interceptors.response.use(async (response: AxiosResponse) => {
    // dispatch(hideLoading());
    return response;
}, (error: any) => {
    // dispatch(hideLoading());
    return Promise.reject(error);
});*/

export default Api;
