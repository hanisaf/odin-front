import { EventEmitter } from '@angular/core';
import { Link } from './link';
import { Node } from './node';
import * as d3 from 'd3';
import {OLink, ONode, OGraph} from '../../types';
const FORCES = {
  LINKS: 0.1,
  COLLISION: 1,
  CHARGE: -10,
  RADIUS: 100
}

export class ForceDirectedGraph {
  public ticker: EventEmitter<d3.Simulation<ONode, OLink>> = new EventEmitter();
  public simulation: d3.Simulation<any, any>;

  public graph: OGraph;
  public nodes: ONode[] = [];
  public links: OLink[] = [];

  constructor(graph: OGraph, options: { width, height }) {
    this.graph = graph;
    this.nodes = graph.nodes;
    this.links = graph.links;
  }

  initNodes() {
    if (!this.simulation) {
      throw new Error('simulation was not initialized yet');
    }

    this.simulation.nodes(this.nodes);
  }
  
  initLinks() {
    if (!this.simulation) {
      throw new Error('simulation was not initialized yet');
    }
    
    this.simulation.force('links',
      d3.forceLink(this.links)
        .id(d => d['id'])
        .strength(FORCES.LINKS)
    );
  }
  /** A custom force to arrange the nodes and links */
  odinForce<NodeDatum extends d3.SimulationNodeDatum>(): d3.ForceCenter<NodeDatum>
  {
    let alpha = 1;
    for (var i = 0, n = this.nodes.length, node, k = alpha * 0.1; i < n; ++i) {
      node = this.nodes[i];
      node.vx -= node.x * k * 5;
      node.vy -= node.y * k;
    }
    return null;
  }

  initSimulation(options) {
    if (!options || !options.width || !options.height) {
      throw new Error('missing options when initializing simulation');
    }
    
    /** Creating the simulation */
    if (!this.simulation) 
    {
      const ticker = this.ticker;
      this.simulation = d3.forceSimulation()
        .force('charge',
          d3.forceManyBody()
            .strength(d => FORCES.CHARGE)
        )
        //.force('center', d3.forceCenter())
        //.force('links', d3.forceLink())
        .force('radial', d3.forceRadial(-options.width / 2))
        //.force('center', d3.forceCenter())
        //.force('links', d3.forceLink())
        //.force('odin',this.odinForce())
        //.force('radial', d3.forceRadial(500))
        .force('collide',
          d3.forceCollide()
            .strength(FORCES.COLLISION)
            .radius(d => d['r'] + FORCES.RADIUS)//.iterations(2)
        )
        ;
      
        // Connecting the d3 ticker to an angular event emitter
      this.simulation.on('tick', function () {
        ticker.emit(this);
      });

      this.initNodes();
      this.initLinks();
    }
   
    /** Updating the central force of the simulation */
    this.simulation.force('centers', d3.forceCenter(options.width / 2, options.height / 2));

    /** Restarting the simulation internal timer */
    this.simulation.restart();
  }
}
