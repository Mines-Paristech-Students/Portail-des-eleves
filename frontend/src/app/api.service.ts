import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

import { User } from './../app/user';
import { environment } from './../environments/environment';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const server = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class ApiService {

    header: any;

    constructor(public http: HttpClient, private cookieService: CookieService) {}

    get<T>(url: String){
        return this.http.get<T>(
            server + url,
        );
    }

    post<T>(url: String, body: any){
        return this.http.post<T>(
            server + url,
            body
        )
    }

    put<T>(url: String, body: any){
        return this.http.put<T>(
            server + url,
            body
        )
    }

    delete<T>(url: String){
        return this.http.delete<T>(
            server + url
        )
    }

    checkAuthentication() {
        return this.post(
            "auth/check/",
            null
        );
    }

    authenticate(login: string, password: string) {
        return this.post(
            "auth/",
            {"id": login, "password": password}
        );
    }

    logout(){
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
