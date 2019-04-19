import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { ApiService } from "../../../api.service";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpHeaders } from "@angular/common/http";

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
                        `associations/${this.association_id}/folder/${this.folder_id}/`
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
        input.append('association', this.folder.association);
        input.append('folder', this.folder.id);
        return input;
    }

    onSubmit() {
        const formModel = this.prepareSave();
        this.loading = true;
        // In a real-world app you'd have a http request / service call here like
        this.api.post('file/', formModel).subscribe(
            res => alert(res),
            err => console.log(err)
        )
    }

    handleExitButton() {
        alert("TODO !")
    }

    /*addFileForm: FormGroup;

    constructor(private cd: ChangeDetectorRef) {
        this.fileEmitter = new EventEmitter<any>();
        this.exitEmitter = new EventEmitter<boolean>();
    }

    ngOnInit(): void {
        this.addFileForm = new FormGroup({
            name: new FormControl('', Validators.required),
            description: new FormControl(''),
            file: new FormControl('')
        });
    }

    show() {
        console.log(this.addFileForm);
    }



    onFileChange(event) {
        if (event.target.files.length > 0) {
            let file = event.target.files[0];
            this.addFileForm.get('file').setValue(file);
        }
    }*/

    /*
    onFileChange(event) {
        let reader = new FileReader();

        if (event.target.files && event.target.files.length > 0) {
            const [file] = event.target.files;
            reader.readAsDataURL(file);

            reader.onload = () => {
                this.addFileForm.patchValue({
                    file: reader.result
                });

                console.log(this.addFileForm.value);
            };

            this.cd.markForCheck();
        }
    }

    onSubmit() {
        this.fileEmitter.emit(this.addFileForm.value);
    }
    */
}
