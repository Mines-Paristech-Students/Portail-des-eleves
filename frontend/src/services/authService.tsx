import { AxiosError, AxiosResponse } from "axios";
import { User } from "../models/user";
import { apiService } from "./apiService";
import React, { createContext, useState } from "react";
import { authService } from "../App";
import { Loading } from "../components/utils/Loading";

export const UserContext = createContext<User | null>(null);

export const UserProvider: React.FunctionComponent = ({ children }) => {
  let [user, setUser] = useState<User | null>(null);

  authService.getUser().then((u) => {
    setUser(u);
  });

  if (user != null) {
    return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
  }

  return <Loading />;
};

export class AuthService {
  isAuthenticated = false;
  isStaff = false;
  user: User | null = null;

  checkUser(): Promise<User | null> {
    return new Promise((resolve, reject) => {
      apiService
        .get<User>("/auth/check")
        .then((response: AxiosResponse) => {
          if (response.data.userId) {
            this.user = {
              id: response.data.userId,
              firstName: response.data.firstName,
              lastName: response.data.lastName,
              promotion: response.data.promotion,
              isStaff: response.data.isStaff,
            };

            this.isAuthenticated = true;
            this.isStaff = this.user.isStaff;

            resolve(this.user);
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

      this.checkUser()
        .then((user) => {
          if (user == null) {
            return reject("Not logged in");
          } else {
            return resolve(user);
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
    this.user = null;

    return apiService.get<User>("/auth/logout");
  }
}
