import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConceptViewComponent } from './concept-view.component';

describe('ConceptViewComponent', () => {
  let component: ConceptViewComponent;
  let fixture: ComponentFixture<ConceptViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConceptViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConceptViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
