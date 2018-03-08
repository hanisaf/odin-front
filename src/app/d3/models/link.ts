import { Node } from './';
import {ONode, OLink} from '../../types';

export class Link implements OLink {
  // optional - defining optional implementation properties - required for relevant typing assistance
  index?: number;

  // must - defining enforced implementation properties
  source: ONode ;
  target: ONode ;
  weight: number;
  color?: string;
  sources: string[];
  important : boolean;
  selected : boolean;

  constructor(source: ONode, target: ONode, weight, sources: string | string[], selected=false, important=false) {
    this.source = source;
    this.target = target;
    this.weight = weight;
    this.selected=selected;
    this.important=important;
    if (typeof sources ==="string")
     this.sources = [sources];
    else 
     this.sources = sources;
    /*
    this.sources = [];
    for(let s of source.sources)
      if(!this.sources.includes(s))
        this.sources.push(""+s);
    for(let s of target.sources)
      if(!this.sources.includes(s))
        this.sources.push(""+s);
    */
  }

  equals(l: OLink) {
    return l.source.equals(this.source) && l.target.equals(this.target) ||
    l.source.equals(this.target) && l.target.equals(this.source);
  }

  get w():number {
    //return 2*Math.round(Math.log(1+this.weight));
    //return Math.max(1, Math.min(10, 100*this.weight));
    //return 100*this.weight;
    //return Math.log(100*this.weight);
    //return 100*(1+Math.log(this.weight));
    //return Math.max(5, Math.min(50, 100*(1+Math.log(this.weight))));
    return 5 * (1+Math.log10(100*this.weight));
  }
}
