import { Component, OnInit, Input } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Data } from '../data';
import { ElasticService } from '../elastic.service';
//import CONFIG from '../app.config';
@Component({
  selector: 'app-data-view',
  templateUrl: './data-view.component.html',
  styleUrls: ['./data-view.component.css']
})
export class DataViewComponent implements OnInit {
  selectedColumns = [];
  //@Input()
  dataColumns = [];

  _selectedSource: string;
  get selectedSource() {
    return this._selectedSource;
  }

  set selectedSource(s: string) {
    this._selectedSource = s;
    this.update();
  }
  // @ViewChild(MatPaginator) paginator: MatPaginator;

  content(object, key) {
    //parse nested keys
    if(key.includes(".")) {
      let res = object;
      let keys = key.split(".");
      for(let k of keys)
        if(res)
          res = res[k];
      return res;
    } else {
      let res = object[key];
      return res;
    }


  }
  dataSource: MatTableDataSource<Object>;

  update() {
    if(!this._selectedSource) {
      this._selectedSource = this.elasticService.lastDataQuery.keys().next().value;
      //when loading, elasticService does not have a lastDataQuery, default to saved data
      if(!this._selectedSource) {
        this._selectedSource = Data.hits.keys().next().value;
      }
    }
    this.selectedColumns = [];
    this.dataSource.data = Data.getHit(this.selectedSource);
    this.updateDataColumns();
    //if no selected columns, default will be the default fields from settings
    if(this.selectedColumns.length==0) {
      for(let col of Data.CONFIG.default_fields) {
        if(this.dataColumns.indexOf(col) > -1 ) {
          this.selectedColumns.push(col);
        }
      }
    }
  } 
  get currentPage() {
    if(this.selectedSource) {return this.elasticService.page.get(this.selectedSource) + 1;}
    else return 0;
    
  }
  get totalPages() {
    if(this.selectedSource) {
      return this.elasticService.pages(this.selectedSource);
    } else return 0;
    
  }

  get pageSize() {
    return Data.CONFIG.page_size;
  }
  
  flatten(k, v) {
    let res = [];
    if(v==null) {
      res.push(k);
    }
    else if(typeof v != "object" || (v.length)) {

      res.push(k);

    } else {
      let keys = Object.keys(v);
      for(let key of keys) {
        let nv = v[key];
        let res2 = this.flatten(k + "." + key, nv)
        res.push(...res2);
      }
    }
    return res;
  }
  
  getData(query) {
    if(query) {
      this.elasticService.DATA(query);
    } 
  }
  onPrevious() {
    let query = this.elasticService.previousPage(this.selectedSource);
    this.getData(query);
  }

  onNext() {
    let query = this.elasticService.nextPage(this.selectedSource);
    this.getData(query);
  }

  get dataSources() {
    let res: string[] = [];
    Data.hits.forEach((value: Object[], key: string) => {
      res.push(key);
    });
    return res;
  }

  updateDataColumns() {
    //this.update();
    //let cols = [];
    let result = [];
    let hit = Data.getHit(this.selectedSource);
    if (hit) {
      for(let item of hit) {
        if(item) {
          let cols = this.flatten("", item);
          for(let col of cols) {
            if(!result.includes(col))
              result.push(col);
          }
        }

      }
    }
    this.dataColumns= result.map(x=>x.substr(1)).sort(); //delete leading dot;
  }
  ngOnInit() {}

  constructor(private elasticService: ElasticService) {
    this.dataSource = new MatTableDataSource<Object>();
    // this.dataSource.paginator = this.paginator;    
    Data.subscribeDataViewComponent(this);
    //Data.addSubscriber(this);
  }
  ngAfterViewInit() {
    //this.dataSource.paginator = this.paginator;
  }
}
