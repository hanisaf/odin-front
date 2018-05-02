import { TestBed, inject } from '@angular/core/testing';

import { AnalyticsService } from './analytics.service';
import { MessageService } from './message.service';
import 'core-js/es7/reflect';
import { CookieService } from 'ngx-cookie-service';
import { MatSnackBar } from '@angular/material';
//import { Overlay, ScrollStrategyOptions, ScrollDispatcher, ViewportRuler, OverlayContainer, OverlayPositionBuilder, OverlayKeyboardDispatcher } from '@angular/cdk/overlay';
import { OVERLAY_PROVIDERS, ScrollStrategyOptions, ScrollDispatcher} from "@angular/cdk/overlay";
import { MatDialogModule, MatDialog, MatDialogRef} from '@angular/material/dialog';

import { Platform } from '@angular/cdk/platform';
import { AppComponent } from './app.component';
let odmServiceSub = {};

describe('AnalyticsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      //providers: [AnalyticsService, MessageService, CookieService],// ,MatSnackBar, Overlay,OverlayContainer,OverlayPositionBuilder, ScrollStrategyOptions, ScrollDispatcher, Platform, ViewportRuler, OverlayKeyboardDispatcher],
      providers: [
        {provide: AnalyticsService, useValue: odmServiceSub}, 
        AnalyticsService, MessageService, CookieService,
        MatSnackBar, 
        //OVERLAY_PROVIDERS, 
        ScrollStrategyOptions,
        ScrollDispatcher,
        //PlatformRef // <- added here
    ],
    
      imports:[]
    });
  });
  

  it('should be created', inject([AnalyticsService], (service: AnalyticsService) => {
    expect(service).toBeTruthy();
  }));

});
