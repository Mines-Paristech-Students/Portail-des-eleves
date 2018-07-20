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

  constructor(private _apiService: ApiService,
    private router: Router) { }

  ngOnInit() {
      // Check if the user is already connected
      this._apiService.checkAuthentication().subscribe(
        data => {
          console.log('HomeComponent')
          console.log(data)
        },
        err => {
          console.log('HomeComponent')
          console.log(err);
          this.router.navigate(['/login'])
        }
      )
  }
}
