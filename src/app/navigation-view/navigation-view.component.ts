import { Component, OnInit, Input, NgModule } from '@angular/core';
import { Concept } from '../concept';
import {MessageService} from '../message.service';
import {Data} from '../data';
import { TourService } from 'ngx-tour-md-menu';
import { AnalyticsService } from '../analytics.service';
declare const _paq:any;

@Component({
  selector: 'app-navigation-view',
  templateUrl: './navigation-view.component.html',
  styleUrls: ['./navigation-view.component.css'],
  //providers: [Angulartics2On]
})
export class NavigationViewComponent implements OnInit {
  i: number = 1;
  concept_name: string = "Concept " + this.i;
  concepts: Concept[] = Data.concepts;
  
  constructor(private messageService: MessageService, public tourService: TourService, public analyticsService: AnalyticsService) {
    
  }

  addConcept() {
    let c = new Concept(this.concept_name);
    Data.addConcept(c);
    this.analyticsService.trackevent("NavigationPanel", "PlusButtonClick","Concept Added");
    //_paq.push(['trackEvent', 'Navigation', 'AddConcept', 'Concept Added']);
    this.concept_name = "Concept " + (++this.i);
    this.messageService.log("NavigationViewComponent: addConcept");  
  }

  removeConcept() {
    let c = new Concept(this.concept_name);
    Data.removeConcept(c);
    //_paq.push(['trackEvent', 'Navigation', 'RemoveConcept', 'Concept Removed']);
    this.analyticsService.trackevent("NavigationPanel", "MinusButtonClick","Concept Removed");
    this.messageService.log("NavigationViewComponent: removeConcept");  
  }
  ngOnInit() {}
 
}
