import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
declare var UIkit: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  files: any = [];
  constructor(private _apiService: ApiService,
              private router: Router) { }

  ngOnInit() {
    // Check if the user is already connected
    if (!this._apiService.checkAuthentication()) {
      this.router.navigate(['login'])
      return
    } else {
      this.updateList(false)
    }
  }

  updateList(notify: boolean) {
    // Get list of files
    this._apiService.getFiles("").subscribe(
      data => {
        this.files = data
        if (notify) {
          UIkit.notification("<span uk-icon='icon: close'></span> List updated!", { pos: 'bottom-right', status: 'warning', timeout: 10000 });
        }
      },
      err => {
        UIkit.notification("<span uk-icon='icon: close'></span> Something really bad happened :(", { pos: 'bottom-right', status: 'warning', timeout: 10000 });
      }
    )
  }

  delete(storageKey: string) {
    this._apiService.deleteFile(storageKey).subscribe(
      data => {
        UIkit.notification("<span uk-icon='icon: close'></span> File successfully deleted!", { pos: 'bottom-right', status: 'warning', timeout: 10000 });
        this.updateList(false);
      },
      err => {
        UIkit.notification("<span uk-icon='icon: close'></span> Something really bad happened :(", { pos: 'bottom-right', status: 'warning', timeout: 10000 });
      }
    )
  }

}
