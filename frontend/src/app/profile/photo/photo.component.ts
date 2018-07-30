import {Component, Input, OnInit} from '@angular/core';
import {User} from "../../user";

@Component({
    selector: 'profile-photo',
    templateUrl: './photo.component.html',
    styleUrls: ['./photo.component.scss']
})
export class PhotoComponent implements OnInit {

    @Input() user: User;

    constructor() { }

    ngOnInit() {
    }

}
