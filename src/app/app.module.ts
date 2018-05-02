import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { D3Service, D3_DIRECTIVES } from './d3';
import { TourMatMenuModule } from 'ngx-tour-md-menu';
import { AsyncLocalStorageModule } from 'angular-async-local-storage';
import { CookieService } from 'ngx-cookie-service';

//import { MdToolbarModule, MdSidenavModule, MdButtonModule, MdChipsModule, MdListModule, MdInputModule } from '@angular/material';
import { GraphComponent } from './visuals/graph/graph.component';
import { SHARED_VISUALS } from './visuals/shared';
import {
  MatAutocompleteModule,
  MatButtonModule, 
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule, 
  MatGridListModule,
  MatIconModule,
  MatInputModule, 
  MatListModule,
  MatMenuModule,
  MatPaginatorModule, 
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatStepperModule,
} from '@angular/material';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations'; 

import {MatNativeDateModule, MatRippleModule} from '@angular/material';
import {CdkTableModule} from '@angular/cdk/table';
import {CdkAccordionModule} from '@angular/cdk/accordion';
import {A11yModule} from '@angular/cdk/a11y';
import {BidiModule} from '@angular/cdk/bidi';
import {OverlayModule, OVERLAY_PROVIDERS} from '@angular/cdk/overlay';
import {PlatformModule} from '@angular/cdk/platform';
import {ObserversModule} from '@angular/cdk/observers';
import {PortalModule} from '@angular/cdk/portal';

import { AppComponent } from './app.component';
import { KnowledgeViewComponent } from './knowledge-view/knowledge-view.component';
import { DataViewComponent } from './data-view/data-view.component';
import { NavigationViewComponent } from './navigation-view/navigation-view.component';
import { ConceptViewComponent } from './concept-view/concept-view.component';
import { InputFile } from './inputFile';
import { MessageService } from './message.service';
import { AnalyticsService } from './analytics.service'
import { MessagesComponent } from './messages/messages.component';
import { RenderingService } from './rendering.service';
import { ElasticService } from './elastic.service';
import { RouterModule, Routes } from '@angular/router';
import { TourModule, TourService } from 'ngx-tour-core';

const routes: Routes = [
  //{ path: "", component:  },
  //{ path: "/a", redirectTo: "http://google.com" },
  //{ path: "a-path", component: SomeComponent },
  //{ path: '**', component: PageNotFoundComponent }
  //{ path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [
    AppComponent,
    KnowledgeViewComponent,
    DataViewComponent,
    NavigationViewComponent,
    ConceptViewComponent,
    GraphComponent,
    ...SHARED_VISUALS,
    ...D3_DIRECTIVES,
    MessagesComponent,
    InputFile
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule, 
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatTableModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTabsModule,
    MatToolbarModule, 
    MatTooltipModule,
    MatNativeDateModule,
    CdkTableModule,
    A11yModule,
    BidiModule,
    CdkAccordionModule,
    ObserversModule,
    OverlayModule,
    PlatformModule,
    PortalModule,
    CommonModule,
    TourModule,
    TourService,
    AsyncLocalStorageModule,
    TourMatMenuModule.forRoot(),
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    HttpClientModule,
    
     
  ],
  providers: [D3Service, MessageService, RenderingService, ElasticService, TourService, AnalyticsService, CookieService],
  exports: [ ConceptViewComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
