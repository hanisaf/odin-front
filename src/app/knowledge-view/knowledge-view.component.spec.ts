import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient, HttpHeaders, HttpParams, HttpHandler } from '@angular/common/http';
import { KnowledgeViewComponent } from './knowledge-view.component';
import { MatSnackBar, MatListItem, MatRipple } from '@angular/material';
import { MatList} from '@angular/material/list'; 
import { Overlay, ScrollDispatcher, ScrollStrategyOptions, ViewportRuler, OverlayContainer, OverlayPositionBuilder, OverlayKeyboardDispatcher } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { LiveAnnouncer, } from '@angular/cdk/a11y'; 
import { BreakpointObserver, Breakpoints, MediaMatcher} from '@angular/cdk/layout'; 
import { RenderingService } from '../rendering.service';
import { Graph } from '../graph';
import { GraphComponent } from '../visuals/graph/graph.component';
import { ZoomableDirective, DraggableDirective, D3Service } from '../d3';
import { LinkVisualComponent, NodeVisualComponent } from '../visuals/shared';
import { MessageService } from '../message.service';

describe('KnowledgeViewComponent', () => {
  let component: KnowledgeViewComponent;
  let fixture: ComponentFixture<KnowledgeViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [KnowledgeViewComponent,GraphComponent,MatList,MatListItem,ZoomableDirective,LinkVisualComponent,DraggableDirective,NodeVisualComponent,MatRipple],
      providers: [D3Service,MessageService,RenderingService,MatListItem, MediaMatcher, BreakpointObserver, LiveAnnouncer,  HttpClient, HttpHandler, MatSnackBar,Overlay, ScrollStrategyOptions, ScrollDispatcher, Platform, ViewportRuler, OverlayContainer, OverlayPositionBuilder, OverlayKeyboardDispatcher,LiveAnnouncer]
    })
    .compileComponents();
  }));
  
  beforeEach(() => {
    fixture = TestBed.createComponent(KnowledgeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  
  it('should create the KnowledgeViewComponent', async(() => {
    const fixture = TestBed.createComponent(KnowledgeViewComponent);
    const component = fixture.debugElement.componentInstance;
    expect(component).toBeTruthy();
  }));
});
