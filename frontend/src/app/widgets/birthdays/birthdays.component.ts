import { Component, OnInit } from '@angular/core';
import { AbstractWidget } from '../abstractwidget.component';
import { ApiService } from '../../api.service';

@Component({
    templateUrl: './birthdays.component.html',
    styleUrls: ['../widgets.component.scss']
})
export class WidgetBirthdaysComponent extends AbstractWidget implements OnInit {

    birthdays : any[];

    constructor(_apiService: ApiService) {
        super(_apiService) ;
    }

    ngOnInit() {
        this._apiService.get("birthdays/365/").subscribe(
            (data:{"birthdays": any[]}) => {
                this.birthdays = data.birthdays
                console.log(this.birthdays)
            },
            err => {console.log(err)}
        );
    }

}
