import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPassordComponent } from './new-passord.component';

describe('NewPassordComponent', () => {
  let component: NewPassordComponent;
  let fixture: ComponentFixture<NewPassordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewPassordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPassordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
