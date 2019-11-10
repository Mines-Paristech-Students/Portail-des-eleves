import { AxiosError, AxiosResponse } from "axios";
import { User } from "../models/user";
import { apiService } from "./apiService";

export class AuthService {
    isAuthenticated = false;

    checkAuth(): Promise<User | null> {
        return new Promise((resolve, reject) => {
            apiService
                .get<User>("/auth/check")
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
                    if (error.response && error.response.status === 401) {
                        resolve(null);
                    } else {
                        reject(error);
                    }
                });
        });
    }

    signOut() {
        this.isAuthenticated = false;
        return apiService.get<User>("/auth/logout");
    }
}
