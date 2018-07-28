import { Component, OnInit } from '@angular/core';
import {ApiService} from "../api.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user: any ;
  error: any ;

  constructor(private api: ApiService, private route: ActivatedRoute) { }

  ngOnInit() {
      const id = this.route.snapshot.paramMap.get('id');
      this.api.get("rest/users/" + id + "/").subscribe(
          user => this.user = user,
              error => {
              this.error = error
              console.log(error)
      })
  }

}
