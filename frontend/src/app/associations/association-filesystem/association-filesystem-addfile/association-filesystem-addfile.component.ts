import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-association-filesystem-addfile',
    templateUrl: './association-filesystem-addfile.component.html',
    styleUrls: ['./association-filesystem-addfile.component.scss']
})
export class AssociationFilesystemAddfileComponent implements OnInit {
    @Input() folder: any;
    @Output() fileEmitter: EventEmitter<any>;
    @Output() exitEmitter: EventEmitter<boolean>;

    addFileForm: FormGroup;

    constructor(private cd: ChangeDetectorRef) {
        this.fileEmitter = new EventEmitter<any>();
        this.exitEmitter = new EventEmitter<boolean>();
    }

    ngOnInit(): void {
        this.addFileForm = new FormGroup({
            fileName: new FormControl('', Validators.required),
            description: new FormControl(''),
            file: new FormControl('')
        });
    }

    show() {
        console.log(this.addFileForm);
    }

    onSubmit() {
        this.fileEmitter.emit(this.addFileForm.value);
    }

    handleExitButton() {
        this.exitEmitter.emit(true);
    }

    onFileChange(event) {
        let reader = new FileReader();

        if(event.target.files && event.target.files.length) {
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
}
