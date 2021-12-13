import {showBar} from '../actions/utils/showBar';
import {hideBar} from '../actions/utils/hideBar';
import store from '../store';
import {firebaseAuth} from '../firebase';
import {AxiosResponse} from 'axios';

const axios = require('axios');

const API = axios.create({
    baseURL: 'http://localhost:3000/',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
});


API.interceptors.request.use(async (config: any) => {
        store.dispatch(showBar())
        const user = firebaseAuth.currentUser
        if (user) {
            const token = await user.getIdToken();
            config.headers["Authorization"] = token ? `Bearer ${token}` : "";
        }
        return config;
    }, (error: any) => {
        store.dispatch(hideBar())
        Promise.reject(error);
    }
);

API.interceptors.response.use(async (response: AxiosResponse) => {
    store.dispatch(hideBar());
    return response;
}, (error: any) => {
    store.dispatch(hideBar());
    return Promise.reject(error);
});

export default API
