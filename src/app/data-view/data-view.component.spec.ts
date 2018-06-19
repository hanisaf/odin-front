import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataViewComponent } from './data-view.component';
import { MatIconModule,MatSelectModule, MatOptionModule, MatFormFieldModule, MatStepperModule, MatTooltipModule, MatToolbarModule, MatTabsModule, MatTableModule, MatSortModule, MatSnackBarModule, MatSlideToggleModule, MatSliderModule, MatSidenavModule, MatRadioModule, MatProgressSpinnerModule, MatProgressBarModule, MatPaginatorModule, MatMenuModule, MatListModule, MatInputModule, MatGridListModule, MatExpansionModule, MatDialogModule, MatDatepickerModule, MatChipsModule, MatCheckboxModule, MatCardModule, MatButtonToggleModule, MatButtonModule, MatAutocompleteModule } from '@angular/material';
import { MessageService } from '../message.service';
import { FormsModule } from '@angular/forms';
import { ElasticService } from '../elastic.service';
import { HttpHandler, HttpClient } from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'; 

describe('DataViewComponent', () => {
  let component: DataViewComponent;
  let fixture: ComponentFixture<DataViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatIconModule,MatSelectModule,MatOptionModule,MatFormFieldModule,FormsModule,MatAutocompleteModule,MatButtonModule,MatButtonToggleModule,MatCardModule,
        MatCheckboxModule,MatChipsModule,MatDatepickerModule,MatDialogModule,MatExpansionModule,MatFormFieldModule,MatGridListModule,MatIconModule,MatInputModule, 
        MatListModule,MatMenuModule,MatPaginatorModule,MatProgressBarModule,MatProgressSpinnerModule,MatRadioModule,MatSelectModule,MatSidenavModule,
        MatSliderModule,MatSlideToggleModule,MatSnackBarModule,MatSortModule,MatTableModule,MatTabsModule,MatToolbarModule,MatTooltipModule,MatStepperModule,
        BrowserAnimationsModule],
      declarations: [ DataViewComponent],
      providers: [MessageService,ElasticService,HttpClient, HttpHandler]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
