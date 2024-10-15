import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListGroupSelectComponent } from './list-group-select.component';

describe('ListGroupSelectComponent', () => {
  let component: ListGroupSelectComponent;
  let fixture: ComponentFixture<ListGroupSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListGroupSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListGroupSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
