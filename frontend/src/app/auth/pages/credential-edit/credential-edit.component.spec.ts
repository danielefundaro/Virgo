import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CredentialEditComponent } from './credential-edit.component';

describe('CredentialEditComponent', () => {
    let component: CredentialEditComponent;
    let fixture: ComponentFixture<CredentialEditComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CredentialEditComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CredentialEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
