import { Component, Input } from '@angular/core';
import { Node, D3Service } from '../../../d3';
import * as d3 from 'd3';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { ElasticService } from '../../../elastic.service';
//import { clearTimeout } from 'timers';
import {Data} from '../../../data';
// import CONFIG from '../../../app.config';

import { MessageService } from '../../../message.service';
//import {LongPressDirective} from '../../../d3/directives/longpress.directive'
@Component({
  selector: '[nodeVisual]',
  template: `
  
  <svg:g long-press
          class="node"
          *ngIf="isMobileOrTablet()"
          [attr.transform]="'translate(' + node.x + ',' + node.y + ')'" 
          (click)="highlight()"
          (onLongPress)="data()"
      >
      <svg:circle
          [class.selected-circle]="node.selected"
          [class.important-circle]="node.important"
          cx="0"
          cy="0"
          [attr.r]="node.r"  
          [attr.fill]="node.color"
          >
      </svg:circle>
      <svg:text
          class="node-name"
          [attr.font-size]="node.fontSize">
        {{node.label}}
      </svg:text>
    </svg:g>

    <svg:g 
          class="node"
          *ngIf="!isMobileOrTablet()"
          [attr.transform]="'translate(' + node.x + ',' + node.y + ')'" 
          (click)="highlight()"
          (dblclick)="data()"
      >
      <svg:circle
          [class.selected-circle]="node.selected"
          [class.important-circle]="node.important"
          cx="0"
          cy="0"
          [attr.r]="node.r"  
          [attr.fill]="node.color"
          >
      </svg:circle>
      <svg:text
          class="node-name"
          [attr.font-size]="node.fontSize">
        {{node.label}}
      </svg:text>
    </svg:g>
    
  `,
  styleUrls: ['./node-visual.component.css']
})


export class NodeVisualComponent implements OnInit {
  constructor(private elasticService: ElasticService, private msg: MessageService) {}
  //needed to distinguish click from double click events
  //timer : NodeJS.Timer ;
  timer;
  delay = 200;
  prevent = false;
  
  ngOnInit(): void {
    // function dragged() {
    //   alert("dragged");
    //   this.node.fx = d3.event.x;
    //   this.node.fy = d3.event.y;
    // }
    //d3.event.on('drag', dragged);
    
      // if (this.isMobileOrTablet())
      //   alert('mobile');
      // else
      //   alert('pc');
  }
  isMobileOrTablet()
  {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor);
    return check;
  }
  @Input('nodeVisual') node: Node;

  // clickAction(obj,event) {
  //   var self = this;
  //   this.timer = setTimeout(function() {
  //     if (!self.prevent) {
  //       self.highlight();
  //       self.prevent = true;
  //     }
      
  //   }, this.delay);
  //   self.prevent = false;
  // }

  // doubleClickAction(obj,event) {
  //   //clearTimeout(this.timer);
  //   if(!this.prevent) {
  //     this.timer = null;
  //     this.prevent = true;
  //     this.data();
  //   }

  // }
  data() {
    //console.log(this.node);
    //this.backendService.getData(this.node);
    for(let index of this.node.sources) {
      let query = {kind: "data" as "data", index: index, source: this.node, page:0, size: Data.CONFIG.page_size};
      this.elasticService.resetPage(index);
      this.elasticService.DATA(query);
      // .subscribe(
      //   results => {
      //     Data.setHit(index, results);
      //     this.msg.info(this.elasticService.hits + " " + index + " document(s) found " );
      //   }
      // )
    }

    // this.elasticService.EL(query).subscribe(
    //   response => { Data.hit=this.elasticService.OD(query, response); this.msg.info(this.elasticService.hits + " document(s) found!");}
    // )

  }
  
  highlight() {
    this.node.important=false;
    this.node.selected = !this.node.selected;
   }
}
