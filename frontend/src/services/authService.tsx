import { AxiosError, AxiosResponse } from "axios";
import { User } from "../models/user";
import { apiService } from "./apiService";
import React, { createContext, useState } from "react";
import { authService } from "../App";

export const UserContext = createContext<User | null>(null);

export const UserProvider: React.FunctionComponent = ({ children }) => {
    let [user, setUser] = useState<User | null>(null);

    authService.getUser().then(u => {
        setUser(u);
    });

    if (user != null) {
        return (
            <>
                <UserContext.Provider value={user}>
                    {children}
                </UserContext.Provider>
            </>
        );
    }

    return <p>Loading</p>;
};

export class AuthService {
    isAuthenticated = false;
    user: User | null = null;

    checkAuth(): Promise<User | null> {
        return new Promise((resolve, reject) => {
            apiService
                .get<User>("/auth/check")
                .then((response: AxiosResponse) => {
                    if (response.data.userId) {
                        this.isAuthenticated = true;
                        const user: User = {
                            id: response.data.userId,
                            lastName: response.data.lastName,
                            firstName: response.data.firstName,
                            promotion: response.data.promotion
                        };
                        this.user = user;
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

    getUser(): Promise<User> {
        return new Promise<User>((resolve, reject) => {
            if (this.user != null) {
                return resolve(this.user);
            }

            this.checkAuth()
                .then(user => {
                    if (user == null) {
                        return reject("Not logged in");
                    } else {
                        return resolve(user);
                    }
                })
                .catch(err => {
                    return reject(err);
                });
        });
    }

    signOut() {
        this.isAuthenticated = false;
        return apiService.get<User>("/auth/logout");
    }
}
