import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociationFilesystemAddfileComponent } from './association-filesystem-addfile.component';

describe('AssociationFilesystemAddfileComponent', () => {
    let component: AssociationFilesystemAddfileComponent;
    let fixture: ComponentFixture<AssociationFilesystemAddfileComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AssociationFilesystemAddfileComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AssociationFilesystemAddfileComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
