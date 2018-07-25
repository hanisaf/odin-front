import { Component, OnInit, Input } from '@angular/core';
import { Concept } from '../concept';
import { MatIconRegistry } from '@angular/material';
import { MessageService } from '../message.service';
import { Observable } from 'rxjs/Observable';
import { Subject }    from 'rxjs/Subject';
import { Graph } from '../graph';
import { Data } from '../data';
import { ElasticService } from '../elastic.service';
import {OGraph } from '../types';
import { RenderingService } from '../rendering.service';
//import { TourService } from 'ngx-tour-core';
import { TourService } from 'ngx-tour-md-menu';

@Component({
  selector: 'app-concept-view',
  templateUrl: './concept-view.component.html',
  styleUrls: ['./concept-view.component.css']
})
export class ConceptViewComponent implements OnInit {
  @Input() concept: Concept;
  graphs : OGraph[] = [new Graph()]; //for undo redo
  pointer : number = 0; //for undo redo

  graphSource: Subject<OGraph>;
  graph : Observable<OGraph>;
  //tourAnchor:String;
  replace: boolean = true;
  //firstConcept = true;
  conceptsLength = 1;
    
  hideSources = Data.CONFIG.hideSources;
  hideTypes = Data.CONFIG.hideTypes;
  hideOptions = Data.CONFIG.hideOptions;
  constructor(private messageService: MessageService,
    private renderingService: RenderingService, private elasticService: ElasticService, private tourService:TourService) {
      //this.tourAnchor = "oncept-view.component.explore";
      //this.concept.graph = new Graph();
      this.graphSource = new Subject<OGraph>();
      this.graph = this.graphSource.asObservable();
      this.graph.subscribe(g => { 
        //when undo/redo
        if(this.replace) {
          this.concept.graph = g;
          this.replace = false;
        } else { //when receiving incremental updates
          this.concept.graph.merge(g);
        }
        Data.renderGraph();
      });
      
  }

  onSave() {
        let graph = this.concept.graph.duplicate();
        this.graphs.push(graph);
        this.pointer = this.graphs.length - 1;
        this.graphSource.next(graph);
        this.messageService.info("Checkpoint saved!");
  }
  
  getFields(index: string) {
    let query  = {kind: "fields" as "fields", index: index};
    this.elasticService.EL(query)
    .subscribe(
      response => {
        this.concept.fields = this.elasticService.OD(query, response);
        //ensure prior selected fields are valid
        let newSelectedFields = [];
        let sourceFields = new Set(this.concept.fields);
        for(let f of this.concept.selectedFields) {
          if(sourceFields.has(f)) {
            newSelectedFields.push(f);
          }
        }
        this.concept.selectedFields=newSelectedFields;
      }
      );
   }

   getTypes(index: string) {
    let query  = {kind: "types" as "types", index: index};
    this.elasticService.EL(query)
    .subscribe(
      response => {
        this.concept.types = this.elasticService.OD(query, response);
      }
      );
   }

  getIndices() {
    let query  = {kind: "indices" as "indices"};
    this.elasticService.EL(query)
    .subscribe(
      response => {
          this.concept.sources = this.elasticService.OD(query, response);
          this.changeIndex();
      }
      );
  }

  changeIndex() {
    this.getFields(this.concept.source);
    this.getTypes(this.concept.source);

    this.messageService.log("changed index to " + "this.index_value, ConceptViewComponent.changeIndex()");
  }

  validIndex(i: number, a: any[]) {
    if(a.length > 0)
      return i >= 0 && i < a.length;
    else
      return false;
  }

  onUndo() {
    if(this.validIndex(this.pointer-1, this.graphs)) {
      this.pointer = this.pointer - 1;
      //this.concept.graph = this.graphs[this.pointer];
      //Data.renderGraph();
      this.replace = true;
      this.graphSource.next(this.graphs[this.pointer]);
      this.messageService.info("Undo!");
    }
  }

  onRedo() {
    if(this.validIndex(this.pointer+1, this.graphs)) {
      this.replace = true;
      this.pointer = this.pointer + 1;
      //this.concept.graph = this.graphs[this.pointer];
      //Data.renderGraph();
      
      this.graphSource.next(this.graphs[this.pointer]);
      this.messageService.info("Redo!");
    }
  }

  onDelete() {
    let change = this.concept.graph.removeSelected();
    this.graphSource.next(this.concept.graph);
    if(!change)
              this.messageService.info("You have to select nodes and/or edges to delete!");
      
  }

  onExplore() {
    this.replace = false;

    let query = {
      // kind: "explore" as "explore",
      kind: "search" as "search",
      index: this.concept.source,
      text: this.concept.query,
      from_date: this.concept.from_date,
      to_date: this.concept.to_date,
      contains: [],
      breadth: this.concept.breadth,
      certainty: this.concept.certainty,
      fields: this.concept.selectedFields,
      types: this.concept.selectedTypes,
      depth: this.concept.depth,
      //match: this.concept.match_type
      //phrase: this.concept.phrase
    };
    this.elasticService.ODIN_RECURSIVE(query, this.graphSource);
  }

  onExpand() {
    this.replace = false;
    let selection = [];
    //for(let n of this.concept.graph.nodes) {
      for(let n of Data.workspaceGraph.nodes) { //allow
      if(n.selected)
        selection.push(n);
    }
    if(selection.length==0) {
      this.messageService.info("You have to select at least one node to expand!");
      return;
    }

    for(let n of selection) {
      let query = {
        kind: "search" as "search",
        index: this.concept.source,
        from_date: this.concept.from_date,
        to_date: this.concept.to_date,
        contains: [n],
        breadth: this.concept.breadth,
        certainty: this.concept.certainty,
        depth: this.concept.depth,
        fields: this.concept.selectedFields,
        types: this.concept.selectedTypes,
        exclude: [n],
        //graph: this.concept.graph,
        //selection: selection
      };
      //query.contains = [n];
      this.elasticService.ODIN_RECURSIVE(query, this.graphSource);
      
    }
  }

  onLink() {
    this.replace = false;

    //this.concept.graph.links.splice(0, this.concept.graph.links.length);
    
    for(let n of this.concept.graph.nodes) {
      let includes = [];
      let excludes = [n];
      let contains = [n];
      //for(let include of Data.workspaceGraph.nodes) {
      for(let include of this.concept.graph.nodes) {
        if(!n.equals(include))
          includes.push(include);
      }
      let query = {
        kind: "search" as "search",
        index: this.concept.source,
        from_date: this.concept.from_date,
        to_date: this.concept.to_date,
        contains: contains,
        breadth: this.concept.graph.nodes.length,
        certainty: this.concept.certainty,
        depth: 0,
        fields: this.concept.selectedFields,
        types: this.concept.selectedTypes,
        include: includes,
        exclude: excludes
        //graph: this.concept.graph,
        //selection: selection
      };
      //query.contains = [n];
      this.elasticService.ODIN_RECURSIVE(query, this.graphSource);
    }

  }
  onClear() {
    this.replace = true;
    this.graphSource.next(new Graph());
    this.messageService.info(this.concept.name + " concept cleared!");
  }
  

  update() {
    this.renderingService.update();
  }
  ngOnInit() {
    this.getIndices();
    this.changeIndex();
       //todo: checking first id by the concept name, isn't it better to add a index property to the Concept class?
       //this.firstConcept = (Data.concepts.length > 0 && this.concept===Data.concepts[0]);
       this.conceptsLength = Data.concepts.length;
      //  if (Number(this.concept.name.replace("Concept ","")) > 1)
      //  { 
      //   this.firstConcept = false;
        
      //  }

  }

}
