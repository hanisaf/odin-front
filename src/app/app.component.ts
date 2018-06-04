import { Component, ViewChild } from '@angular/core';
import { MatSlider, MatSidenav } from '@angular/material';
import { Data } from './data';
import { MessageService } from './message.service';
import { ElasticService } from './elastic.service';
import { TourService, IStepOption } from 'ngx-tour-md-menu';
import {AnalyticsService} from './analytics.service'
import { AsyncLocalStorage } from 'angular-async-local-storage';


declare const _paq:any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Open Data Innovation';
  navside = true;
  
  
  @ViewChild('sidedat') sidedat: MatSidenav;
  constructor(private messageService: MessageService, private elasticService: ElasticService, public tourService: TourService, public analyticsService: AnalyticsService/*, protected localStorage: AsyncLocalStorage*/) {}
  ngOnInit() {
    this.analyticsService.trackevent("Application", "Load","Application Started");
    //load configuration data
    console.log(window.location.href);
    let params = new URL(window.location.href).searchParams;
    let config = params.get('config') || 'default';
    let data = params.get('data');
    let tour = params.get('tour');
    console.log("config, data and tour: ", config, data, tour);
    this.elasticService.http_get('assets/files/' + config + '.config.json').subscribe( 
      (res) => {
        console.log("Loading configuration"); 
        Data.CONFIG = res;
        console.log("Configuration loaded");
        //warmup requet to data store
        this.elasticService.http_get(Data.CONFIG.elastic_url).subscribe(res=>console.log(res));
        if(data) {
          this.elasticService.http_get('assets/files/' + data + '.data.json').subscribe( 
            (res) => {
              console.log("Loading data"); 
              let text = JSON.stringify(res);
              Data.load(text);
              console.log("Data loaded");
              this.analyticsService.trackevent("Application", "Data","Data Loaded");
            }
          );
        }
        if(tour) {
          this.analyticsService.trackevent("Application", "Tour","Tour Requested");
          this.tourService.stepShow$.subscribe( (step: IStepOption) => {
            switch (step.stepId){
                case "step1":
                     this.sidedat.toggle();
                     //this.tourService.next();
                break;
           }
         });
         this.tourService.stepHide$.subscribe( (step: IStepOption) => {
          switch (step.stepId){
              case "step1":
                this.sidedat.toggle();
              break;
         }
        });

          this.elasticService.http_get('assets/files/' + tour + '.tour.json').subscribe( 
            (res) => {
              console.log("Loading tour"); 
              console.log(res);
              console.log("Tour loaded");
              this.analyticsService.trackevent("Application", "Tour","Tour Loaded");
              this.tourService.initialize(res as Array<Object>, {
                route: '',
              });
              this.tourService.start();
            }
          );
        }
        //#region Analytics/Mouse tracking
        if (Data.CONFIG.analytics_enabled)
          this.analyticsService.trackuser();
        
        if (Data.CONFIG.track_mouse_movement_enabled)
          this.analyticsService.trackmouse();
        
        
        //#endregion
      }
    );
    //this.route.params.subscribe(params => console.log(params));
      //Typically, this ID will be an email address or a username provided by your authentication system.
  
  }
  
  reset() {
    //console.log(Data.concepts);
    this.messageService.log("Clearing", "AppComponent.reset");
    Data.reset();
    this.messageService.info("New workspace created");
    //console.log(Data.concepts);

  }

  save() {
    this.analyticsService.trackevent("Application", "Data","Wrokspace Saved");
    Data.save();
    this.messageService.info("Workspace saved to console");
  }
  export(format:String)
  {
    this.analyticsService.trackevent("Application", "Data","Export Requested");
    if (format == "svg")
    {
      var svg = document.getElementById("svg");
      let style:string = `<style type="text/css">
    .link {
        stroke: gray;
        fill-opacity: 0;
        cursor: pointer;
        stroke-opacity: 0.5;
    }
    .selected-line {
        cursor: pointer;
        fill-opacity: 0;
        stroke-opacity: 0.5;
        stroke: green;
     } 
     </style>`;
    
     let defs = document.createElement('defs');
     defs.innerHTML = style;
     svg.insertAdjacentElement("afterbegin", defs);

      var serializer = new XMLSerializer();
      var source = serializer.serializeToString(svg);

      //add name spaces.
      if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
          source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
      }
      if(!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)){
          source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
        }
      


      //add xml declaration
      source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

      var svgBlob = new Blob([source], {type:"image/svg+xml;charset=utf-8"});
      var downloadLink = document.createElement("a");
      var svgUrl = URL.createObjectURL(svgBlob);
      downloadLink.href = svgUrl;
      downloadLink.download = "odin-graph.svg";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
    
  }

  fileChange(event) {
    let fileList: FileList = event;//event.target.files;
    if(fileList.length > 0) {
        let reader = new FileReader();
        reader.readAsText(fileList[0]);
        reader.onload = () => {
            var text = reader.result;
            Data.load(text);
        }
    }
  }
  load() {
    //fileChange(event) is doing the task
    alert("Temporarily unavailable. Use the file upload button on the main page.")
  }
  about() {

    this.analyticsService.trackevent("TopMenu","AboutMenuItemClicked","About Dialog")
    // console.log(Data.hits);
    // console.log(Data.hits.keys());
    console.log(Data.workspaceGraph);
    //let v = this.configService.version;
    //let v = CONFIG.version;
    let v = Data.build;
    alert("ODIN build " + v + "\nContact Hani Safadi\nhanisaf@uga.edu");
  }

  test1() {
    this.elasticService.HTTP("/html5").subscribe((results) => {
      console.log(results);
    })
  }

  test2() {
    this.elasticService.HTTP("/html5/_search",
  { 
    "query": {
      "match": {"_all": "web"}
  }
  }
  ).subscribe((results) => {
      console.log(results);
    })
  }

  test3() {
    this.elasticService.HTTP("/").subscribe(results=>console.log(results));
  }


}
