import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {ApiService} from "../../api.service";

@Component({
  selector: 'repartitions-sidebar',
  templateUrl: './repartitions-sidebar.component.html',
  styleUrls: ['./repartitions-sidebar.component.scss']
})

export class RepartitionsSidebarComponent implements OnInit {

    @Input() campagnes: any
    @Input() displayParameters: any

    constructor(private apiService: ApiService) { }

    ngOnInit() {
    	console.log("EUSSOU")
    }

}
