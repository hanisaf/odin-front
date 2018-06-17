import { Node, Link } from './d3';
import {ONode, OLink, OGraph} from './types'; 
export class Graph implements OGraph {


  nodes: ONode[] = [];//TODO change set here
  links: OLink[] = [];
  //sources: string[] = [];
  minWeight=0;
  maxWeight=0;
  minSize=0;
  maxSize=0;
  static readJson(json: any) : OGraph {
    let graph = new Graph();
    for(let l of json.links) {
      let s = l.source;
      let n1 = new Node(s.label, s.type, s.sources, s.size, s.selected, s.important);
      let t = l.target;
      let n2 = new Node(t.label, t.type, t.sources, t.size, t.selected, t.important);
      let link = new Link(n1, n2, l.weight, l.sources, l.selected, l.important);
      graph.addLink(link);
    }
    //there may be still disconnected nodes
    for(let n of json.nodes) {
      let node = new Node(n.label, n.type, n.sources, n.size, n.selected, n.important);
      graph.addNode(node);
    }


    return graph;
  }
  reset() {
    this.nodes.splice(0, this.nodes.length);
    this.links.splice(0, this.links.length);
  }

  duplicate(): Graph {
    let g = new Graph();

    for(let n of this.nodes) {
      g.addNode(n);
    }
    for(let l of this.links) {
      g.addLink(l);
    }

    // for(let s of this.sources) 
    //   g.sources.push(s);

    //g.sources=this.sources;

    return g;

  }

  getSelectedFields(): string[] {
    //TODO fix it
    let fields = new Set<string>();
    for(let link of this.links) {
      if(link.source.selected)
        fields.add(link.source.type);
      if(link.target.selected)
        fields.add(link.target.type);
    }
    for(let node of this.nodes) {
      if(node.selected)
        fields.add(node.type);
    }

  return Array.from(fields.values());
  }

  removeSelected() : boolean {
    for(let link of this.links) 
      if(link.source.selected || link.target.selected)
        link.selected=true;
    
    let nc = this.removeS(this.nodes);
    let ec = this.removeS(this.links);

    return nc || ec;
  }

  private removeS(array: Array<ONode | OLink>) : boolean {
    let change = false;
    let i = 0;
    while(i< array.length) {
      let item = array[i];
      if(item.selected) {
        array.splice(i, 1);
        change = true;
        i = 0;
      } else {
        i = i + 1;
      }
    }
    return change;
  }

  addNode(n: ONode) {
    for (let cn of this.nodes) {
      if (cn.equals(n)) {
        //let important = false;//important if exists in different indices
        for(let s of n.sources) { 
          if(!cn.sources.includes(s)) { //update data sources
            //important = true;
            cn.sources.push(s);
          }
        }
        cn.important = true;
        return;
      }
    }
    //n.important = false;
    this.nodes.push(n);

  }

  _findNode(n: ONode) {
    for(let cn of this.nodes) {
      if(cn.equals(n))
        return cn;
    }
    return n;
  } 
  // _addLink(source: ONode, target: ONode, weight: number, selected: boolean) {
  //   //need to double check whether the two nodes are already in the graph,
  //   //if so we need to merge to avoid duplication
  //   let s = this._findNode(source);
  //   let t = this._findNode(target);
  //   let l = new Link(s, t, weight, selected);
  //   this.links.push(l);
  // }
  addLink(l: OLink) {
    for (let cl of this.links) {
      if (l.equals(cl)) {
        //TODO may be highlight and merge weight etc ...
        cl.important = true;
        return;
      }
    }
    //
    //need to avoid duplicate nodes
    let s = this._findNode(l.source);
    let t = this._findNode(l.target);
    l.source = s;
    l.target = t;
    //l.important = false;
    //let l2 = new Link(l.source, l.target, l.weight);
    this.links.push(l);
    //this._addLink(l.source as ONode, l.target as ONode, l.weight, l.selected);
    
  }

  merge(g: OGraph) {
    let nodes = g.nodes;
    let edges = g.links;
    //TODO optimize this for performance
    for (let n of nodes) {
      this.addNode(n);
    }
    for (let l of edges) {
      this.addLink(l);
    }
  }
}