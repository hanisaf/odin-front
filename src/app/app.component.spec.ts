import 'core-js/es7/reflect';
import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MessageService } from './message.service';
import { Component } from '@angular/core';
import { MatSelect, MatOption, MatFormField, MatIcon, MatIconModule, MatChip, MatTable, MatSelectModule, MatOptionModule, MatFormFieldModule, MatHeaderCell, MatHeaderRow, MatRow, MatCell, MatStepperModule, MatTooltipModule, MatToolbarModule, MatTabsModule, MatTableModule, MatSortModule, MatSnackBarModule, MatSlideToggleModule, MatSliderModule, MatSidenavModule, MatRadioModule, MatProgressSpinnerModule, MatProgressBarModule, MatPaginatorModule, MatMenuModule, MatListModule, MatInputModule, MatGridListModule, MatExpansionModule, MatDialogModule, MatDatepickerModule, MatChipsModule, MatCheckboxModule, MatCardModule, MatButtonToggleModule, MatButtonModule, MatAutocompleteModule, MatRipple } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { TourAnchorMatMenuDirective, TourModule, TourMatMenuModule, TourService } from 'ngx-tour-md-menu';
import { RouterTestingModule } from '@angular/router/testing';
import { CookieService } from 'ngx-cookie-service';
import { ElasticService } from './elastic.service';
import { RenderingService } from './rendering.service';
import { HttpClient, HttpHeaders, HttpParams, HttpHandler } from '@angular/common/http';
import { AnalyticsService } from './analytics.service';
import { InputFile } from './inputFile';
import { NavigationViewComponent } from './navigation-view/navigation-view.component';
import { DataViewComponent } from './data-view/data-view.component';
import { KnowledgeViewComponent } from './knowledge-view/knowledge-view.component';
import { ConceptViewComponent } from './concept-view/concept-view.component';
import { GraphComponent } from './visuals/graph/graph.component';
import { ZoomableDirective, DraggableDirective, D3Service } from './d3';
import { LinkVisualComponent, NodeVisualComponent } from './visuals/shared';
//import { TourStepTemplateService } from 'ngx-tour-md-menu/tour-step-template.service';
//import { AsyncLocalStorage } from 'angular-async-local-storage';
//import { MatCardModule } from './message.service';
//import 'reflect-metadata';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,InputFile,NavigationViewComponent,DataViewComponent,KnowledgeViewComponent,GraphComponent,ZoomableDirective,LinkVisualComponent,DraggableDirective,NodeVisualComponent,ConceptViewComponent
      ],
      imports: [MatIconModule,MatSelectModule,MatOptionModule,MatFormFieldModule,FormsModule,MatAutocompleteModule,MatButtonModule,MatButtonToggleModule,MatCardModule,
        MatCheckboxModule,MatChipsModule,MatDatepickerModule,MatDialogModule,MatExpansionModule,MatFormFieldModule,MatGridListModule,MatIconModule,MatInputModule, 
        MatListModule,MatMenuModule,MatPaginatorModule,MatProgressBarModule,MatProgressSpinnerModule,MatRadioModule,MatSelectModule,MatSidenavModule,
        MatSliderModule,MatSlideToggleModule,MatSnackBarModule,MatSortModule,MatTableModule,MatTabsModule,MatToolbarModule,MatTooltipModule,MatStepperModule,
        TourModule,TourMatMenuModule,RouterTestingModule
      ],
      providers: [AnalyticsService, CookieService,TourService, MessageService,ElasticService, RenderingService,HttpClient, HttpHandler ]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it(`should have as title 'Open Data Innovation'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Open Data Innovation');
  }));
  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Open Data Innovation');
  }));
});
