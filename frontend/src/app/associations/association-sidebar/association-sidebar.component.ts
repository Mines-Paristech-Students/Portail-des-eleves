import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {ApiService} from "../../api.service";

@Component({
    selector: 'association-sidebar',
    templateUrl: './association-sidebar.component.html',
    styleUrls: ['./association-sidebar.component.scss']
})
export class AssociationSidebarComponent  {

    @Input() association: any;

}
