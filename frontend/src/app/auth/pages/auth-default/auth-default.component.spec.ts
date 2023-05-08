import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthDefaultComponent } from './auth-default.component';

describe('AuthDefaultComponent', () => {
    let component: AuthDefaultComponent;
    let fixture: ComponentFixture<AuthDefaultComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AuthDefaultComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(AuthDefaultComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
