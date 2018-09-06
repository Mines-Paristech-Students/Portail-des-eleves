import { Component, OnInit } from '@angular/core';
import {User} from "../user";
import {ApiService} from "../api.service";

/**
 * IMPORTANT NOTE
 * This is NOT a component that interacts in a way or another with facebook.com (in a nutshell, the social network)
 * This component is called "facebook" because it's the closest translation of the french "trombinoscope"
 */

@Component({
    selector: 'app-facebook',
    templateUrl: './facebook.component.html',
    styleUrls: ['./facebook.component.scss']
})
export class FacebookComponent implements OnInit {

    users: [User] ;

    constructor(private apiService: ApiService) { }

    ngOnInit() {
        this.apiService.getUsers().subscribe(
            data => {
                this.users = data;
            },
            err => {
                console.log(err)
            }
        )
    }

}
