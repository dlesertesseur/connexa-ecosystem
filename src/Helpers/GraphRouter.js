import { WeightedGraph } from "./dijsktra";

class GraphRouter {
  constructor(graphMetaData) {
    this.graphMetaData = graphMetaData;
    this.graph = null;
    this.modeByIdMap = null;
    this.modeByNameMap = null;
  }

  canculateDistance(x1, y1, x2, y2) {
    let y = x2 - x1;
    let x = y2 - y1;

    return Math.sqrt(x * x + y * y);
  }

  build() {
    this.graph = new WeightedGraph();

    const nodes = this.graphMetaData.nodes;
    const edges = this.graphMetaData.edges;

    nodes.forEach((node) => {
      this.graph.addVertex(node.name);
    });

    this.modeByIdMap = new Map();
    this.modeByNameMap = new Map();
    nodes.forEach(n => {
      this.modeByIdMap.set(n.id, n)
      this.modeByNameMap.set(n.name, n)
    });

    edges.forEach((edge) => {
      const nOri = this.modeByIdMap.get(edge.originNodeId);
      const nTar = this.modeByIdMap.get(edge.targetNodeId);

      if (nOri && nTar) {
        const distance = this.canculateDistance(nOri.locationx, nOri.locationz, nTar.locationx, nTar.locationz);
        this.graph.addEdge(nOri.name, nTar.name, distance);
        this.graph.addEdge(nTar.name, nOri.name, distance);
      }
    });
  }

  getPath(origin, target) {
    const pathNodeNames = this.graph.Dijkstra(origin, target);

    const path = pathNodeNames.map((n) => {

      const node = this.modeByNameMap.get(n);
      
      const ret = {
        name: node.name,
        x: node.locationx,
        y: node.locationz,
      };
      return ret;
    });

    return(path);
  }
}

export { GraphRouter };
