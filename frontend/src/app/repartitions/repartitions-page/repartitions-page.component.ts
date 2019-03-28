import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../api.service";
import {Repartition} from "../../models/repartition";
import {ActivatedRoute, Router} from "@angular/router";
import { EditorOption } from 'angular-markdown-editor';
import { RequestCacheService} from '../../request-cache.service'

@Component({
  selector: 'repartitions-page',
  templateUrl: './repartitions-page.component.html',
  styleUrls: ['./repartitions-page.component.scss']
})
export class RepartitionsPageComponent implements OnInit {

    campagnes: any;
    canEdit: boolean;
    displayParameters: any;
    error: any ;
    status = "";

    constructor(
        private api: ApiService,
        private route: ActivatedRoute,
        private router: Router,
        private cache: RequestCacheService){}

    ngOnInit() {
        this.error = null;
        this.campagnes = {notStarted: [], current: [], finished: [], deleted: []};
        this.displayParameters = {canEdit: false, receivedParts: 0, shouldDisplayEmptyMessage: false};
        this.api.get<[Repartition]>("repartitions/all").subscribe(
            campagnes =>
            {
                this.displayParameters.receivedParts++;
                for(var cmpg of campagnes)
                {
                    switch(cmpg.status)
                    {
                        case 0:
                            {
                                this.campagnes.notStarted.push(cmpg)
                                break;
                            }
                        case 1:
                            {
                                this.campagnes.current.push(cmpg)
                                break;
                            }
                        case 2:
                            {
                                this.campagnes.finished.push(cmpg)
                                break;
                            }
                        case 3:
                            {
                                this.campagnes.deleted.push(cmpg)
                                break;
                            }
                    }
                }
                this.displayParameters.shouldDisplayEmptyMessage = (this.displayParameters.receivedParts == 2) && !this.displayParameters.canEdit && (this.campagnes.deleted.length + this.campagnes.current.length + this.campagnes.notStarted.length + this.campagnes.finished.length) == 0;
            },
            error => {
                this.displayParameters.receivedParts++;
                this.error = error;
                console.log(error);
                this.displayParameters.shouldDisplayEmptyMessage = (this.displayParameters.receivedParts == 2) && !this.displayParameters.canEdit && (this.campagnes.deleted.length + this.campagnes.current.length + this.campagnes.notStarted.length + this.campagnes.finished.length) == 0;
            }
        );
        this.api.getUser().subscribe(
            user =>
            {
                this.displayParameters.receivedParts++;
                this.displayParameters.canEdit = user.is_admin;
                this.displayParameters.shouldDisplayEmptyMessage = (this.displayParameters.receivedParts == 2) && !this.displayParameters.canEdit && (this.campagnes.deleted.length + this.campagnes.current.length + this.campagnes.notStarted.length + this.campagnes.finished.length) == 0;
            },
            error => {
                this.displayParameters.receivedParts++;
                this.error = error;
                this.displayParameters.canEdit = false;
                console.log(error);
                this.displayParameters.shouldDisplayEmptyMessage = (this.displayParameters.receivedParts == 2) && !this.displayParameters.canEdit && (this.campagnes.deleted.length + this.campagnes.current.length + this.campagnes.notStarted.length + this.campagnes.finished.length) == 0;
            }
        );
    }
}
