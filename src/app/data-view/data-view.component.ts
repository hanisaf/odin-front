import { Component, OnInit, Input } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Data } from '../data';
import { ElasticService } from '../elastic.service';
import { NodeVisualComponent } from '../visuals/shared';
import { query } from '@angular/animations';
//import CONFIG from '../app.config';
@Component({
  selector: 'app-data-view',
  templateUrl: './data-view.component.html',
  styleUrls: ['./data-view.component.css']
})
export class DataViewComponent implements OnInit {
  //relevantColumns = [];
  selectedColumns = [];
  //@Input()
  dataColumns = [];
  _selectedSource: string;
  highlight = false;

  get selectedSource() {
    return this._selectedSource;
  }

  set selectedSource(s: string) {
    this._selectedSource = s;
    this.update();
  }
  // @ViewChild(MatPaginator) paginator: MatPaginator;

  content(object, key) {
    //object has its value in object[0], and if highlight available, the highlight is in object[0]
    //so, we decide which one to show by eliminating one of the dimensions
    if (this.highlight && object[1] && object[1][key]) //if highlight is enabled, and highlight object is available, and current column's (key's) highlight is available
      object = object[1];
    else 
      object = object[0];
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

  toggleHighlights()
  {
   // this.elasticService.highlight = this.highlight;
    //let query = this.elasticService.previousPage(this.selectedSource);
   // let query = this.elasticService.lastDataQuery.get(this.selectedSource);
   // const results = this.elasticService.OD(query, Data.lastResponse);
   // Data.setHit(query.index, results, query.selectedFields);
    //this.elasticService.hits
    //Data.setHit(Data.lastResponse.index, Data.lastResponse.results, Data.lastResponse.selectedFields);
    //Data.setHit(lastResponse.index, lastResponse.results, lastResponse.selectedFields);
    //Data.setHit(query.index,)
    //this.update();
  } 
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
      //for(let col of Data.CONFIG.default_fields) {
      let f = Data.getSelectedDataFields(this.selectedSource);
      if(f.length==0) 
        f = Data.CONFIG.default_fields;
      for(let col of f) {
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
    //todo Check selected source here
    let result = [];
    let hit = Data.getHit(this.selectedSource);
    if (hit) {
      for(let item of hit) {
        if(item[0]) { //item[0] is the "source" or actual value, and item[1] is the highlight, if available. In this loop, since we need all column names, we read data from item[0]
          let cols = this.flatten("", item[0]);
          for(let col of cols) {
            if(!result.includes(col))
              result.push(col);
          }
        }

      }
    }
    this.dataColumns= result.map(x=>x.substr(1)).sort(); //delete leading dot;
    //this.relevantColumns = result.map(x=>x.substr(1)).sort();// ["type","text","status.keyword"];
  }
  ngOnInit() {}

  constructor(private elasticService: ElasticService) {
    this.dataSource = new MatTableDataSource<Object>();
    // this.dataSource.paginator = this.paginator;    
    Data.subscribeDataViewComponent(this);
    this.highlight = elasticService.highlight;
    //Data.addSubscriber(this);
  }
  exportcsv()
  {
    var data = this.ConvertToCSV(this.dataSource.data);
    Data.saveCsv(data, "csv", new Date());
  }
  ConvertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';
    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','
            line += array[i][index];
        }
        str += line + '\r\n';
    }
    return str;
}
  ngAfterViewInit() {
    //this.dataSource.paginator = this.paginator;
  }
}
