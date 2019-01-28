import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';

import { ApiService } from '../api.service';
import widgets from '../widgets/widgets.component'

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    is_settings_displayed: boolean;
    widgets: {"name": string, "displayed": boolean}[]
    associations: any[];
    status_message_html: string;

    constructor(private _apiService: ApiService) {
    }

    ngOnInit() {
        this.is_settings_displayed = false;
        this.status_message_html = "";
        this.widgets =  widgets.map(
            res => {
                return {
                    "name": res.display_name,
                    "displayed": false
                }
            }
        )
        this._apiService.get("subscriptions/get_associations/").subscribe(
            (data:{"associations": any[]}) => {
                this.associations = data.associations
            },
            err => {
                console.log(err)
            }
        )
        this._apiService.get("subscriptions/get_widgets/").subscribe(
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
        this._apiService.post("subscriptions/", {"widgets": this.widgets, "associations": this.associations}).subscribe(
            res => {
                this.is_settings_displayed = false;
            },
            err => this.setErrorMessage(err)
        )
    }

    cleanStatusMessageLater(sec: number){
        timer(sec*1000).subscribe(
            val => {
                this.status_message_html = ""
            }
        )
    }
    setErrorMessage(mess: string){
        this.status_message_html = `<p class="text-red">${mess}</p>`
        this.cleanStatusMessageLater(500)
    }

    setSuccessMessage(mess: string){
        this.status_message_html = `<p class="text-green">${mess}</p>`
        this.cleanStatusMessageLater(5)
    }

}
