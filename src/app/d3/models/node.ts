import {Data} from '../../data';
import {ONode} from '../../types';

export class Node implements ONode {
  // optional - defining optional implementation properties - required for relevant typing assistance
  index?: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;

  label : string;
  type : string;
  sources : string[];
  important : boolean;
  selected : boolean;
  size : number;

  constructor(label: string, type: string, sources: string | string[], size, selected=false, important=false) {
    this.label=label;
    this.type = type;
    
    if (typeof sources ==="string")
      this.sources = [sources];
    else 
      this.sources = sources;

    this.size=size;
    this.selected=selected;
    this.important=important;
  }

  get r() {
     //return this.size;
     //return Math.max(10, Math.min( 45, 3*Math.round(Math.log(1+this.size)) ));
     //return Math.round(Math.log(1+this.size)) ;
     //return Math.max(10, Math.min( 50,  this.size) );
     return Math.max(5, Math.min(50, 10*(1+Math.log(this.size))));
     
  }

  get fontSize() {
    return (1 * this.r + 10) + 'px';
  }
  

  get color() : string {
    let code = Math.abs(Data.hashCode(this.type));
    let index = code % Data.cPalette.length;
    let colour = Data.cPalette[index];
    Data.legend(this.type, colour);
    return colour;
  }

  equals(n: ONode) {
    return n.type == this.type && n.label == this.label;
  }
 

}
