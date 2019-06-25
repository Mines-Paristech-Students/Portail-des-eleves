import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormGroup, Validators, FormBuilder, FormControl} from '@angular/forms';
import {ApiService} from "../../../api.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'app-association-filesystem-addfile',
    templateUrl: './association-filesystem-addfile.component.html',
    styleUrls: ['./association-filesystem-addfile.component.scss']
})
export class AssociationFilesystemAddfileComponent implements OnInit {
    folder: any;
    association: any;

    addFileForm: FormGroup;
    loading: boolean = false;

    folder_id: string;
    association_id: string;

    error: string;

    @ViewChild('fileInput') fileInput: ElementRef;

    constructor(private fb: FormBuilder, private api: ApiService, private router: Router, private route: ActivatedRoute) {
        this.createForm();
    }

    ngOnInit(): void {

        this.route.params.subscribe(
            (params) => {
                this.association_id = params['id'];
                this.folder_id = params['folder_id'];

                this.api.get(`associations/${this.association_id}/`).subscribe(
                    association => this.association = association,
                    error => {
                        this.error = error.message;
                        console.log(error);
                    }
                );

                this.api.get(
                    this.folder_id == undefined ?
                        `associations/${this.association_id}/filesystem/root` :
                        `folder/${this.folder_id}/`
                ).subscribe(
                    folder => this.folder = folder,
                    error => {
                        this.error = error.message;
                        console.log(error);
                    }
                );
            }
        );

    }

    createForm() {
        this.addFileForm = this.fb.group({
            name: new FormControl('', Validators.required),
            description: new FormControl(''),
            file: null
        });
    }

    onFileChange(event) {
        if (event.target.files.length > 0) {
            let file = event.target.files[0];
            this.addFileForm.get('file').setValue(file);
        }
    }

    private prepareSave(): any {
        let input = new FormData();
        input.append('name', this.addFileForm.get('name').value);
        input.append('description', this.addFileForm.get('description').value);
        input.append('file', this.addFileForm.get('file').value);
        input.append('association', this.association.id);

        if (this.folder.id) {
            console.log(this.folder);
            input.append('folder', this.folder.id);
        }

        return input;
    }

    onSubmit() {
        const formModel = this.prepareSave();
        this.loading = true;
        // In a real-world app you'd have a http request / service call here like
        this.api.post('file/', formModel).subscribe(
            (res: any) => {
                this.router.navigate([`associations/${this.association_id}/file/${res.id}`])
            },
            err => console.log(err)
        )
    }
}
