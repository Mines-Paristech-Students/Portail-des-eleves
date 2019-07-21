import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../api.service";

@Component({
  selector: 'app-all-associations',
  templateUrl: './all-associations.component.html',
  styleUrls: ['./all-associations.component.scss']
})
export class AllAssociationsComponent implements OnInit {

	associations : any[];

	constructor(private _apiService: ApiService) { }

	ngOnInit() {
		this._apiService.get<any []>("associations/").subscribe(res => {
            this.associations = res
        })
	}

}
