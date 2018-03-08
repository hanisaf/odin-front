import { Component, OnInit, Input } from '@angular/core';
import { Node, Link } from '../d3';
import { RenderingService } from '../rendering.service';
import { Data } from '../data';
import {Graph} from '../graph';
import {OGraph} from '../types';
@Component({
  selector: 'app-knowledge-view',
  templateUrl: './knowledge-view.component.html',
  styleUrls: ['./knowledge-view.component.css']
})
export class KnowledgeViewComponent implements OnInit {
  //colors:string[] = ["red", "maroon", "yellow", "olive", "lime", "green", "aqua", "teal", "blue", "navy", "fuchsia", "purple"] ;
  colors = Data.cPalette;// ["navy","blue","aqua","teal","olive","green","lime","yellow","orange","red","fuchsia","purple","maroon"]
  constructor(private renderingService: RenderingService) {
    this.renderingService.graph.subscribe(g => { Data.workspaceGraph = g;});
    
  }

  get palette() {
    return Data.palette;
  }

  get length() {
    if(Data.palette)
      return Data.palette.length;
    else  return 0;
  }
  ngOnInit() {
    this.renderingService.resetGraph();
    
  }

  // set graph(graph : Graph) {
  //   Data.workspaceGraph = graph;
  // }

  get graph() : OGraph {
    return Data.workspaceGraph;
  }


} 
