import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { MessageService } from './message.service';
import { Node, Link } from './d3/index';
import { OQuery, ONode, OLink, OGraph } from './types';
import { Graph } from './graph';
import { Data } from './data';
@Injectable()
export class ElasticService {
  cache: Map<string, Object>;

  // for data pagination
  page = new Map<string, number>();
  hits = new Map<string, number>();
  lastDataQuery = new Map<string, any>();
  lastQuery;

  pages(index: string): number {
    const num = this.hits.get(index);
    return Math.floor(num / Data.CONFIG.page_size) + 1;
  }
  constructor(public http: HttpClient, private msg: MessageService) {
    this.cache = new Map<string, Object>();
  }

  resetPage(index: string) {
    this.page.set(index, 0);
  }
  nextPage(index: string) {
    if (this.lastDataQuery.get(index) && this.page.get(index) < this.pages(index) - 1) {
      this.page.set(index, this.page.get(index) + 1);
      this.lastDataQuery.get(index).page = this.page.get(index);
    }
    return this.lastDataQuery.get(index);
  }
  previousPage(index: string) {
    if (this.lastDataQuery.get(index) && this.page.get(index) > 0) {
      this.page.set(index, this.page.get(index) - 1);
      this.lastDataQuery.get(index).page = this.page.get(index);

    }
    return this.lastDataQuery.get(index);
  }

  aggregationGraph(query: any, response: any): OGraph {
    const graph: OGraph = new Graph();
    const aggregations = response['aggregations'];
    const fields = Object.keys(aggregations);

    let firstNode: ONode;
    if (query.contains.length > 0) { // we know the first node
      firstNode = query.contains[0];
      graph.nodes.push(firstNode);
    }

    for (const field of fields) {
      const buckets = aggregations[field]['buckets'];
      for (const bucket of buckets) {
        const newNode = new Node(bucket['key'], field, query.index, bucket['bg_count']); // TODO bucket["score"]);

        if (!this.nodeInclusion(graph.nodes, newNode))
          graph.nodes.push(newNode);

        if (firstNode && !firstNode.equals(newNode)) {
          const score = bucket['score'];
          // if(score > CONFIG.link_score_threshold) {
          const sources: string[] = [];
          for (const s of firstNode.sources)
            if (!sources.includes(s))
              sources.push(s);
          for (const s of newNode.sources)
            if (!sources.includes(s))
              sources.push(s);
          const link: Link = new Link(firstNode, newNode, score, sources);
          graph.links.push(link);
          // }

        }
      }
    }
    return graph;
  }

  flatten(k, v) {
    const res = [];
    if (!v.properties) {
      res.push(k);
      if (v.fields)
        for (const f of Object.keys(v['fields']))
          res.push(k + '.' + f);
    } else {
      const properties = Object.keys(v['properties']);
      for (const p of properties) {
        const nv = v['properties'][p];
        const res2 = this.flatten(k + '.' + p, nv);
        res.push(...res2);
      }
    }
    return res;
  }

  parseTypes(query: any, response: any): string[] {
    const res = response['aggregations']['unique_values']['buckets'];
    const result = [];
    for (const r of res)
      result.push(r['key']);
    return result;
    // ES 2.4 CODE
    // let res = response[query.index]["mappings"];
    // let result = [];
    // let types = Object.keys(res);
    // for (let t of types) {
    //   //if (t[0] != "_") {
    //     result.push(t);
    //   //}
    // }
    // return result;
  }

  parseFields(query: any, response: any): string[] {
    const res = response[query.index]['mappings'];
    const result = [];
    const types = Object.keys(res);
    for (const t of types) {
      // if (t[0] != "_") {
        const fields = res[t]['properties'];
        const flat = this.flatten('', { properties: fields });
        result.push(...flat);
      // }
    }
    const a = result.map(x => x.substr(1)).sort(); // delete leading dot
    const b = new Set(a);
    let fields = [];

    if(Data.CONFIG.ignore_analyzed_when_keyword_available) {
      //ignore non-keyword fields if keyword ones are available
      b.forEach((item)=> {
        let i = item as String;
        if(!i.endsWith(".keyword")) {
          if(b.has( i + ".keyword")) {
            fields.push(i + ".keyword");
          } else {
            fields.push(i);
          }
        } else {
          if(!fields.includes(i)) {
            fields.push(i);
          }
        }
      });
    } else {
      fields = Array.from(b);
    }

    return fields;
  }

  nodeInclusion(nodes: ONode[], node: ONode): boolean {
  // let found = false;
    // tslint:disable-next-line:curly
    // for (const n of nodes) {
    //   if (n.equals(node)) {
    //     found = true;
    //     break;
    //   }
    // }
    // return found;
    return nodes.includes(node);
  }

  // use with explore and expand to allow depth
  // it sends depth number of queries to elastic
  ODIN_RECURSIVE(query: OQuery, subject: Subject<OGraph>, nodeQueue: ONode[] = [], queryCount = 0): void {
    // console.log(nodeQueue.length + " ---> " + JSON.stringify(query));
    console.log(nodeQueue);
    const graph = new Graph();
    if (query.kind === 'search')
      this.EL(query).subscribe(
        response => {
          const res = <OGraph>this.OD(query, response);
          graph.merge(res);
          subject.next(graph);
          // follow depth
          for (const n of graph.nodes)
            if (!this.nodeInclusion(nodeQueue, n))
              nodeQueue.push(n);
          if (queryCount < query.depth) {
            const n = nodeQueue.splice(0, 1)[0];
            if (n) { // we may not be able to find anything more
              query.contains = [n];
              this.ODIN_RECURSIVE(query, subject, nodeQueue, queryCount + 1);
            }

          }
        }
      );
  }

  // one query
  DATA(query: OQuery): void {
    if (query.kind === 'data')
      this.EL(query).subscribe(
        response => {
          const results = this.OD(query, response);
          const index = query.index;
          Data.setHit(index, results);
          this.msg.info('loaded ' + results.length + ' from ' + this.hits.get(index) + ' ' + index + ' documents');
        }
      );
  }

  OD(query: OQuery, response: any): any {
    if (query.kind === 'fields')
      return this.parseFields(query, response);
     else if (query.kind === 'types')
      return this.parseTypes(query, response);
    else if (query.kind === 'indices') {
      const res = [];
      for (const i of Object.keys(response))
        if (Data.CONFIG.elastic_indices.length === 0 || Data.CONFIG.elastic_indices.includes(i))
          if (i[0] !== '.') // hide index if starts with .
            res.push(i);

      return res.sort();
    } else if (query.kind === 'data') {
      this.hits.set(query.index, response['hits']['total']);
      const res = <Object[]>response['hits']['hits'];
      const items = [];
      for (const r of res)
        items.push(r['_source']);
      return items;
    } else {
      const expansionGraph = this.aggregationGraph(query, response);
      return expansionGraph;
    }
  }

  calculateExclusions(selection: ONode[], graph: OGraph): ONode[] {
    const exclusion: ONode[] = [];
    for (const n of graph.nodes)
      if (!selection.includes(n))
        exclusion.push(n);
    return exclusion;
  }

  calculateAggregations(fields: string[], certainty: number, breadth: number, inclusions?: ONode[], exclusions?: ONode[]) {
    const aggregations = {};

    for (const field of fields) {
      aggregations[field] = {
        'significant_text': {
          'field': field,
          'min_doc_count': certainty,
          'size': breadth,
          'gnd': {}
        }
      };

      if (inclusions) {
        const include = [];
        for (const inc of inclusions)
          if (inc.type === field)
            include.push(inc.label);
        aggregations[field]['significant_text']['include'] = include;
      }

      if (exclusions) {
        const exclude = [];
        for (const ex of exclusions)
          if (ex.type === field)
            exclude.push(ex.label);
        aggregations[field]['significant_text']['exclude'] = exclude;

      }
    }
    return aggregations;
  }

  EL(query: OQuery): Observable<Object> {
    let api = '';
    let request = null;
    if (query.kind === 'fields')
      api = '/' + query.index + '/_mapping';
    else if (query.kind === 'types') {
      request = {
        'size': 0,
        'aggs' : {
            'unique_values' : { 'terms' : { 'field' : 'type' } }
        }
      };
      api = '/' + query.index + '/_search';
      // types DEPRECATED in ES5
      // api = "/" + query.index + "/_mapping";
    } else if (query.kind === 'indices')
      api = '/_aliases';
    else if (query.kind === 'data') {
      this.lastDataQuery.set(query.index, query);
      const q = [];
      const n1 = {};
      n1[query.source.type] = query.source.label;
      q.push({ 'term': n1 });
      if (query.target) {
        const n2 = {};
        n2[query.target.type] = query.target.label;
        q.push({ 'term': n2 });
      }
      request = {
          'query': {
            'bool': {
              'must': q
            }
          }
        };
      // ES2.4 syntax
      // request =
      //   {
      //     "query": {
      //       "filtered": {
      //         "filter": {
      //           "bool": {
      //             "must": q,
      //           }
      //         }
      //       }
      //     }
      //   }
      api = '/' + query.index + '/_search';
      // pagination
      api = api + '?size=' + query.size + '&from=' + (query.size * query.page);
    } else if (query.kind === 'search') {
      api = '/' + query.index;

      // ES removed types
      // if(query.types && query.types.length > 0) {
      //   let types = query.types.join();
      //   api = api + "/" + types;
      // }
      api = api + '/_search';
      const aggregations = this.calculateAggregations(query.fields, query.certainty, query.breadth, query.include, query.exclude);
      const match = [];
      // tslint:disable-next-line:curly
      if (query.text) {
        // TODO fix it https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query.html
        // switch (query.match) {
        //   case "document":
        //     match.push({ "match": { "_all": { "query": query.text } } });
        //     break;
        //   case "sentence":
        //     //TODO fix it
        //     match.push({ "match": { "_all": { "query": query.text, "slop": Data.CONFIG.default_proximity } } });
        //     break;
        //   case "exact":
        //     match.push({ "match": { "_all": { "query": query.text, "type": "phrase" } } });
        //     break;
        // }

        // if(query.match=="sentence")
        //   match.push({ "match_phrase" : { "_raw": { "query": query.text , "slop": Data.CONFIG.default_proximity} } });
        // else if(query.match=="exact")
        //   match.push({ "match_phrase" : { "_raw": { "query": query.text } } });
        // else
        //   match.push({ "match" : { "_raw": { "query": query.text } } });
        match.push({'query_string' : {'query' : query.text}});
      }
      for (const s of query.contains) {
        const term = {};
        term[s.type] = s.label;
        match.push({ 'term': term });
      }
      // if date are specified

      if (query.from_date || query.to_date) {
        let filter = {};
        filter = { 'range': { 'timestamp': {} } };
        if (query.from_date)
          filter['range']['timestamp']['gte'] = query.from_date;
        if (query.to_date)
          filter['range']['timestamp']['lte'] = query.to_date;
        match.push(filter);
      }

      if (query.types && query.types.length > 0) {
        const should = [];
        for (const t of query.types)
          should.push({'term': { 'type': t }});
        match.push({'bool': { 'should' : should}} );
      }

      request = {
          'size': 0,
          'query': {
            'bool': {
              'must': match
            }
          },
          'aggregations': aggregations
        };

    }

    this.lastQuery = query;
    console.log(api);
    console.log(request);
    return this.HTTP(api, request);
  }

  HTTP(url: string, request?: Object): Observable<Object> {
    let key = url;
    if (request)
      key = key + ' ' + JSON.stringify(request);
    if (this.cache.has(key)) {
      console.log('cache hit');
      const res = this.cache.get(key);
      return Observable.create(function (observer) {
        observer.next(res);
        observer.complete();
      });
    } else {
      console.log('cache miss');
      url = Data.CONFIG.elastic_url + url;
      let response: Observable<Object>;
      if (request)
        response = this.http.post(url, request);
      else response = this.http.get(url);
      return response.pipe(
        tap(results => this.cache.set(key, results)),
        catchError(this.handleError('http', []))
      );
    }
  }

  http_get(url: string) {
    return this.http.get(url).pipe(
      catchError(this.handleError('http', [])));
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      // this.log(`${operation} failed: ${error.message}`);
      this.msg.error(error.message, error.operation);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }



}
