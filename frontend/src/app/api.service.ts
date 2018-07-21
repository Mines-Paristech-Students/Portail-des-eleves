import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { isDevMode } from '@angular/core';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const server = "http://localhost:8000/api/v1/";

@Injectable({ providedIn: 'root' })
export class ApiService {

    header: any;

    constructor(private http: HttpClient,
                private cookieService: CookieService) {
        this.header = new HttpHeaders().set('X-REQUESTED-WITH', 'XMLHttpRequest');
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
            {"pseudo": login, "password": password},
            {withCredentials: true}
        )
    },

    logout(){
        this.cookieService.set("jwt_access_token", "");
        // Why simply deleting the cookie does not work ?
        // If you have an idea, please write me on Slack
    },

    getUser() {
        return this.http.get("auth/get_user/")
    },

    getFiles(storageKey: string) {
        return this.http.post(
            "/api/v1/files",
            { "StorageKey": storageKey },
            { headers: this.header })
    }

    postFiles(filename: string, dowloadsLeft: number, expiresIn: number, rawData: string) {
        return this.http.post(
            "/api/v1/files/new",
            {
                "Filename": filename,
                "DownloadsLeft": dowloadsLeft,
                "ExpiresIn": expiresIn,
                "RawData": rawData
            },
            { headers: this.header})
    }

    downloadFile(storageKey: string) {
        return this.http.post(
            "/api/v1/files/download",
            { "StorageKey": storageKey },
            { headers: this.header })
    }

    deleteFile(storageKey: string) {
        return this.http.post(
            "/api/v1/files/delete",
            { "StorageKey": storageKey },
            { headers: this.header })
    }
}
