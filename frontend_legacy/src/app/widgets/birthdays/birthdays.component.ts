import { Component, OnInit } from '@angular/core';
import { AbstractWidget } from '../abstractwidget.component';
import { ApiService } from '../../api.service';
import { RequestCacheService} from '../../request-cache.service'

@Component({
    templateUrl: './birthdays.component.html',
    styleUrls: ['../widgets.component.scss']
})
export class WidgetBirthdaysComponent extends AbstractWidget implements OnInit {

    birthdays : any[];

    constructor(_apiService: ApiService, _cache: RequestCacheService) {
        super(_apiService, _cache) ;
    }

    ngOnInit() {
        this._apiService.get("birthdays?days=7").subscribe(
            (data:{"birthdays": any[]}) => {
                this.birthdays = data.birthdays
            },
            err => {console.log(err)}
        );
    }

}
