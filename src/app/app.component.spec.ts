import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MessageService } from './message.service';
import { MatCardModule, MatIcon, MatIconModule } from '@angular/material';
import { Component } from '@angular/core';
import 'core-js/es7/reflect';
import { TourModule, TourService, TourStepTemplateComponent } from 'ngx-tour-md-menu';
//import { MatCardModule } from './message.service';
//import 'reflect-metadata';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports:[MatCardModule,MatIconModule, TourModule]
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
