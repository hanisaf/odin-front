import { Directive, Input, ElementRef, OnInit } from '@angular/core';
import { Node, Link, ForceDirectedGraph } from '../models';
import { D3Service } from '../d3.service';

@Directive({
    selector: '[draggable]'
})
export class DraggableDirective implements OnInit {
    @Input('draggable') draggable: Node | Link;
    @Input('draggableInGraph') draggableInGraph: ForceDirectedGraph;

    constructor(private d3Service: D3Service, private _element: ElementRef) { }

    ngOnInit() {
        if( this.draggable instanceof Node) {
            this.d3Service.applyNodeDraggableBehaviour(this._element.nativeElement, <Node> this.draggable, this.draggableInGraph);
        } else if(this.draggable instanceof Link) {
            //this.d3Service.applyLinkDraggableBehaviour(this._element.nativeElement, <Link> this.draggable, this.draggableInGraph);
            
        }
        
    }
}

// @Directive({
//     selector: '[draggableLink]'
// })
// export class DraggableLinkDirective implements OnInit {
//     @Input('draggableInGraph') draggableInGraph: ForceDirectedGraph;
//     @Input('draggableLink') draggableLink: Link;

//     constructor(private d3Service: D3Service, private _element: ElementRef) { }

//     ngOnInit() {
//         this.d3Service.applyLinkDraggableBehaviour(this._element.nativeElement, this.draggableLink, this.draggableInGraph);
        
//     }
// }
