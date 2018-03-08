import { Injectable, EventEmitter } from '@angular/core';
import { Node, Link, ForceDirectedGraph } from './models';
import * as d3 from 'd3';
import {OGraph, ONode, OLink} from '../types';
@Injectable()
export class D3Service {
  /** This service will provide methods to enable user interaction with elements
    * while maintaining the d3 simulations physics
    */
  constructor() { }

  private static selectedNodes : Set<ONode> = new Set<ONode>();

  public static toggleNode(n : ONode) {
    if(D3Service.selectedNodes.has(n) )
      D3Service.unselectNode(n);
    else
      D3Service.selectNode(n);
  }

  public static selectNode(n : ONode) {
    D3Service.selectedNodes.add(n);
    console.log("added node to set");
    console.log(D3Service.selectedNodes);
    //n.color = "rgb(0,0,0)";
  }

  public static unselectNode(n : ONode) {
    D3Service.selectedNodes.delete(n);
  }

  public static unselectAllNodes()
  {
    D3Service.selectedNodes = new Set<ONode>();
  }

  public static getSelectedNodes() : Set<ONode>
  {
    return D3Service.selectedNodes;
  }
  /** A method to bind a pan and zoom behaviour to an svg element */
  applyZoomableBehaviour(svgElement, containerElement) {
    let svg, container, zoomed, zoom;

    svg = d3.select(svgElement);
    container = d3.select(containerElement);

    zoomed = () => {
      const transform = d3.event.transform;
      container.attr('transform', 'translate(' + transform.x + ',' + transform.y + ') scale(' + transform.k + ')');
    }

    zoom = d3.zoom().on('zoom', zoomed);
    svg.call(zoom).on("dblclick.zoom", null);
  }

  applyLinkDraggableBehaviour(element, link: Link, graph: ForceDirectedGraph) {
    const d3element = d3.select(element);
    
        function started() {
          console.log("link dragged");
          /** Preventing propagation of dragstart to parent elements */
          d3.event.sourceEvent.stopPropagation();
    
          if (!d3.event.active) {
            graph.simulation.alphaTarget(0.3).restart();
          }
         // graph.simulation.stop();
          d3.event.on('drag', dragged).on('end', ended);
          //graph.simulation.stop();
          function dragged() {
            //move all nodes (move the graph) when dragging a link
            let dx = d3.event.x - (link.source.x + link.target.x) / 2;
            let dy = d3.event.y - (link.source.y + link.target.y) / 2;
            for(let n of graph.nodes) {
              n.fx = n.x + dx;
              n.fy = n.y + dy;
            }

          }
    
          function ended() {
            if (!d3.event.active) {
              graph.simulation.alphaTarget(0);
            }
          //graph.simulation.restart();
          

           }
        }
    
        d3element.call(d3.drag()
          .on('start', started));
  }

  /** A method to bind a draggable behaviour to an svg element */
  applyNodeDraggableBehaviour(element, node: Node, graph: ForceDirectedGraph) {
    const d3element = d3.select(element);

    function started() {
      console.log("node dragged");
      /** Preventing propagation of dragstart to parent elements */
      d3.event.sourceEvent.stopPropagation();

      if (!d3.event.active) {
        graph.simulation.alphaTarget(0.3).restart();
      }

      d3.event.on('drag', dragged).on('end', ended);
      //graph.simulation.stop();
      function dragged() {
        
        
        node.fx = d3.event.x;
        node.fy = d3.event.y;
      }

      function ended() {
        if (!d3.event.active) {
          graph.simulation.alphaTarget(0);
        }

        // node.fx = null;
        // node.fy = null;
      //graph.simulation.restart();
      }
    }

    d3element.call(d3.drag()
      .on('start', started));
  }

  /** The interactable graph we will simulate in this article
  * This method does not interact with the document, purely physical calculations with d3
  */
  getForceDirectedGraph(graph: OGraph, options: { width, height }) {
    const sg = new ForceDirectedGraph(graph, options);
    return sg;
  }
}
