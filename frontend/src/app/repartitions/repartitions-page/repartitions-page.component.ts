import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../api.service";
import {Repartition, Proposition} from "../../models/repartition";
import {ActivatedRoute, Router} from "@angular/router";
import { EditorOption } from 'angular-markdown-editor';
import { RequestCacheService} from '../../request-cache.service'

@Component({
  selector: 'repartitions-page',
  templateUrl: './repartitions-page.component.html',
  styleUrls: ['./repartitions-page.component.scss']
})

// Act as a controller also

export class RepartitionsPageComponent implements OnInit {

    campagnes: Repartition[];
    displayParameters: any;
    error: any;
    status = "";
    messages: string[];

    constructor(
        private api: ApiService,
        private route: ActivatedRoute,
        private router: Router,
        private cache: RequestCacheService){}

    ngOnInit() {
        this.error = null;
        this.displayParameters = {canEdit: false, receivedBase: false, receivedCanEdit: false, // data reception
            editingNew: false, //current status
            shouldDisplayEmptyMessage: false, shouldDisplayLoader: true}; //autocomputed

        this.api.get<[Repartition]>("repartitions/all").subscribe(
            campagnes =>
            {
                this.displayParameters.receivedBase = true;
                this.messages = []
                this.campagnes = []
                for(let cmpg of campagnes)
                {
                    this.messages.push(null)
                    var n = new Repartition();
                    n.id = cmpg.id;
                    n.status = cmpg.status;
                    n.promotion = ""+cmpg.promotion;
                    n.title = ""+cmpg.title;
                    n.equirepartition = cmpg.equirepartition;
                    n.propositions = [];
                    this.campagnes.push(n);
                }
                this.updateDisplayParameters();
            },
            error => {
                this.displayParameters.receivedBase = true;
                this.error = error;
                console.log(error);
                this.updateDisplayParameters();
            }
        );
        this.api.get<boolean>("repartitions/canEdit").subscribe(
            res =>
            {
                this.displayParameters.receivedCanEdit = true;
                this.displayParameters.canEdit = res;
                this.updateDisplayParameters();
            },
            error => {
                this.displayParameters.receivedCanEdit = true;
                this.error = error;
                console.log(error);
                this.updateDisplayParameters();
            }
        );
    }

    updateDisplayParameters() {
        var allReceived = this.displayParameters.receivedCanEdit && this.displayParameters.receivedBase;
        this.displayParameters.shouldDisplayEmptyMessage = allReceived && !this.displayParameters.canEdit && this.campagnes.length == 0;
        this.displayParameters.shouldDisplayLoader = !allReceived;
    }

    onNewRequested() {
        var n: Repartition;
        n = new Repartition();
        n.id = null;
        n.title = "Nouvelle repartition";
        n.status = null;
        n.propositions = [];
        n.equirepartition = true;
        this.displayParameters.editingNew = true;

        this.messages.unshift(null);
        this.campagnes.unshift(n);
    }

    onCampaignSubmitRequested(id: number)
    {
        var i = 0;
        while(i < this.campagnes.length)
        {
            if(this.campagnes[i].id == id)
            {
                this.messages[i] = null;
                this.messages[i] = ("Not implemented");
            }
            i++;
        }
    }

    onCampaignDeletionRequested(id: number)
    {
        console.log(id)
        if(id == null)
        {
            var i = 0;
            this.displayParameters.editingNew = false;
            this.messages.shift();
            this.campagnes.shift();
            this.updateDisplayParameters()
            return
        }
        var i = 0;
        while(i < this.campagnes.length)
        {
            if(this.campagnes[i].id == id)
            {
                this.messages[i] = null;
                this.messages[i] = ("Not implemented");
            }
            i++;
        }
    }

    onCampaignStartRequested(id: number)
    {
        var i = 0;
        while(i < this.campagnes.length)
        {
            if(this.campagnes[i].id == id)
            {
                this.messages[i] = null;
                this.messages[i] = ("Not implemented");
            }
            i++;
        }
    }

}
