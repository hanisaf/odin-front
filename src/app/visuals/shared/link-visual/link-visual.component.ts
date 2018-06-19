import { Component, Input } from '@angular/core';
import { Link } from '../../../d3';
import { ElasticService } from '../../../elastic.service';
import {Data} from '../../../data';
import { MessageService } from '../../../message.service';
import { Graph } from '../../../graph';

@Component({
  selector: '[linkVisual]',
  template: `
    <svg:line
        class="link"
        [class.selected-line]="link.selected"
        (dblclick)="data()"
        (click)="highlight()"
        [attr.x1]="link.source.x"
        [attr.y1]="link.source.y"
        [attr.x2]="link.target.x"
        [attr.y2]="link.target.y"
        [attr.stroke-width]="link.w" 
    ></svg:line>
  `,
  styleUrls: ['./link-visual.component.css']
})
export class LinkVisualComponent  {
  @Input('linkVisual') link: Link;
  @Input('sourceGraph') graph:Graph;

  
  constructor(private elasticService: ElasticService,
  private msg: MessageService) {}
  data() {
    this.link.selected = true;
    // let sources = new Set<string>();//union of data sources of the two nodes of the link
    // for(let s of this.link.source.sources)
    //   sources.add(s);
    // for(let s of this.link.target.sources)
    //   sources.add(s);
    this.link.sources.forEach(
      index=> {
        let query = {kind: "data" as "data", index: index, source: this.link.source, target: this.link.target, page:0, size: Data.CONFIG.page_size, selectedFields: this.graph.getSelectedFields()};
        this.elasticService.resetPage(index);
        this.elasticService.DATA(query);
        
        // this.elasticService.DATA(query).subscribe(
        //   results => {
        //     Data.setHit(index, results);
        //     this.msg.info(this.elasticService.hits + " " + index + " document(s) found " );
        //   }
        // )
      }
    )
    // for(let index of sources.values()) {
    //   let query = {kind: "data" as "data", index: index, source: this.link.source, target: this.link.target, page:0, size: CONFIG.page_size};
    //   this.elasticService.resetPage();
    //   this.elasticService.ODIN(query).subscribe(
    //     results => {
    //       Data.setHit(index, results);
    //       this.msg.info(this.elasticService.hits + " " + index + " document(s) found " );
    //     }
    //   )
    // }
    // console.log(this.link);
    // //this.backendService.getData(this.link.source, this.link.target);
    // let query = {kind: "data" as "data", source: this.link.source, target: this.link.target, page:0, size: CONFIG.page_size};
    // this.elasticService.resetPage();
    // this.elasticService.ODIN(query).subscribe(
    //   results => {
    //     Data.hit=results; 
    //     this.msg.info(this.elasticService.hits + " document(s) found!");
    //   }
    // )
    // this.elasticService.EL(query).subscribe(
    //   response => { Data.hit=this.elasticService.OD(query, response); this.msg.info(this.elasticService.hits + " document(s) found!");}
    // )
  }
  highlight() {
      this.link.important=false;
        this.link.selected = !this.link.selected;
       }
}
//[attr.stroke-width]="link.weight" 