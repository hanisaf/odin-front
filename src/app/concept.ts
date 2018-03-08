import {Graph} from './graph';
//import CONFIG from './app.config';
import {Data} from './data';

import {OGraph} from './types';
export class Concept {
    
    constructor(name: string) {
      this.name = name;
      this.source = Data.CONFIG.default_index;
      this.query = Data.CONFIG.default_query;
      this.certainty = Data.CONFIG.default_certainty;
      this.min_certainty = Data.CONFIG.min_breadth;
      this.max_certainty = Data.CONFIG.max_certainty;
      this.min_breadth = Data.CONFIG.min_breadth;
      this.max_breadth = Data.CONFIG.max_breadth;
      this.breadth = Data.CONFIG.default_breadth;
      this.min_depth = Data.CONFIG.min_depth;
      this.max_depth = Data.CONFIG.max_depth;
      this.depth = Data.CONFIG.default_depth;
      this.selectedFields = Data.CONFIG.default_fields;
      this.sources = Data.CONFIG.elastic_indices;
      this.graph = new Graph();
      this.active=true;
      // this.match_type = Data.CONFIG.default_match as "document" | "sentence" | "exact";
      this.expanded = true;
      this.selectedTypes = Data.CONFIG.default_types;
    }
    
    id: number;
    name: string;
    expanded: boolean;
    from_date: string;
    to_date: string;
    min_breadth : number;
    max_breadth : number;
    breadth : number;
    min_certainty : number;
    max_certainty : number;
    certainty: number;
    min_depth: number;
    max_depth: number;
    depth: number;
    query: string;
    source: string ;
    selectedFields;
    fields ;
    selectedTypes;
    types;
    sources ;
    active: boolean;
    phrase:boolean;
    graph : OGraph;
    // match_type: "document" | "sentence" | "exact";

  }