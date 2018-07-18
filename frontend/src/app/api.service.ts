import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { isDevMode } from '@angular/core';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const server = "http://localhost:8000/api/v1/";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  header: any;

  constructor(private http: HttpClient,
              private cookieService: CookieService) { }

  checkAuthentication() {
    if (localStorage.getItem("csrf_token") != null) {
      this.header = new HttpHeaders({ 'x-csrf-token': localStorage.getItem("csrf_token") })
      return true
    } else {
      return false
    }
  }

  authenticate(login: string, password: string) {
    return this.http.post(
      server + "auth/",
      {"pseudo": login, "password": password},
      {withCredentials: !isDevMode()})
  }

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
