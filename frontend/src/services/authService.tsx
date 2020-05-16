import { AxiosError, AxiosResponse } from "axios";
import { Auth } from "../models/auth";
import { apiService } from "./apiService";
import React, { createContext, useState } from "react";
import { authService } from "../App";

export const AuthContext = createContext<Auth | null>(null);

export const AuthProvider: React.FunctionComponent = ({ children }) => {
    let [auth, setAuth] = useState<Auth | null>(null);

    authService.getAuth().then((u) => {
        setAuth(u);
    });

    if (auth != null) {
        return (
            <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
        );
    }

    return <p>Loading</p>;
};

export class AuthService {
    isAuthenticated = false;
    isStaff = false;
    auth: Auth | null = null;

    checkAuth(): Promise<Auth | null> {
        return new Promise((resolve, reject) => {
            apiService
                .get<Auth>("/auth/check")
                .then((response: AxiosResponse) => {
                    if (response.data.userId) {
                        this.auth = {
                            id: response.data.userId,
                            firstName: response.data.firstName,
                            lastName: response.data.lastName,
                            promotion: response.data.promotion,
                            isStaff: response.data.isStaff,
                        };

                        this.isAuthenticated = true;
                        this.isStaff = this.auth.isStaff;

                        resolve(this.auth);
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

    getAuth(): Promise<Auth> {
        return new Promise<Auth>((resolve, reject) => {
            if (this.auth != null) {
                return resolve(this.auth);
            }

            this.checkAuth()
                .then((auth) => {
                    if (auth == null) {
                        return reject("Not logged in");
                    } else {
                        return resolve(auth);
                    }
                })
                .catch((err) => {
                    return reject(err);
                });
        });
    }

    signOut() {
        this.isAuthenticated = false;
        this.isStaff = false;
        this.auth = null;

        return apiService.get<Auth>("/auth/logout");
    }
}
