import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../api.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit {

  user: any ;
  error: any ;

  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
      const id = this.route.snapshot.paramMap.get('id');
      this.api.get("users/" + id + "/").subscribe(
          user => this.user = user,
              error => {
              this.error = error;
              console.log(error)
      })
  }

  onSubmit(){
      this.api.put("users/" + this.user.id + "/", this.user).subscribe(
          _ => this.router.navigate(["user/" + this.user.id]),
          err => this.error = err
      )
  }

}
