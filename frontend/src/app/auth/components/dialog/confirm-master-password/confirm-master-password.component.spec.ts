import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmMasterPasswordComponent } from './confirm-master-password.component';

describe('ConfirmMasterPasswordComponent', () => {
  let component: ConfirmMasterPasswordComponent;
  let fixture: ComponentFixture<ConfirmMasterPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmMasterPasswordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmMasterPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
