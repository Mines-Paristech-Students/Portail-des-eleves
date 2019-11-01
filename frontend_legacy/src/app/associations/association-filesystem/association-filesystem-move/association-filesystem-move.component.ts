import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApiService } from "../../../api.service";
import { NgbDropdownConfig } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'app-association-filesystem-move',
    templateUrl: './association-filesystem-move.component.html',
    styleUrls: ['./association-filesystem-move.component.scss'],
    providers: [AssociationFilesystemMoveComponent]
})
export class AssociationFilesystemMoveComponent implements OnInit {

    @Input() file: any;
    @Output() movedFile: EventEmitter<any>;
    current_dir: any;
    err: any;

    constructor(private api: ApiService, private config: NgbDropdownConfig) {
        config.autoClose = false;
        this.movedFile = new EventEmitter<any>();
    }

    ngOnInit() {

        if (this.file.folder) {
            this.moveTo(this.file.folder);
        } else {
            this.moveToRoot();
        }

    }

    moveTo(dir_id) {
        this.api.get(`folder/${dir_id}`).subscribe(
            res => {
                console.log(res);
                this.current_dir = res
            },
            err => this.err = err.message
        )
    }

    moveToRoot() {
        this.api.get(`associations/${this.file.association}/filesystem/root`).subscribe(
            res => {
                console.log(res);
                this.current_dir = res
            },
            err => this.err = err.message
        )
    }

    moveFile(){
        let input = new FormData();
        let target_id = this.current_dir.id;
        if (!this.current_dir.id){
            target_id = "" ;
        }

        input.append('folder', target_id);

        this.api.patch(`file/${this.file.id}/`, input).subscribe(
            res => this.movedFile.emit(res),
            err => this.err = err.message
        )
    }
}
