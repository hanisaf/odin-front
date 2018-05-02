import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationViewComponent } from './navigation-view.component';
import { FormsModule } from '@angular/forms';
import { MatButtonModule, MatFormFieldModule } from '@angular/material';
import { ConceptViewComponent } from '../concept-view/concept-view.component';

describe('NavigationViewComponent', () => {
  let component: NavigationViewComponent;
  let fixture: ComponentFixture<NavigationViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavigationViewComponent ],
      imports: [ FormsModule,  MatButtonModule, MatFormFieldModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  // it('Should at least have one concept',()=>{
  //   expect(component.concepts.length).toBeGreaterThan(0);
  // });
  
  it('Basic logic',()=>{
    expect(2+2).toEqual(4);
  });
});
describe('TestComponent', () => {
  it('Multiply logic',()=>{
    expect(2*2).toEqual(4);
  });
});