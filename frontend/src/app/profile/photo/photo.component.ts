import {Component, Input, OnInit} from '@angular/core';
import {User} from "../../models/user";

@Component({
    selector: 'profile-photo',
    templateUrl: './photo.component.html',
    styleUrls: ['./photo.component.scss']
})
export class PhotoComponent implements OnInit {

    @Input() user: User;
    @Input() size = "xxl" ;
    @Input() extra_classes = "";

    constructor() { }

    ngOnInit() {
    }

}
