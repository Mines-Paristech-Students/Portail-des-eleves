import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {ApiService} from "../../api.service";

@Component({
  selector: 'repartitions-carte-campagne',
  templateUrl: './repartitions-carte-campagne.component.html',
  styleUrls: ['./repartitions-carte-campagne.component.scss']
})
export class RepartitionsCarteCampagneComponent implements OnInit {

  @Input() campagne: any

  constructor(private apiService: ApiService) { }

  ngOnInit() {
  }

}
