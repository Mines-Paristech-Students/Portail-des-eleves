import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../api.service";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'app-association-show',
    templateUrl: './association-show.component.html',
    styleUrls: ['./association-show.component.scss']
})
export class AssociationShowComponent implements OnInit {

    association: any ;

    user: any ;
  error: any ;

  constructor(private api: ApiService, private route: ActivatedRoute) { }

  ngOnInit() {
      const id = this.route.snapshot.paramMap.get('id');
      this.api.get("rest/associations/" + id + "/").subscribe(
          association => this.association = association,
              error => {
              this.error = error
              console.log(error)
      })
  }

}
