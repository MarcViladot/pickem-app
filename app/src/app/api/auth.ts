import Api from "./api";
import {AxiosError, AxiosResponse} from "axios";
import {ResponseApi, ResponseApiEmpty, ResponseServerError} from "../utils/IResponse";
import {CreateUser, User, UserCredentials} from "../interfaces/user.interface";

export default {

    login(credentials: UserCredentials) {
        return Api.post(`auth/login`, credentials)
            .then((r: AxiosResponse<ResponseApi<User>>) => {
                return r.data
            }, (err: AxiosError) => {
                return new ResponseServerError(err);
            })
    },

    autoLogin() {
        return Api.get(`auth/loginAuth`)
            .then((r: AxiosResponse<ResponseApi<User>>) => {
                return r.data
            }, (err: AxiosError) => {
                return new ResponseServerError(err);
            });
    },

    createUser(data: CreateUser) {
        return Api.post(`auth/create`, data)
            .then((r: AxiosResponse<ResponseApi<User>>) => {
                return r.data
            }, (err: AxiosError) => {
                return new ResponseServerError(err);
            })
    },

    updateUserPhoto(photoUri: string) {
        const data = new FormData();
        data.append('image',
            {
                uri: photoUri,
                name: 'image.jpg',
                type: 'image/jpg'
            });
        return Api.put(`user/updatePhoto`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }).then((r: AxiosResponse<ResponseApi<string>>) => {
            return r.data
        }, (err: AxiosError) => {
            return new ResponseServerError(err);
        })
    },

    removeUserPhoto() {
        return Api.put(`user/removePhoto`, {})
            .then((r: AxiosResponse<ResponseApiEmpty>) => {
                return r.data
            }, (err: AxiosError) => {
                return new ResponseServerError(err);
            })
    }
};
