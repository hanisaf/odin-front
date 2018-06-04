import { TestBed, inject } from '@angular/core/testing';

import { RenderingService } from './rendering.service';
import { MessageService } from './message.service';
import { MatSnackBar } from '@angular/material';
import { Overlay, ScrollDispatcher, ScrollStrategyOptions, ViewportRuler, OverlayContainer, OverlayPositionBuilder, OverlayKeyboardDispatcher } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import {LiveAnnouncer, } from '@angular/cdk/a11y'; 
import {BreakpointObserver, Breakpoints, MediaMatcher} from '@angular/cdk/layout'; 
import { HttpClient, HttpHeaders, HttpParams, HttpHandler } from '@angular/common/http';


describe('RenderingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RenderingService,MessageService,MatSnackBar,Overlay,ScrollStrategyOptions, ScrollDispatcher, Platform, ViewportRuler, OverlayContainer, 
       OverlayPositionBuilder, OverlayKeyboardDispatcher,LiveAnnouncer,BreakpointObserver,MediaMatcher,
       HttpClient,HttpHandler
      ]
    });
  });

  it('should be created', inject([RenderingService], (service: RenderingService) => {
    expect(service).toBeTruthy();
  }));
});
