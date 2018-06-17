import { NavigationViewComponent } from './navigation-view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {  MatFormField, MatAccordion, MatInput, MatExpansionPanel, MatSlideToggle, MatExpansionPanelTitle, MatExpansionPanelHeader, MatOption, MatSelect, MatDatepicker, MatSlider, MatDatepickerToggle, MatExpansionPanelDescription, MatDatepickerInput, MatPseudoCheckbox, ErrorStateMatcher, MatIconModule, MatRippleModule } from '@angular/material';
import { ConceptViewComponent } from '../concept-view/concept-view.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient, HttpHeaders, HttpParams, HttpHandler } from '@angular/common/http';
import { MatSnackBar, MatListItem } from '@angular/material';
import { MatList} from '@angular/material/list'; 
import { Overlay, ScrollDispatcher, ViewportRuler, OverlayContainer, OverlayPositionBuilder, OverlayKeyboardDispatcher, CdkOverlayOrigin, ScrollStrategyOptions, ScrollStrategy, OverlayModule } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { LiveAnnouncer, } from '@angular/cdk/a11y'; 
import { BreakpointObserver, MediaMatcher} from '@angular/cdk/layout'; 
import { RenderingService } from '../rendering.service';
import { MessageService } from '../message.service';
import { TourService, TourModule, TourMatMenuModule } from 'ngx-tour-md-menu';
import { CdkPortalOutlet, PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { AnalyticsService } from '../analytics.service';
import { CookieService } from 'ngx-cookie-service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';

describe('NavigationViewComponent', () => {
  let component: NavigationViewComponent;
  let fixture: ComponentFixture<NavigationViewComponent>;
//CdkPortalOutlet,CdkOverlayOrigin
//MatIcon,TourAnchorMatMenuDirective
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule,CommonModule,OverlayModule,PortalModule,RouterTestingModule,TourModule,TourMatMenuModule.forRoot(),MatIconModule,MatRippleModule,BrowserAnimationsModule],
      declarations: [MatDatepicker,MatDatepickerToggle,MatDatepickerInput ,NavigationViewComponent,MatFormField,MatAccordion,ConceptViewComponent,MatInput,MatExpansionPanel, MatSlideToggle,MatListItem,MatList,MatExpansionPanelTitle,MatExpansionPanelHeader,MatOption,MatSelect, MatExpansionPanelDescription, MatSlider,MatPseudoCheckbox],
      providers: [CookieService,AnalyticsService,MessageService,TourService,ErrorStateMatcher, RenderingService, MediaMatcher, BreakpointObserver, LiveAnnouncer,  HttpClient, HttpHandler, MatSnackBar,Overlay, ScrollDispatcher, Platform, ViewportRuler, OverlayContainer, OverlayPositionBuilder, OverlayKeyboardDispatcher]
      //schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationViewComponent);
    component = fixture.componentInstance;
    //component.concept_name="test";
    //component.addConcept();
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
