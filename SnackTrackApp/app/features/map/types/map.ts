/**
* Shared TypeScript types for map and routing.
*/
export type Shop = {
id: string;
name: string;
brand: string;
country: string;
city: string;
latitude: number;
longitude: number;
};


export type StoreGraph = {
/** Nodes (walkable points). id must be unique. */
nodes: { id: string; x: number; y: number; neighbors: string[] }[];
/** Named POIs, e.g., Entrance, Checkout, Departments. */
pois: { key: string; nodeId: string }[];
/** Optional background (png) size for aligning SVG overlay coordinates. */
canvas?: { width: number; height: number };
};


export type StoreItem = {
id: string;
name: string;
category: string;
/** Node in the graph closest to the shelf location. */
nodeId: string;
};


export type SearchResult = StoreItem & { distanceFromEntrance?: number };


export type RouteSegment = { from: string; to: string; pathNodeIds: string[] };


export type PlannedRoute = {
orderedItemIds: string[];
segments: RouteSegment[];
/** Total path length in pixels (or meters if scaled). */
length: number;
};