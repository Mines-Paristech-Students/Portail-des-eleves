import Axios, { AxiosError, AxiosResponse } from "axios";
import { User } from "../models/user";
import applyConverters from "axios-case-converter";

const baseApi = "http://localhost:8000/api/v1";
const transport = applyConverters(
    Axios.create({
        withCredentials: true
    })
);

export class AuthService {
    isAuthenticated = false;

    checkAuth(): Promise<User | null> {
        return new Promise((resolve, reject) => {
            transport
                .get<User>(baseApi + "/auth/check")
                .then((response: AxiosResponse) => {
                    if (response.data.userId) {
                        this.isAuthenticated = true;
                        const user: User = {
                            id: response.data.userId as string,
                            lastName: response.data.lastName as string,
                            firstName: response.data.firstName as string
                        };
                        resolve(user);
                    } else {
                        reject("not authenticated");
                    }
                })
                .catch((error: AxiosError) => {
                    if (error.response && error.response.status === 401){
                        resolve(null);
                    } else {
                        reject(error);
                    }
                });
        });
    }

    signOut() {
        this.isAuthenticated = false;
        return transport.get<User>(baseApi + "/auth/logout");
    }
}
