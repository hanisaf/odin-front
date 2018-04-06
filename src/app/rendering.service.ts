
import { Injectable } from '@angular/core';
import {Node, Link} from './d3';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
// import CONFIG from './app.config';
// import {CONFIG} from './config.service';

import {Concept} from './concept';
import {Data} from './data';
import {Graph} from './graph';
import {OGraph} from './types';
@Injectable()
export class RenderingService {

  graphSource: Subject<OGraph>; // = new Subject<Graph>();
  graph: Observable<OGraph>; // = this.graphSource.asObservable();

  constructor(private messageService: MessageService, private http: HttpClient) {
    this.graphSource = new Subject<Graph>();
    this.graph = this.graphSource.asObservable();
    Data.subscribeRenderingService(this);
    // Data.addSubscriber(this);
  }

  resetGraph() {
    const graph = new Graph();
    this.graphSource.next(graph);
  }
  // TODO improve performance and visuals
  // highlight intersection ...
  merge(): OGraph {
    // to highlight intersection turn off important attributes
    for (const c  of Data.concepts ) {
      const g: OGraph = c.graph;
      if (g && c.active) {
        for (const n of g.nodes)
          n.important = false;
        for (const l of g.links)
          l.important = false;
      }
    }
    const graph: OGraph = new Graph();
    for (const c  of Data.concepts ) {
      const g: OGraph = c.graph;
      if (g && c.active)
        graph.merge(g);
    }
    //determine max and min weights of links
    for(const l of graph.links) {
      if(l.weight > graph.maxWeight) {
        graph.maxWeight = l.weight;
      }
      if(l.weight < graph.minWeight) {
        graph.minWeight =l.weight;
      }
    }
    //determine max and min size of nodes
    for(const n of graph.nodes) {
      if(n.size > graph.maxSize) {
        graph.maxSize = n.size;
      }
      if(n.size < graph.minSize) {
        graph.minSize = n.size;
      }
    }
    return graph;
  }

  update() {
    this.messageService.log('Rendering started ...', 'RenderingService.update');
    // 1 merge concepts to create the overall graph
    const graph = this.merge();
    // 2 push the new graph to the visual component
    this.graphSource.next(graph);
    this.messageService.log('Rendering complete.', 'RenderingService.update');
  }

}
