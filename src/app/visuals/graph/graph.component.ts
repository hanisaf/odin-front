import { Component, Input, ChangeDetectorRef, HostListener, ChangeDetectionStrategy, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { D3Service, ForceDirectedGraph, Node } from '../../d3';
import {Graph} from '../../graph';
import * as d3 from 'd3';
import { geoStream } from 'd3';
@Component({
  selector: 'graph',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg id="svg" #svg [attr.width]="options.width" [attr.height]="options.height"  >
      <g [zoomableOf]="svg">
        <g [linkVisual]="link" *ngFor="let link of graph.links"
        [draggable]="link" [draggableInGraph]="d3graph"
        [sourceGraph]="graph"></g>
        <g [nodeVisual]="node" *ngFor="let node of graph.nodes"
            [draggable]="node" [draggableInGraph]="d3graph"
            [sourceGraph]="graph"></g> 
      </g>
    </svg>
  `,
  styleUrls: ['./graph.component.css']
})


export class GraphComponent implements OnInit, AfterViewInit {
  _graph : Graph;
  private d3Svg: d3.Selection<SVGSVGElement, any, null, undefined>;
  private d3G: d3.Selection<SVGGElement, any, null, undefined>;
  private parentNativeElement: any;
  @Input() 
  set graph(graph : Graph) {
    this._graph = graph;
    this.refresh();
  }

  get graph() : Graph {
    return this._graph;
  }

  d3graph: ForceDirectedGraph;
  //_options: { width, height } = { width: 800, height: 600 };

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.d3graph.initSimulation(this.options);
  }


  constructor(element: ElementRef,private d3Service: D3Service, private ref: ChangeDetectorRef) {
    this.parentNativeElement = element.nativeElement;
  }

  ngOnInit() {
    let d3ParentElement: d3.Selection<HTMLElement, any, null, undefined>;
    let d3G: d3.Selection<SVGGElement, any, null, undefined>;


    
    function zoomed(this: SVGSVGElement) {
      let e: d3.D3ZoomEvent<SVGSVGElement, any> = d3.event;
      d3G.attr('transform', e.transform.toString());
    }

    // function dragged(this: SVGCircleElement, d: PhyllotaxisPoint) {
    //   let e: d3.D3DragEvent<SVGCircleElement, PhyllotaxisPoint, PhyllotaxisPoint> = d3.event;
    //   d3.select(this).attr('cx', d.x = e.x).attr('cy', d.y = e.y);
    // }

     if (this.parentNativeElement !== null) {
       d3ParentElement = d3.select(this.parentNativeElement);
       this.d3Svg = d3ParentElement.select<SVGSVGElement>('svg');
       
       d3G = this.d3G = this.d3Svg.append<SVGGElement>('g');

      // this.d3G.selectAll<SVGCircleElement, any>('circle')
      //   .data(this.graph.nodes)
      //   .enter().append<SVGCircleElement>('circle')
      //   .attr('cx', function (d) { return d.x; })
      //   .attr('cy', function (d) { return d.y; })
      //   .attr('r', 20);

      // this.d3Svg.call(d3.zoom<SVGSVGElement, any>()
      //   .scaleExtent([1 / 2, 8])
      //   .on('zoom', zoomed));
     }
  }

  refresh() {
    /** Receiving an initialized simulated graph from our custom d3 service */
    this.d3graph = this.d3Service.getForceDirectedGraph(this.graph, this.options);
    
        /** Binding change detection check on each tick
         * This along with an onPush change detection strategy should enforce checking only when relevant!
         * This improves scripting computation duration in a couple of tests I've made, consistently.
         * Also, it makes sense to avoid unnecessary checks when we are dealing only with simulations data binding.
         */ 
        this.d3graph.ticker.subscribe((d) => {
          this.ref.markForCheck();
        });
        this.d3graph.initSimulation(this.options);
    //this.centerView();
        
  }
  ngAfterViewInit() {
    this.d3graph.initSimulation(this.options);
  }

  centerView()
  {
    //let zoomer = d3.zoom().
    //  scaleExtent([0.1,10]).
      //on("zoomstart", zoomstart).
    //  on("zoom", this.showAlert);
    
      // Center the view on the molecule(s) and scale it so that everything
      // fits in the window
      if (this._graph.nodes === null)
          return;

      let nodes = this._graph.nodes;

      //no molecules, nothing to do
      if (nodes.length === 0)
          return;

      // Get the bounding box
      let min_x = d3.min(nodes.map(function(d) {return d.x;}));
      let min_y = d3.min(nodes.map(function(d) {return d.y;}));
      let max_x = d3.max(nodes.map(function(d) {return d.x;}));
      let max_y = d3.max(nodes.map(function(d) {return d.y;}));


      // The width and the height of the graph
      let mol_width = max_x - min_x;
      let mol_height = max_y - min_y;

      // how much larger the drawing area is than the width and the height
      let width_ratio = this.options.width / mol_width;
      let height_ratio = this.options.height / mol_height;

      // we need to fit it in both directions, so we scale according to
      // the direction in which we need to shrink the most
      let min_ratio = Math.min(width_ratio, height_ratio) * 0.8;

      // the new dimensions of the molecule
      let new_mol_width = mol_width * min_ratio;
      let new_mol_height = mol_height * min_ratio;

      // translate so that it's in the center of the window
      let x_trans = -(min_x) * min_ratio + (this.options.width - new_mol_width) / 2;
      let y_trans = -(min_y) * min_ratio + (this.options.height - new_mol_height) / 2;

      
      // do the actual moving
      this.d3Svg.attr("transform", "translate(" + [x_trans, y_trans] + ")" + " scale(" + min_ratio + ")");

               // tell the zoomer what we did so that next we zoom, it uses the
               // transformation we entered here
               //zoomer.translate([x_trans, y_trans ]);
               //zoomer.scale(min_ratio);

  
  }

  get options() {
    return  {
      width: window.innerWidth * 0.8,
      height: window.innerHeight *0.8
    };
  }
}
