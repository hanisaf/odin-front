import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConceptViewComponent } from './concept-view.component';
import {  MatIconModule, MatSelectModule, MatOptionModule, MatFormFieldModule, MatStepperModule, MatTooltipModule, MatToolbarModule, MatTabsModule, MatTableModule, MatSortModule, MatSnackBarModule, MatSlideToggleModule, MatSliderModule, MatSidenavModule, MatRadioModule, MatProgressSpinnerModule, MatProgressBarModule, MatPaginatorModule, MatMenuModule, MatListModule, MatInputModule, MatGridListModule, MatExpansionModule, MatDialogModule, MatDatepickerModule, MatChipsModule, MatCheckboxModule, MatCardModule, MatButtonToggleModule, MatButtonModule, MatAutocompleteModule } from '@angular/material';
import { MessageService } from '../message.service';
import { FormsModule } from '@angular/forms';
import { ElasticService } from '../elastic.service';
import { HttpClient, HttpHeaders, HttpParams, HttpHandler } from '@angular/common/http';
import { TourModule, TourMatMenuModule, TourService } from 'ngx-tour-md-menu';
//import { TourService } from 'ngx-tour-core';
import { RenderingService } from '../rendering.service';
import { RouterTestingModule } from '@angular/router/testing';
import { CookieService } from 'ngx-cookie-service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


describe('ConceptViewComponent', () => {
  let component: ConceptViewComponent;
  let fixture: ComponentFixture<ConceptViewComponent>;

  beforeEach(async(() => {
    //let t:IStepOption;
    TestBed.configureTestingModule({
      imports: [MatIconModule,MatSelectModule,MatOptionModule,MatFormFieldModule,FormsModule,MatAutocompleteModule,MatButtonModule,MatButtonToggleModule,MatCardModule,
        MatCheckboxModule,MatChipsModule,MatDatepickerModule,MatDialogModule,MatExpansionModule,MatFormFieldModule,MatGridListModule,MatIconModule,MatInputModule, 
        MatListModule,MatMenuModule,MatPaginatorModule,MatProgressBarModule,MatProgressSpinnerModule,MatRadioModule,MatSelectModule,MatSidenavModule,
        MatSliderModule,MatSlideToggleModule,MatSnackBarModule,MatSortModule,MatTableModule,MatTabsModule,MatToolbarModule,MatTooltipModule,MatStepperModule,
        TourModule,TourMatMenuModule,RouterTestingModule,TourMatMenuModule.forRoot(),TourModule.forRoot(),BrowserAnimationsModule
      ],
      declarations: [ConceptViewComponent],
      providers: [CookieService,TourService, MessageService,ElasticService, RenderingService,HttpClient, HttpHandler]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    //fixture = TestBed.createComponent(ConceptViewComponent);
    //component = fixture.componentInstance;
    
    //fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
