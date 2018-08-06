import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const server = "http://localhost:8000/api/v1/";

@Injectable({ providedIn: 'root' })
export class ApiService {

    header: any;

    constructor(private http: HttpClient, private cookieService: CookieService) {
        this.header = new HttpHeaders().set('X-REQUESTED-WITH', 'XMLHttpRequest');
    }

    get<T>(url: String){
        return this.http.get<T>(
            server + url,
            {
                headers: this.header,
                withCredentials: true
            }
        )
    }

    post<T>(url: String, body: any){
        return this.http.post<T>(
            server + url, body,
            {
                headers: this.header,
                withCredentials: true
            }
        )
    }

    put<T>(url: String, body: any){
        return this.http.put<T>(
            server + url, body,
            {
                headers: this.header,
                withCredentials: true
            }
        )
    }

    delete<T>(url: String){
        return this.http.delete<T>(
            server + url,
            {
                headers: this.header,
                withCredentials: true
            }
        )
    }

    checkAuthentication() {
        return this.http.post(
            server + "auth/check/",
            null,
            {
                headers: this.header,
                withCredentials: true
            }
        );
    }

    authenticate(login: string, password: string) {
        return this.http.post(
            server + "auth/",
            {"id": login, "password": password},
            {withCredentials: true}
        );
    }

    logout(){
        // Why simply deleting the cookie does not work ?
        // If you have an idea, please write me on Slack
        this.cookieService.set("jwt_access_token", "");
        localStorage.removeItem("user");
    }

    getUser() {
        return this.http.get(server + "auth/current_user/", {withCredentials: true})
    }

}
