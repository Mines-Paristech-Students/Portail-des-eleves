import {Component, Input} from '@angular/core';

@Component({
    selector: 'association-sidebar',
    templateUrl: './association-sidebar.component.html',
    styleUrls: ['./association-sidebar.component.scss']
})
export class AssociationSidebarComponent  {

    @Input() association: any;

}
