import { TestBed, inject } from '@angular/core/testing';
import { HttpClient, HttpHeaders, HttpParams, HttpHandler } from '@angular/common/http';

import { ElasticService } from './elastic.service';
import { MessageService } from './message.service';
import { MatSnackBar } from '@angular/material';
import { AnalyticsService } from './analytics.service';
import { CookieService } from 'ngx-cookie-service';
import { Overlay, ScrollDispatcher, ScrollStrategyOptions, ViewportRuler, OverlayContainer, OverlayPositionBuilder, OverlayKeyboardDispatcher } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import {LiveAnnouncer, } from '@angular/cdk/a11y'; 
import {BreakpointObserver, Breakpoints, MediaMatcher} from '@angular/cdk/layout'; 
describe('ElasticService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MediaMatcher, BreakpointObserver, LiveAnnouncer, ElasticService, HttpClient, HttpHandler, MessageService, MatSnackBar, AnalyticsService, CookieService, Overlay, ScrollStrategyOptions, ScrollDispatcher, Platform, ViewportRuler, OverlayContainer, OverlayPositionBuilder, OverlayKeyboardDispatcher]
    });
  });

  it('should be created', inject([AnalyticsService], (service: AnalyticsService) => {
    expect(service).toBeTruthy();
  }));
});
