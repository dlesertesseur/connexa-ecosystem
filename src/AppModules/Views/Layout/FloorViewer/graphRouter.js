import { Graph, alg } from "@dagrejs/graphlib";

class GraphRouter {
  constructor(graphMetaData) {
    this.graphMetaData = graphMetaData;
    this.graph = null;
  }

  canculateDistance(x1, y1, x2, y2) {
    let y = x2 - x1;
    let x = y2 - y1;

    return Math.sqrt(x * x + y * y);
  }

  build() {
    this.graph = new Graph({ directed: true });

    const nodes = this.graphMetaData.nodes;
    const edges = this.graphMetaData.edges;

    nodes.forEach((node) => {
      this.graph.setNode(node.id, { label: node.name });
    });

    const modeByIdMap = new Map(
      nodes.map((n) => {
        return [n.id, n];
      })
    );

    edges.forEach((edge) => {
      const nOri = modeByIdMap.get(edge.originNodeId);
      const nTar = modeByIdMap.get(edge.targetNodeId);

      if (nOri && nTar) {
        const distance = this.canculateDistance(nOri.locationx, nOri.locationz, nTar.locationx, nTar.locationz);
        const edgeName = `${nOri.name}-${nTar.name}`;
        this.graph.setEdge(edge.originNodeId, edge.targetNodeId, { label: edgeName, weight: distance });
      }
    });

    this.result = alg.dijkstra(this.graph, this.firstNode);
  }

  getPath(origin, target) {
    const shortestPath = dijkstra(this.graph, origin, (v) => this.graph.nodeEdges(v));
    const path = dijkstraPath(this.graph, shortestPath, origin, target);
    const pathLabels = path.map((edge) => this.graph.edge(edge).label);
    return(pathLabels);
  }
}

export { GraphRouter };
