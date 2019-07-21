import { Component, OnInit } from '@angular/core';
import { ApiService } from "../api.service";

@Component({
    selector: 'app-rer-timetable',
    templateUrl: './rer-timetable.component.html',
    styleUrls: ['./rer-timetable.component.scss']
})
export class RerTimetableComponent implements OnInit {

    trains: {};
    error = "";
    close_stops = ["Luxembourg", "Port-Royal"];

    constructor(private apiService: ApiService) {
    }

    ngOnInit() {
        this.apiService.get("rer").subscribe(
            res => this.trains = res["trains"],
            error => this.error = error
        )
    }

}
