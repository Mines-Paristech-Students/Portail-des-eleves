import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from "../environments/environment";
import { User } from "./models/user";

const httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
};


@Injectable({providedIn: 'root'})
export class ApiService {

    server = environment.apiUrl;
    header: any;

    constructor(public http: HttpClient, private cookieService: CookieService) {
    }

    get<T>(url: String, params?: HttpParams) {
        return this.http.get<T>(
            this.server + url,
            {params: params}
        );
    }

    post<T>(url: String, body: any, headers: HttpHeaders = undefined) {
        let httpOptions = { headers: headers};

        return this.http.post<T>(
            this.server + url,
            body,
            httpOptions
        )
    }

    put<T>(url: String, body: any) {
        return this.http.put<T>(this.server + url, body)
    }

    patch<T>(url: String, body: any) {
        return this.http.patch<T>(this.server + url, body)
    }

    delete<T>(url: String) {
        return this.http.delete<T>(
            this.server + url
        )
    }

    checkAuthentication() {
        return this.post(
            "auth/check/",
            null
        );
    }


    authenticate(login: string, password: string, stayAuthenticated: boolean) {
        return this.post(
            "auth/",
            {"id": login, "password": password, "longAuth": stayAuthenticated}
        );
    }

    logout() {
        return this.post(
            "auth/logout/",
            null
        );
    }

    getUser() {
        return this.get<User>("users/current/")
    }

    getUsers() {
        return this.get<[User]>("users/");
    }

}
