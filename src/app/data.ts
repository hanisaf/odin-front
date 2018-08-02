import {Concept} from './concept';
import {Graph} from './graph';
import { KnowledgeViewComponent } from './knowledge-view/knowledge-view.component';
import { DataViewComponent } from './data-view/data-view.component';
import { RenderingService } from './rendering.service';
import {OGraph} from './types';
import { Observable } from 'rxjs/Observable';
import { Subject }    from 'rxjs/Subject';
import {HttpClient} from  '@angular/common/http';
export class Data {
    
//// to store last data query to be used in data-view component
//     static setLastResponse(response: any): any {
//     //this.lastResponse = {results : "", index :"",  selectedFields: []}; 
//            this.lastResponse = response;
//   }
    constructor() {
      }
    //value is set by the build script
    static build = "Thu Aug  2 14:31:53 EDT 2018";

    //static lastResponse: any = {};
    static concepts: Concept[] = [];
    static CONFIG:any = {};
      
    static workspaceGraph : OGraph; //The graph to be rendered
    static renderGraph() {
        this.renderingService.update();
    }

    static message: string;

    static hits: Map<string, Object[]> = new Map<string, Object[]>();    
    static  getHit(index: string): Object[] {
        let h = this.hits.get(index);
        return  h.slice(0,h.length-1); //last element is selectedDataFields
    }

    static getSelectedDataFields(index: string): string[] {
        let h = this.hits.get(index);
        return <string[]> h[h.length-1];
    }
    static setHit(index: string, nh: Object[], selectedDataFields: string[]) {
        nh.push(selectedDataFields);
        //nh.push([selectedDataFields[0]["type"]]);
        this.hits.set(index, nh);
        this.dataView.update();
    };
    // static updateHit(hit: Map<string, Object[]>)
    // {
    //     this.hits = hit;
    //     this.dataView.update();
    // };

    static palette:{color:string, text:string[]}[] = [];

    static dataView: DataViewComponent;
    static subscribeDataViewComponent(dvc: DataViewComponent) {
        this.dataView = dvc;
    }
    static renderingService: RenderingService;
    static subscribeRenderingService(rs: RenderingService) {
        this.renderingService = rs;
    }

    static reset() {
        this.concepts.splice(0, this.concepts.length);
        this.palette.splice(0, this.palette.length);
        this.hits = new Map<string, Object[]>();
        this.message = "Reset"; 
        this.renderingService.update();
        this.dataView.update();
    }


    static dump() {
        let fileContent = {
            created: new Date(),
            version: this.CONFIG.version,
            concepts: this.concepts, 
            //workspaceGraph: this.workspaceGraph, 
            hits: JSON.stringify(Array.from(this.hits.entries())),
            palette: this.palette, 
        };
        console.log(fileContent);
        return fileContent;
    }
    /** Downloads current view as a JSON file  */
    static save() {
        let fc = this.dump();
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fc));
        var downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        let dateString = fc.created.toLocaleDateString().replace(/\//g,"-");
        let timeString = fc.created.toLocaleTimeString().replace(/:/g,"-").replace(/ /g,"");
        downloadAnchor.setAttribute("download", "odin-v" + fc.version + "_" + dateString + "_" + timeString + ".json");
        downloadAnchor.click();
        downloadAnchor.remove();
    }
    /** General save function  */
    static saveCsv(fileContents, extension, datetime) {
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fileContents));
        var downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        let dateString = datetime.toLocaleDateString().replace(/\//g,"-");
        let timeString = datetime.toLocaleTimeString().replace(/:/g,"-").replace(/ /g,"");
        downloadAnchor.setAttribute("download", "odin-" + dateString + "_" + timeString + "." + extension);
        downloadAnchor.click();
        downloadAnchor.remove();
    }

    static load(data) {
        this.reset();
        let jsonData = JSON.parse(data);
        //this.CONFIG = jsonData.CONFIG;
        //this.concepts = jsonData.concepts;
        for(let concept of jsonData.concepts) {
            //let c: Concept = new Concept(concept.name);
            let g = concept.graph;
            let graph = Graph.readJson(g);
            concept.graph = graph;
            this.concepts.push(concept);
        }
        //this.workspaceGraph = jsonData.workspaceGraph;
        this.hits = new Map<string, Object[]>(JSON.parse(jsonData.hits));
        // let hs = JSON.parse(jsonData.hits);
        // for(let h of hs) {
        //     this.setHit(h[0], h[1]);
        // }
        this.dataView.update();

        this.palette = jsonData.palette;
        this.renderingService.update();
        //this.dataView.update();         
    }

    static addConcept(concept: Concept) {
        let name: string = concept.name;
        if(name.length>0) {
            for(let i=0; i<this.concepts.length; i++) {
              let c = this.concepts[i];
              if(c.name == name) {
                return;
              }
            }
            this.concepts.push(concept);
            this.message = "Added concept " + name;
            this.renderingService.update();    
          }
    }

    static removeConcept(concept: Concept) {
        let name: string = concept.name;
        for(let i=0; i<this.concepts.length; i++) {
            let c = this.concepts[i];
            if(c.name == name) {
                this.concepts.splice(i, 1);
                this.message = "Removed concept " + name;
                this.renderingService.update();
            }
          }

    }
    static cPalette:string[] = ["red", "maroon", "yellow", "olive", "lime", "green", "aqua", "teal", "blue", "navy", "fuchsia", "purple",
        "lightblue", "lightcoral", "lightcyan", "lightyellow", "lightgray", "lightpink", "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray", "lightsteelblue"];
    static legend(legend: string, colour:string) {
        let colorExist = false;
        for(let p of this.palette) {
            if(p.color==colour) {
                colorExist = true;
                let textExist= false;
                for(let t of p.text) {
                    if(t==legend) {
                        textExist = true;
                    }
                }
                if(!textExist) {
                    p.text.push(legend);
                }
            }
        }
        if(!colorExist) {
            this.palette.push({color:colour, text:[legend]});
        }
    }


/**
 * Returns a hash code for a string.
 * (Compatible to Java's String.hashCode())
 *
 * The hash code for a string object is computed as
 *     s[0]*31^(n-1) + s[1]*31^(n-2) + ... + s[n-1]
 * using number arithmetic, where s[i] is the i th character
 * of the given string, n is the length of the string,
 * and ^ indicates exponentiation.
 * (The hash value of the empty string is zero.)
 *
 * @param {string} s a string
 * @return {number} a hash code value for the given string.
 */
static hashCode = function(s: string) : number {
    var h = 0, l = s.length, i = 0;
    if ( l > 0 )
      while (i < l)
        h = (h << 5) - h + 1 + s.charCodeAt(i++) | 0;
    return h;
  };
  
static intToRGB = function(i: number) : string {
    var c = (i & 0x00FFFFFF)
    .toString(16)
    .toUpperCase();
    return "00000".substring(0, 6 - c.length) + c;
};
}

export let CONFIG = Data.CONFIG;
