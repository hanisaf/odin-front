import { MatTextareaAutosize } from "@angular/material";

// d3 Node
export interface SimulationNodeDatum {
    index?: number;
    x?: number;
    y?: number;
    vx?: number;
    vy?: number;
    fx?: number | null;
    fy?: number | null;
}
// d3 Link
export interface SimulationLinkDatum<NodeDatum extends SimulationNodeDatum> {
    source: NodeDatum;
    target: NodeDatum;
    index?: number;
}
// ODIN Node extends d3 Node
export interface ONode extends SimulationNodeDatum {
    label: string;
    type: string;
    sources: string[]; // data source, i.e. elastic indices
    important: boolean; // if node cross listed in multiple sources
    selected: boolean;
    size: number;
    // color?: string;
    equals(n: ONode): boolean;
}
// ODIN Link
export interface OLink extends SimulationLinkDatum<ONode> {
    important: boolean;
    selected: boolean;
    sources: string[];
    weight: number;
    // color?: string;
    equals(l: OLink): boolean;
}
// ODIN Graph
export interface OGraph {
    nodes: ONode[];
    links: OLink[];
    //links max and min weight (used to determine thickness when rendering)
    minWeight, maxWeight : number;
    //nodes max and min size (used to determine radius when rendering )
    minSize, maxSize : number;
    // sources: string[];
    duplicate(): OGraph;
    removeSelected(): boolean;
    reset();
    merge(g: OGraph);
}


export type OQuery = { kind: 'indices' } |
{ kind: 'fields', index: string } | { kind: 'types', index: string } |
{ kind: 'data', index: string, source: ONode, target?: ONode, page: number, size: number } |
{ kind: 'search', index: string, text?: string, match?: 'document' | 'sentence' | 'exact',
from_date?: string, to_date?: string, contains: ONode[],
fields: string[], types?: string[], include?: ONode[], exclude?: ONode[], certainty: number, breadth: number, depth: number};
