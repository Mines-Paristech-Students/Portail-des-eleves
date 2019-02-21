import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';

import { ApiService } from '../api.service';
import widgets from '../widgets/widgets.component'
import { NotifierService } from 'angular-notifier';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    is_settings_displayed: boolean;
    widgets: {"name": string, "displayed": boolean}[]
    associations: any[];

    constructor(private apiService: ApiService, private notifier: NotifierService) {
    }

    ngOnInit() {
        this.is_settings_displayed = false;
        this.widgets =  widgets.map(
            res => {
                return {
                    "name": res.display_name,
                    "displayed": false
                }
            }
        )
        this.apiService.get("subscriptions/get_associations/").subscribe(
            (data:{"associations": any[]}) => {
                this.associations = data.associations
            },
            err => {
                console.log(err)
            }
        )
        this.apiService.get("subscriptions/get_widgets/").subscribe(
            (data:{"widgets": {"name": string, "displayed": boolean}[]}) => {
                this.widgets = data.widgets
            },
            err => {
                console.log(err)
            }
        )
    }

    modifyLayout() {
        this.is_settings_displayed = true;
    }

    saveSettings() {
        this.apiService.post("subscriptions/", {"widgets": this.widgets, "associations": this.associations}).subscribe(
            res => {
                this.is_settings_displayed = false;
                this.notifier.notify('success', "Paramètres mis à jour !")
            },
            err => this.notifier.notify('error', err)
        )
    }
}
