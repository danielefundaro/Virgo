import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MassiveActionsComponent } from './massive-actions.component';

describe('MassiveActionsComponent', () => {
    let component: MassiveActionsComponent;
    let fixture: ComponentFixture<MassiveActionsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MassiveActionsComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(MassiveActionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
