import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KnowledgeViewComponent } from './knowledge-view.component';

describe('KnowledgeViewComponent', () => {
  let component: KnowledgeViewComponent;
  let fixture: ComponentFixture<KnowledgeViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KnowledgeViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KnowledgeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
