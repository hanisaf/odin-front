
import { Injectable } from '@angular/core';
import {Node, Link} from './d3';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject }    from 'rxjs/Subject';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
//import CONFIG from './app.config';
//import {CONFIG} from './config.service';

import {Concept} from './concept';
import {Data} from './data';
import {Graph} from './graph';
import {OGraph} from './types';
@Injectable()
export class RenderingService {

  graphSource: Subject<OGraph>;//= new Subject<Graph>();
  graph : Observable<OGraph>;//= this.graphSource.asObservable();

  constructor(private messageService: MessageService, private http: HttpClient) { 
    
    this.graphSource = new Subject<Graph>();
    this.graph = this.graphSource.asObservable();
    Data.subscribeRenderingService(this);
    //Data.addSubscriber(this);
  }

  resetGraph() {
    let graph = new Graph();
    this.graphSource.next(graph);
  }
  
  //TODO improve performance and visuals
  //highlight intersection ...
  merge() : OGraph {
    //to highlight intersection turn off important attributes
    for(let c  of Data.concepts ) {
      let g : OGraph = c.graph;
      if(g && c.active) {
        for(let n of g.nodes)
          n.important=false;
        for(let l of g.links)
          l.important=false;
      } 
    }
    let graph : OGraph = new Graph();
    for(let c  of Data.concepts ) {
      let g : OGraph = c.graph;
      if(g && c.active) {
        graph.merge(g);
      } 
    }
    return graph;
  }

  update() {
    this.messageService.log("Rendering started ...", "RenderingService.update");
    //1 merge concepts to create the overall graph
    let graph = this.merge();
    //2 push the new graph to the visual component
    this.graphSource.next(graph);
    
    this.messageService.log("Rendering complete.", "RenderingService.update")
  }

}
