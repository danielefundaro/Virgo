import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeWorkspaceComponent } from './change-workspace.component';

describe('ChangeWorkspaceComponent', () => {
  let component: ChangeWorkspaceComponent;
  let fixture: ComponentFixture<ChangeWorkspaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeWorkspaceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeWorkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
