import { Component, OnInit } from '@angular/core';
import { AbstractWidget } from '../abstractwidget.component';
import { ApiService } from '../../api.service';

@Component({
    templateUrl: './poll.component.html',
    styleUrls: ['../widgets.component.scss']
})
export class WidgetPollComponent extends AbstractWidget implements OnInit {

    constructor(_apiService: ApiService) {
        super(_apiService) ;
    }

    ngOnInit() {
    }

}
