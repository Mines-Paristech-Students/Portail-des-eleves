import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import {ApiService} from "../../api.service";
import {Repartition, Proposition} from "../../models/repartition";

@Component({
    selector: 'repartitions-carte-campagne',
    templateUrl: './repartitions-carte-campagne.component.html',
    styleUrls: ['./repartitions-carte-campagne.component.scss']
})
export class RepartitionsCarteCampagneComponent implements OnInit {

    @Input() campagne: Repartition;
    @Input() displayParameters: any;
    @Output() onSubmitRequested = new EventEmitter<any>();
    @Output() onDeletionRequested = new EventEmitter<any>();
    @Output() onStartRequested = new EventEmitter<any>();
    @Output() onStopRequested = new EventEmitter<any>();
    @Output() onPositionIncreaseRequested = new EventEmitter<any>();
    @Output() onPositionDecreaseRequested = new EventEmitter<any>();

    asAdmin: boolean;
    edit_campagne: Repartition;
    shownMessage: string;

    // state variable
    isEditing: boolean;
    waitingSubmitReply: boolean;
    waitingDeletionReply: boolean;
    waitingStartReply: boolean;
    waitingStopReply: boolean;
    reorderingActionsPending: number;
    controlLock: boolean;

    ngOnInit() {
        this.shownMessage = null;
        this.asAdmin = (this.campagne.id == null);
        this.waitingSubmitReply = false;
        this.waitingDeletionReply = false;
        this.waitingStartReply = false;
        this.waitingStopReply = false;
        this.controlLock = false;
        this.reorderingActionsPending = 0;
        if (this.campagne.id == null) this.startEditing();
        else this.isEditing = false;
    }

    cancelEdition() {
        if (this.controlLock) return;
        if (this.campagne.id == null) this.deleteCampaign();
        this.isEditing = false;
    }

    startEditing() {
        if (this.controlLock) return;
        this.clearMessage();
        this.edit_campagne = this.campagne.clone();
        this.isEditing = true;
    }

    displayMessage(msg: string) {
        this.shownMessage = msg
    }

    clearMessage() {
        this.displayMessage(null)
    }

    increasePosition(i: number) {
        this.reorderingActionsPending += 1;
        this.onPositionIncreaseRequested.emit({
            id: this.campagne.id,
            pos: i,
            callback: (ok: boolean, msg: any) => this.handleReorderRep(ok, msg)
        });
    }

    decreasePosition(i: number) {
        this.reorderingActionsPending += 1;
        this.onPositionDecreaseRequested.emit({
            id: this.campagne.id,
            pos: i,
            callback: (ok: boolean, msg: any) => this.handleReorderRep(ok, msg)
        });
    }

    handleReorderRep(ok: boolean, msg: any) {
        this.reorderingActionsPending -= 1;
        if (!ok) {
            this.displayMessage("Carte desynchronisée");
            return;
        }
        if (this.reorderingActionsPending == 0) {
            this.campagne.voeux = [];
            for (let i of msg) {
                this.campagne.voeux.push(i);
            }
        }
    }

    submitInput() {
        if (this.controlLock) return;
        this.controlLock = true;
        this.clearMessage();
        this.waitingSubmitReply = true;
        this.onSubmitRequested.emit({
            id: this.campagne.id,
            edited: this.edit_campagne,
            callback: (ok: boolean, err: string) => this.handleReply(ok, err)
        })
    }

    deleteCampaign() {
        if (this.controlLock) return;
        this.controlLock = true;
        this.clearMessage();
        this.waitingDeletionReply = true;
        this.onDeletionRequested.emit({
            id: this.campagne.id,
            callback: (ok: boolean, err: string) => this.handleReply(ok, err)
        });
    }

    startCampaign() {
        if (this.controlLock) return;
        this.controlLock = true;
        this.clearMessage();
        this.waitingStartReply = true;
        this.onStartRequested.emit({
            id: this.campagne.id,
            callback: (ok: boolean, err: string) => this.handleReply(ok, err)
        });
    }

    stopCampaign() {
        if (this.controlLock) return;
        this.controlLock = true;
        this.clearMessage();
        this.waitingStopReply = true;
        this.onStopRequested.emit({
            id: this.campagne.id,
            callback: (ok: boolean, err: string) => this.handleReply(ok, err)
        });
    }

    terminateAction(msg: any) {
        if (this.waitingSubmitReply || this.waitingStartReply || this.waitingStopReply) {
            this.campagne.id = msg.id;
            this.campagne.status = msg.status;
            this.campagne.promotion = msg.promotion;
            this.campagne.title = msg.title;
            this.campagne.equirepartition = msg.equirepartition;
            this.campagne.resultat = msg.resultat;
            this.campagne.propositions = [];
            this.campagne.progress = msg.progress;
            this.campagne.voeux = [];
            for (let j of msg.voeux) {
                this.campagne.voeux.push(j)
            }

            for (let p of msg.propositions) {
                const np = new Proposition();
                np.max = p.max;
                np.min = p.min;
                np.name = p.name;
                np.id = p.num;
                this.campagne.propositions.push(np)
            }
            this.edit_campagne = null;
            this.isEditing = false;
        }
        this.clearMessage();
        this.waitingSubmitReply = false;
        this.waitingStartReply = false;
        this.waitingStopReply = false;
        this.waitingDeletionReply = false;
        this.controlLock = false;
    }

    abortActionWithMessage(msg: any) {
        this.displayMessage(msg.hasOwnProperty("message") ? msg.message : msg);
        this.waitingSubmitReply = false;
        this.waitingStartReply = false;
        this.waitingStopReply = false;
        this.waitingDeletionReply = false;
        this.controlLock = false;
    }

    handleReply(result: boolean, msg: any) {
        if (result) this.terminateAction(msg);
        else this.abortActionWithMessage(msg);
    }

    deleteProposition(j: number) {
        this.edit_campagne.propositions.splice(j, 1);
    }

    newProposition() {
        const np = new Proposition();
        np.max = 999;
        np.min = 0;
        np.name = "";
        np.id = 0;
        this.edit_campagne.propositions.push(np);
    }
}
