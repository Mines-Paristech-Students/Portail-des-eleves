import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../api.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-profile',
  templateUrl: './profile-show.component.html',
  styleUrls: ['./profile-show.component.scss']
})
export class ProfileShowComponent implements OnInit {

  user: any ;
  error: any ;

  constructor(private api: ApiService, private route: ActivatedRoute) { }

  ngOnInit() {
      const id = this.route.snapshot.paramMap.get('id');
      this.api.get("users/" + id + "/").subscribe(
          user => this.user = user,
              error => {
              this.error = error;
              console.log(error)
      })
  }

}
