import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../api.service";
import {Repartition, Proposition} from "../../models/repartition";
import {ActivatedRoute, Router} from "@angular/router";
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

    constructor(
        private api: ApiService){}

    ngOnInit() {
        this.error = null;
        this.displayParameters = {canEdit: false, restriction: [], receivedBase: false, receivedCanEdit: false, // data reception
            editingNew: false, //current status
            shouldDisplayEmptyMessage: false, shouldDisplayLoader: true}; //autocomputed

        this.api.get<any[]>("repartitions/").subscribe(
            campagnes =>
            {
                this.displayParameters.receivedBase = true;
                this.campagnes = [];
                for(let cmpg of campagnes)
                {
                    const n = new Repartition();
                    n.id = cmpg.id;
                    n.status = cmpg.status;
                    n.promotion = ""+cmpg.promotion;
                    n.title = ""+cmpg.title;
                    n.equirepartition = cmpg.equirepartition;
                    n.resultat = cmpg.resultat;
                    n.propositions = [];
                    n.progress = cmpg.progress;
                    n.voeux = [];
                    for(let j of cmpg.voeux)
                    {
                        n.voeux.push(j);
                    }
                    for(let p of cmpg.propositions)
                    {
                        const np = new Proposition();
                        np.max = p.max;
                        np.min = p.min;
                        np.name = p.name;
                        np.id = p.num;
                        n.propositions.push(np)
                    }
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
                this.displayParameters.canEdit = res["canEdit"];
                this.displayParameters.restriction = res["restriction"];
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
        const allReceived = this.displayParameters.receivedCanEdit && this.displayParameters.receivedBase;
        this.displayParameters.shouldDisplayEmptyMessage = allReceived && !this.displayParameters.canEdit && this.campagnes.length == 0;
        this.displayParameters.shouldDisplayLoader = !allReceived;
    }

    onNewRequested() {
        let n: Repartition;
        n = new Repartition();
        n.id = null;
        n.title = "Nouvelle repartition";
        n.status = null;
        n.propositions = [];
        n.equirepartition = true;
        n.promotion = "P18";
        n.progress = {};
        n.resultat = null;
        this.displayParameters.editingNew = true;

        this.campagnes.unshift(n);
    }

    onCampaignSubmitRequested(res: any)
    {
        const id = res.id;
        const callback = res.callback;
        const toPut = res.edited;
        if(id == null)
        {
            this.api.put("repartitions/", toPut).subscribe(
                msg => {
                    callback(true, msg);
                    this.displayParameters.editingNew = false;
                    this.updateDisplayParameters()
                },
                err => callback(false, err));
            return;
        }
        this.api.patch("repartitions/"+id, toPut).subscribe(
            msg => {
                callback(true, msg);
                this.updateDisplayParameters()
            },
            err => callback(false, err));
    }

    onCampaignDeletionRequested(res: any)
    {
        const id = res.id;
        const callback = res.callback;
        if(id == null)
        {
            var i = 0;
            this.displayParameters.editingNew = false;
            this.campagnes.shift();
            this.updateDisplayParameters();
            return
        }
        var i = 0; //useless loop
        while(i < this.campagnes.length)
        {
            if(this.campagnes[i].id == id)
            {
                this.api.delete("repartitions/"+id).subscribe(
                    msg =>
                    {
                        callback(true, msg);
                        this.removeCampaignFromList(id);
                    },
                    err => callback(false, err)
                );
            }
            i++;
        }
    }

    onPositionChangeRequested(res: any, direction: string)
    {
        this.api.post("repartitions/changeVoeux", {id: res.id, direction: direction, voeux: res.pos}).subscribe(
            msg=>res.callback(true, msg),
            err=>res.callback(false, err));
    }

    onPositionDecreaseRequested(res: any)
    {
        this.onPositionChangeRequested(res, "down");
    }

    onPositionIncreaseRequested(res: any)
    {
        this.onPositionChangeRequested(res, "up");
    }

    removeCampaignFromList(id: number)
    {
        let i = 0;
        while(i < this.campagnes.length)
        {
            if(this.campagnes[i].id == id)
            {
                this.campagnes.splice(i, 1);
                this.updateDisplayParameters();
                return;
            }
            i++;
        }
    }

    onCampaignStartRequested(res: any)
    {
        const id = res.id;
        const callback = res.callback;
        this.api.post("repartitions/startCampaign", {id: id}).subscribe(
            msg =>
            {
                callback(true, msg);
            },
            err => callback(false, err)
        );
    }

    onCampaignStopRequested(res: any)
    {
        const id = res.id;
        const callback = res.callback;
        this.api.post("repartitions/stopCampaign", {id: id}).subscribe(
            msg =>
            {
                callback(true, msg);
            },
            err => callback(false, err)
        );
    }
}
