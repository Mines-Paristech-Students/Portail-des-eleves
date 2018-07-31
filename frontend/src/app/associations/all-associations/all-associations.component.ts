import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../api.service";

@Component({
  selector: 'app-all-associations',
  templateUrl: './all-associations.component.html',
  styleUrls: ['./all-associations.component.scss']
})
export class AllAssociationsComponent implements OnInit {

	list_associations_long : any[]

	constructor(private _apiService: ApiService) { }

	ngOnInit() {
		this._apiService.list_associations(0).subscribe(
			data=> {
				this.list_associations_long = <any []>data;
				console.log(data);
			}
		);
	}

}