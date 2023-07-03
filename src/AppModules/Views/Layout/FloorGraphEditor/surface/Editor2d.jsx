import { ActionIcon, Button, Center, Group, NumberInput, SegmentedControl, Stack, Switch, Text } from "@mantine/core";
import { useContext, useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import { Layer, Stage } from "react-konva";
import { CONNECTOR_TWO_WAY, NODE_RADIO, RACK_ORIENTATION_Y, TOOLBAR_HIGHT } from "../../../../../Constants";
import { useTranslation } from "react-i18next";
import {
  IconArrowRightCircle,
  IconArrowRightSquare,
  IconClick,
  IconLayoutAlignCenter,
  IconLayoutAlignMiddle,
  IconCirclePlus,
  IconDeviceFloppy,
  IconEdit,
} from "@tabler/icons-react";
import G2dPolygon from "./models/G2dPolygon";
import G2dRack from "./models/G2dRack";
import G2dMarker from "./models/G2dMarker";
import G2dNode from "./models/G2dNode";
import G2dBaseNode from "./models/G2dBaseNode";
import G2dConnector from "./models/G2dConnector";
import uuid from "react-uuid";
import Toolbar from "../Toolbar";
import G2dIntermediateNode from "./models/G2dIntermediateNode";
import NodePropertiesModal from "./modals/NodePropertiesModal";
import DeleteConfirmation from "../../../../../Modal/DeleteConfirmation";
import SettingsMenu from "./SettingsMenu";
import { useHotkeys } from "@mantine/hooks";
import { IconArrowBack } from "@tabler/icons-react";
import { AbmStateContext } from "../Context";
import { useNavigate } from "react-router-dom";
import { hideNotification, showNotification } from "@mantine/notifications";
import Konva from "konva";

const scaleBy = 1.05;

function getDistance(p1, p2) {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

function getCenter(p1, p2) {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
  };
}

function isTouchEnabled() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}

function Editor2d({ width, height, layouts, racks, markers, graph, pixelMeterRelation, multiSelect = true, onSave }) {
  const { t } = useTranslation();

  const stageRef = useRef(null);
  const baseLayerRef = useRef(null);
  const nodeLayerRef = useRef(null);
  const staticNodeLayerRef = useRef(null);
  const staticConnectorsLayerRef = useRef(null);
  const connectorsLayerRef = useRef(null);
  const selLayerRef = useRef(null);

  let lastCenter = null;
  let lastDist = 0;

  const [layoutG2d, setLayoutG2d] = useState(null);
  const [racksG2d, setRacksG2d] = useState(null);
  const [markersG2d, setMarkersG2d] = useState(null);

  const [staticNodesG2d, setStaticNodesG2d] = useState([]);
  const [nodesG2d, setNodesG2d] = useState([]);
  const [staticConnectorsG2d, setStaticConnectorsG2d] = useState([]);
  const [connectorsG2d, setConnectorsG2d] = useState([]);

  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedRack, setSelectedRack] = useState(null);
  const [intermediateNodes, setIntermediateNodes] = useState([]);

  const [selectedRacks, setSelectedRacks] = useState([]);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [savedNodes, setSavedNodes] = useState([]);
  const [baseNodes, setBaseNodes] = useState([]);

  const [graphName, setGraphName] = useState("");
  const [elementGroup, setElementGroup] = useState(2);
  const [direction, setDirection] = useState(CONNECTOR_TWO_WAY);
  const [rackOrientation, setRackOrientation] = useState(RACK_ORIENTATION_Y);
  const [activeAddNode, setActiveAddNode] = useState(false);
  const [nodesIdsSelected, setNodesIdsSelected] = useState([]);
  const [openNodeProperties, setOpenNodeProperties] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const [nodes, setNodes] = useState([]);
  const navigate = useNavigate();

  const { initilizeContext, refresh } = useContext(AbmStateContext);

  const connectGraph = () => {
    const nodes = graph.nodes;
    const edges = graph.edges;
    let tableNodeById = null;

    if (nodes) {
      tableNodeById = new Map(
        nodes.map((n) => {
          return [n.id, n];
        })
      );
    }

    if (edges) {
      edges.forEach((e) => {
        const node = tableNodeById.get(e.originNodeId);
        if (!node.connectors) {
          node["connectors"] = [];
        }
        node.connectors.push(e.targetNodeId);
      });
    }
  };

  useEffect(() => {
    if (graph) {
      connectGraph();
      setGraphName(graph.description);
      setSavedNodes(graph.nodes);
    }
  }, [graph]);

  useHotkeys([["ctrl+d", () => deleteNodes()]]);

  const buildLayout = (layout) => {
    const parts = layout.parts;
    const polygons = [];

    parts.forEach((part) => {
      const component = <G2dPolygon key={part.id} part={part} pixelMeterRelation={pixelMeterRelation} />;
      polygons.push(component);
    });

    return polygons;
  };

  const buildRacks = (racks) => {
    const list = [];

    racks.forEach((rack) => {
      const component = (
        <G2dRack
          key={rack.id}
          rack={rack}
          onSelect={(event) => {
            onSelectRack(event);
          }}
          onDblClick={onDblClickRack}
        />
      );
      list.push(component);
    });

    return list;
  };

  const onSelectNode = (event) => {
    event.cancelBubble = true;
    const node = event.target;

    setSelectedNode(node);
    setNodesIdsSelected([...nodesIdsSelected, node.attrs.id]);
  };

  const onUpdatePosition = (id, position) => {
    const layer = connectorsLayerRef.current;

    //Origin
    let connectors = layer.find((c) => {
      return c.attrs.userData.originId === id;
    });

    connectors.forEach((c) => {
      c.attrs.points[0] = position.x;
      c.attrs.points[1] = position.y;
    });

    //Target
    connectors = layer.find((c) => {
      return c.attrs.userData.targetId === id;
    });

    connectors.forEach((c) => {
      c.attrs.points[2] = position.x;
      c.attrs.points[3] = position.y;
    });

    layer.draw();
  };

  const buildNodes = (nodes, initialize = false) => {
    const list = [];

    nodes.forEach((node) => {
      const component = (
        <G2dNode
          key={node.id}
          node={node}
          selected={nodesIdsSelected.includes(node.id)}
          onSelect={onSelectNode}
          onUpdatePosition={onUpdatePosition}
          onDblClick={node.onDblClick}
          initialize={initialize ? true : false}
          type={"G2dNode"}
        />
      );
      list.push(component);
    });

    return list;
  };

  const buildIntemediateNodes = (nodes) => {
    const list = [];
    nodes.forEach((node) => {
      const component = (
        <G2dIntermediateNode
          key={uuid()}
          node={node}
          color={"grey"}
          onSelect={onSelectStaticNode}
          type={"G2dIntermediateNode"}
          userData={node}
        />
      );
      list.push(component);
    });

    return list;
  };

  const findNode = (connector) => {
    let ret = null;
    const staticNodesLayer = staticNodeLayerRef.current;
    const target = staticNodesLayer.find(`#${connector}`);

    if (target && target.length > 0) {
      ret = target[0];
    } else {
      // console.log("findNode ", connector, " -> NOT FOUD");
    }

    return ret;
  };

  const findNodeById = (layer, id) => {
    let ret = null;
    const target = layer.find(`#${id}`);
    if (target && target.length > 0) {
      ret = target[0];
    } else {
      // console.log("findNodeById ", id, " -> NOT FOUD");
    }

    return ret;
  };

  const buildConnectors = (nodes) => {
    const list = [];
    const ref = stageRef.current;

    nodes.forEach((node) => {
      node.connectors?.forEach((connector) => {
        const target = findNode(connector);
        if (target) {
          const userData = {
            originId: node.id,
            targetId: target.attrs.id,
            bidirectional: direction === CONNECTOR_TWO_WAY ? true : false,
          };

          const id = uuid();
          const targetPos = target.getAbsolutePosition(ref);
          const component = (
            <G2dConnector
              origin={{ x: node.locationx, y: node.locationz }}
              target={targetPos}
              name={node.id + "-" + target.attrs.id}
              key={id}
              id={id}
              bidirectional={direction === CONNECTOR_TWO_WAY ? true : false}
              userData={userData}
              type={"G2dConnector"}
            />
          );
          list.push(component);
        }
      });
    });

    return list;
  };

  const buildNodesFromRacks = (racks) => {
    const list = [];

    racks.forEach((rack) => {
      const modules = rack.modules;
      modules.forEach((module) => {
        const component = (
          <G2dBaseNode
            key={uuid()}
            rack={rack}
            module={module}
            draggable={false}
            onSelect={onSelectStaticNode}
            type={"G2dBaseNode"}
          />
        );
        list.push(component);
      });
    });

    return list;
  };

  const buildMarkers = (markers) => {
    const list = [];

    markers.forEach((marker) => {
      const component = <G2dMarker key={marker.id} marker={marker} />;
      list.push(component);
    });

    return list;
  };

  const onSelectStaticNode = (event) => {
    event.cancelBubble = true;
    const radioNode = 15;
    const ref = stageRef.current;
    const node = event.target;

    setSelectedNode(node);

    const position = node.getAbsolutePosition(ref);

    const selObj = node.clone();
    selObj.stroke("red");
    selObj.x(position.x);
    selObj.y(position.y);
    selObj.rotation(0);
    selObj.stroke("red");
    selObj.off("mousedown touchstart tap");

    /*CARTEL*/
    const label = new Konva.Label({ x: position.x, y: position.y });
    label.rotation(-selObj.rotation());
    const tag = new Konva.Tag({
      cornerRadius: 2,
      pointerDirection: "down",
      pointerWidth: 6,
      pointerHeight: 6,
      fill: "#fff",
      stroke: "#000",
      strokeWidth: 0.5,
    });

    const text = new Konva.Text({
      padding: 2,
      text: selObj.name(),
      align: "center",
    });

    label.add(tag, text);

    if (!multiSelect) {
      selLayerRef.current.removeChildren();
    }

    selLayerRef.current.add(selObj, label);
  };

  const onSelectRack = (event) => {
    event.cancelBubble = true;

    const rack = event.target;

    setSelectedRack(rack.attrs.userData);

    const selObj = rack.clone();
    const group = rack.getParent().clone();

    group.removeChildren();
    selObj.stroke("red");

    /*CARTEL*/
    const label = new Konva.Label({ x: 0, y: 0 });
    label.rotation(-selObj.rotation());
    const tag = new Konva.Tag({
      cornerRadius: 2,
      pointerDirection: "down",
      pointerWidth: 6,
      pointerHeight: 6,
      fill: "#fff",
      stroke: "#000",
      strokeWidth: 0.5,
    });

    const text = new Konva.Text({
      padding: 2,
      text: selObj.name(),
      align: "center",
    });

    label.add(tag, text);

    group.add(selObj, label);

    if (!multiSelect) {
      selLayerRef.current.removeChildren();
    }

    selLayerRef.current.add(group);
  };

  const onDblClickRack = (evt) => {
    const rack = evt.target;
    console.log("onDblClickRack rack -> ", rack.name());
  };

  const onEmptySelection = () => {
    const ref = selLayerRef.current;

    setSelectedRack(null);
    setSelectedNode(null);
    setSelectedRacks([]);
    setSelectedNodes([]);
    setNodesIdsSelected([]);

    ref.removeChildren();
  };

  const deleteNodes = () => {
    if (nodesIdsSelected.length > 0) {
      setConfirmModalOpen(true);
    }
  };

  const onConfirm = () => {
    setConfirmModalOpen(false);

    const list = nodes.filter((n) => {
      const rest = !nodesIdsSelected.includes(n.id);
      return rest;
    });

    setNodes(list);

    let conn = connectorsG2d.filter((c) => {
      const ori = !nodesIdsSelected.includes(c.props.userData.originId);
      return ori;
    });

    conn = conn.filter((c) => {
      const tar = !nodesIdsSelected.includes(c.props.userData.targetId);
      return tar;
    });

    setConnectorsG2d(conn);
  };

  useEffect(() => {
    if (layouts && layouts.length > 0) {
      const layout = layouts[0];
      const layoutG2d = buildLayout(layout);
      setLayoutG2d(layoutG2d);
    }
  }, [layouts]);

  useEffect(() => {
    if (racks && racks.length > 0) {
      const racksG2d = buildRacks(racks);
      setRacksG2d(racksG2d);
    }
  }, [racks]);

  useEffect(() => {
    if (markers && markers.length > 0) {
      const markersG2d = buildMarkers(markers);
      setMarkersG2d(markersG2d);
    }
  }, [markers]);

  useEffect(() => {
    if (intermediateNodes) {
      const intermNodeList = buildIntemediateNodes(intermediateNodes);
      const savedNodeList = buildIntemediateNodes(savedNodes);
      setStaticNodesG2d([...intermNodeList, ...savedNodeList, ...baseNodes]);
    }
  }, [intermediateNodes, savedNodes, baseNodes]);

  useEffect(() => {
    if (nodes) {
      const ret = buildNodes(nodes);
      setNodesG2d(ret);
    }
  }, [nodes, selectedNode]);

  useEffect(() => {
    let iNodes = null;
    let sNodes = null;

    if (intermediateNodes) {
      iNodes = buildConnectors(intermediateNodes);
    }
    if (savedNodes) {
      sNodes = buildConnectors(savedNodes);
    }

    setStaticConnectorsG2d([...sNodes, ...iNodes]);
  }, [staticNodesG2d]);

  useEffect(() => {
    if (layoutG2d && racksG2d && markersG2d) {
      baseLayerRef.current.cache({ pixelRatio: 3 });
      console.log("CACHE BASE LAYER");
    }
  }, [layoutG2d && racksG2d && markersG2d]);

  useEffect(() => {
    if (staticConnectorsG2d && staticConnectorsG2d.length > 0) {
      staticConnectorsLayerRef.current.cache({ pixelRatio: 3 });
      console.log("CACHE STATIC CONNECTORS LAYER");
    }
  }, [staticConnectorsG2d]);

  useEffect(() => {
    if (staticNodesG2d && staticNodesG2d.length > 0) {
      staticNodeLayerRef.current.cache({ pixelRatio: 3 });
      console.log("CACHE STATIC NODE LAYER [" + staticNodesG2d.length + "]");
    }
  }, [staticNodesG2d]);

  useEffect(() => {
    if (selectedRack) {
      setSelectedRacks([...selectedRacks, selectedRack]);
    }
  }, [selectedRack]);

  useEffect(() => {
    if (selectedNode) {
      setSelectedNodes([...selectedNodes, selectedNode]);
    }
  }, [selectedNode]);

  useEffect(() => {
    onEmptySelection();
  }, [elementGroup]);

  function zoomStage(event) {
    event.evt.preventDefault();
    if (stageRef.current !== null) {
      const stage = stageRef.current;
      const oldScale = stage.scaleX();
      const { x: pointerX, y: pointerY } = stage.getPointerPosition();
      const mousePointTo = {
        x: (pointerX - stage.x()) / oldScale,
        y: (pointerY - stage.y()) / oldScale,
      };
      const newScale = event.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
      stage.scale({ x: newScale, y: newScale });
      const newPos = {
        x: pointerX - mousePointTo.x * newScale,
        y: pointerY - mousePointTo.y * newScale,
      };
      stage.position(newPos);
      stage.batchDraw();
    }
  }

  function handleMultiTouch(touch1, touch2) {
    const stage = stageRef.current;
    if (stage !== null) {
      if (touch1 && touch2) {
        if (stage.isDragging()) {
          stage.stopDrag();
        }

        var p1 = {
          x: touch1.clientX,
          y: touch1.clientY,
        };
        var p2 = {
          x: touch2.clientX,
          y: touch2.clientY,
        };

        if (!lastCenter) {
          lastCenter = getCenter(p1, p2);
          return;
        }
        var newCenter = getCenter(p1, p2);

        var dist = getDistance(p1, p2);

        if (!lastDist) {
          lastDist = dist;
        }

        // local coordinates of center point
        var pointTo = {
          x: (newCenter.x - stage.x()) / stage.scaleX(),
          y: (newCenter.y - stage.y()) / stage.scaleX(),
        };

        var scale = stage.scaleX() * (dist / lastDist);

        stage.scaleX(scale);
        stage.scaleY(scale);

        // calculate new position of the stage
        var dx = newCenter.x - lastCenter.x;
        var dy = newCenter.y - lastCenter.y;

        var newPos = {
          x: newCenter.x - pointTo.x * scale + dx,
          y: newCenter.y - pointTo.y * scale + dy,
        };

        stage.position(newPos);
        stage.batchDraw();

        lastDist = dist;
        lastCenter = newCenter;
      }
    }
  }

  function handleOneTouch(touch1) {
    const stage = stageRef.current;
    if (stage !== null) {
      if (touch1) {
        if (stage.isDragging()) {
          stage.stopDrag();
        }

        var p1 = {
          x: touch1.clientX,
          y: touch1.clientY,
        };

        if (!lastCenter) {
          lastCenter = p1;
          return;
        }
        var newCenter = p1;

        var pointTo = {
          x: (newCenter.x - stage.x()) / stage.scaleX(),
          y: (newCenter.y - stage.y()) / stage.scaleX(),
        };

        var scale = stage.scaleX();

        stage.scaleX(scale);
        stage.scaleY(scale);

        // calculate new position of the stage
        var dx = newCenter.x - lastCenter.x;
        var dy = newCenter.y - lastCenter.y;

        var newPos = {
          x: newCenter.x - pointTo.x * scale + dx,
          y: newCenter.y - pointTo.y * scale + dy,
        };

        stage.position(newPos);
        stage.batchDraw();
        lastCenter = newCenter;
      }
    }
  }

  function handleTouch(e) {
    e.evt.preventDefault();

    var touch1 = e.evt.touches[0];
    var touch2 = e.evt.touches[1];

    const stage = stageRef.current;
    if (stage !== null) {
      if (touch1 && touch2) {
        handleMultiTouch(touch1, touch2);
      } else {
        handleOneTouch(touch1);
      }
    }
  }

  function handleTouchEnd() {
    lastCenter = null;
    lastDist = 0;
  }

  const onLinkNodes = () => {
    const ref = stageRef.current;
    const totalNodes = selectedNodes.length;
    const list = [];
    let node = null;
    let previusNode = null;

    for (let index = 0; index < totalNodes && totalNodes > 1; index++) {
      node = selectedNodes[index];
      if (previusNode) {
        const id = uuid();
        const originPos = { x: previusNode.attrs.x, y: previusNode.attrs.y };
        const targetPos = node.getAbsolutePosition(ref);
        const userData = {
          originId: previusNode.attrs.id,
          targetId: node.attrs.id,
          bidirectional: direction === CONNECTOR_TWO_WAY ? true : false,
        };
        const component = (
          <G2dConnector
            origin={originPos}
            target={targetPos}
            name={previusNode.attrs.name + "-" + node.attrs.name}
            key={id}
            id={id}
            userData={userData}
            bidirectional={direction === CONNECTOR_TWO_WAY ? true : false}
            type={"G2dConnector"}
          />
        );
        list.push(component);
      }
      previusNode = node;
    }

    setConnectorsG2d([...connectorsG2d, ...list]);

    onEmptySelection();
  };

  const processRackGroup = (racksGroup) => {
    const ref = stageRef.current;
    const layerRef = staticNodeLayerRef.current;

    const newNodes = [];
    const aisleNodes = [];

    for (let index = 0; index < racksGroup.length; index++) {
      if (index + 1 < racksGroup.length) {
        const rack1 = racksGroup[index];
        const rack2 = racksGroup[index + 1];

        const basesRack1 = [];
        const basesRack2 = [];

        const m1 = rack1.modules;
        const m2 = rack2.modules;

        m1.sort((a, b) => a.number - b.number);
        m2.sort((a, b) => a.number - b.number);

        m1.forEach((m) => {
          m.parts.forEach((p) => {
            const arr = layerRef.find(`.${p.name}`);
            if (arr.length > 0) {
              const node = arr[0];
              const pos = node.getAbsolutePosition(ref);
              p["absPos"] = pos;
              basesRack1.push(p);
            }
          });
        });

        m2.forEach((m) => {
          m.parts.forEach((p) => {
            const arr = layerRef.find(`.${p.name}`);
            if (arr.length > 0) {
              const node = arr[0];
              const pos = node.getAbsolutePosition(ref);
              p["absPos"] = pos;
              basesRack2.push(p);
            }
          });
        });

        if (rackOrientation === RACK_ORIENTATION_Y) {
          basesRack1.sort((a, b) => a.absPos.y - b.absPos.y);
          basesRack2.sort((a, b) => a.absPos.y - b.absPos.y);
        } else {
          basesRack1.sort((a, b) => a.absPos.x - b.absPos.x);
          basesRack2.sort((a, b) => a.absPos.x - b.absPos.x);
        }

        for (let index = 0; index < basesRack1.length; index++) {
          const b1 = basesRack1[index];
          const b2 = basesRack2[index];

          const absPos1 = b1.absPos;
          const absPos2 = b2.absPos;

          const posx = (absPos2.x - absPos1.x) / 2 + absPos1.x;
          const posy = absPos1.y;

          const metaData = {
            id: uuid(),
            locationx: posx,
            locationz: posy,
            name: `${b1.name}|${b2.name}`,
            draggable: false,
            connectors: [b1.id, b2.id],
            inboundConnectors: [],
            outboundConnectors: [],
            linked: true,
          };
          newNodes.push(metaData);
          aisleNodes.push(metaData);
        }

        let prev = null;
        for (let index = 0; index < aisleNodes.length; index++) {
          const r = aisleNodes[index];
          if (prev) {
            r.connectors.push(prev.id);
          }
          prev = r;
        }
      }
    }
    return newNodes;
  };

  const onLinkStructures = () => {
    const totalRacks = selectedRacks.length;
    let startIdxGroup = 0;
    let endIdxGroup = elementGroup;
    let arr = [];

    for (
      let index = 0;
      index < totalRacks;
      index += elementGroup, startIdxGroup += elementGroup, endIdxGroup += elementGroup
    ) {
      const racksGroup = selectedRacks.slice(startIdxGroup, endIdxGroup);
      const newNodes = processRackGroup(racksGroup);
      arr = arr.concat(newNodes);
    }

    setIntermediateNodes([...intermediateNodes, ...arr]);
    onEmptySelection();
  };

  const isLinkRacksDisabled = () => {
    let ret = false;

    if (selectedRacks) {
      if (selectedRacks.length > 0) {
        ret = selectedRacks.length % elementGroup !== 0;
      } else {
        ret = true;
      }
    } else {
      ret = true;
    }

    return ret;
  };

  const isLinkNodesDisabled = () => {
    let ret = false;

    if (selectedNodes) {
      if (selectedNodes.length > 0) {
        ret = selectedNodes.length % elementGroup !== 0;
      } else {
        ret = true;
      }
    } else {
      ret = true;
    }

    return ret;
  };

  const onDblClickNode = (e) => {
    setOpenNodeProperties(true);
  };

  const addNodeOnPoint = (e) => {
    if (activeAddNode) {
      if (e.target.getStage()) {
        const ref = stageRef.current;
        var transform = ref.getAbsoluteTransform().copy();
        transform.invert();
        const pos = e.target.getStage().getPointerPosition();
        let clickPos = transform.point(pos);

        const color = "blue";
        const id = uuid();
        const node = {
          id: id,
          locationx: clickPos.x,
          locationz: clickPos.y,
          width: NODE_RADIO,
          height: NODE_RADIO,
          color: color,
          name: "NODE-" + id,
          draggable: true,
          connectors: [],
          inboundConnectors: [],
          outboundConnectors: [],
          linked: false,
          onDblClick: onDblClickNode,
        };

        setNodes([...nodes, node]);
      }
    }
  };

  const onCreateBaseNodes = () => {
    const list = buildNodesFromRacks(selectedRacks);
    setBaseNodes([...baseNodes, ...list]);
    // const arr = staticNodesG2d.concat(list);
    // setStaticNodesG2d(arr);
  };

  const onHorizontalAlignNodes = () => {
    const referenceNode = selectedNodes[0];
    const toUpdate = nodes.filter((n) => nodesIdsSelected.includes(n.id));

    toUpdate.forEach((n) => {
      n.locationz = referenceNode.attrs.y;
    });

    setNodesG2d(buildNodes(nodes, true));

    toUpdate.forEach((n) => {
      onUpdatePosition(n.id, { x: n.locationx, y: n.locationz });
    });
  };

  const onVerticalAlignNodes = () => {
    const referenceNode = selectedNodes[0];
    const toUpdate = nodes.filter((n) => nodesIdsSelected.includes(n.id));

    toUpdate.forEach((n) => {
      n.locationx = referenceNode.attrs.x;
    });

    setNodesG2d(buildNodes(nodes, true));

    toUpdate.forEach((n) => {
      onUpdatePosition(n.id, { x: n.locationx, y: n.locationz });
    });
  };

  const createNodeList = (objList) => {
    const list = [];

    objList.forEach((node) => {
      switch (node.props.type) {
        case "G2dBaseNode":
          const parts = node.props.module.parts;
          parts.forEach((part) => {
            const ret = {
              id: part.id,
              name: part.name,
            };
            list.push(ret);
          });
          break;

        case "G2dNode":
        case "G2dIntermediateNode":
          list.push({
            id: node.props.node.id,
            name: node.props.node.name,
          });
          break;

        default:
          const ret = {
            id: node.props.node.id,
            name: node.props.node.name,
          };
          list.push(ret);
          break;
      }
    });

    return list;
  };

  const createConnList = (objList) => {
    const list = [];

    objList.forEach((conn) => {
      const userData = conn.props.userData;
      const obj = createConnectorMetaData(conn.props.id, userData.originId, userData.targetId);
      list.push(obj);
    });

    return list;
  };

  const createNodes = () => {
    let stNode = [];
    const dNode = [];

    const ref = stageRef.current;
    const staticNodesLayer = staticNodeLayerRef.current;
    const nodesLayer = nodeLayerRef.current;

    const staticNodesList = createNodeList(staticNodesG2d);
    const nodesList = createNodeList(nodesG2d);

    staticNodesList.forEach((b) => {
      const node = findNodeById(staticNodesLayer, b.id);
      if (node) {
        const position = node.getAbsolutePosition(ref);
        const obj = {
          id: node.attrs.id,
          name: node.attrs.name,
          locationx: position.x,
          locationy: 0,
          locationz: position.y,
        };

        stNode.push(obj);
      }
    });

    nodesList.forEach((b) => {
      const node = findNodeById(nodesLayer, b.id);
      if (node) {
        const position = node.getAbsolutePosition(ref);
        const obj = {
          id: node.attrs.id,
          name: node.attrs.name,
          locationx: position.x,
          locationy: 0,
          locationz: position.y,
        };

        dNode.push(obj);
      }
    });

    const ret = stNode.concat(dNode);
    return ret;
  };

  const createConnectorMetaData = (id, originId, targetId) => {
    const ret = {
      id: id,
      rotx: 0,
      roty: 0,
      rotz: 0,
      distance: 0,
      originNodeId: originId,
      targetNodeId: targetId,
    };
    return ret;
  };

  const createEdges = () => {
    const staticConnList = createConnList(staticConnectorsG2d);
    const connList = createConnList(connectorsG2d);
    const ret = staticConnList.concat(connList);
    return ret;
  };

  const buildFloorGraph = () => {
    const nodes = createNodes();
    const edges = createEdges();
    const graph = {
      description: graphName,
      state: 0,
      initialNodeId: null,
      nodes: nodes,
      edges: edges,
    };
    return graph;
  };

  const onLocalSave = async () => {
    showNotification({
      id: "savingData-notification",
      disallowClose: true,
      title: t("message.savingData"),
      message: t("message.savingDataSub"),
      loading: true,
    });

    const graph = buildFloorGraph();
    // console.log("onLocalSave -> ", graph);
    try {
      await onSave(graph);
      // console.log("onLocalSave <- ", graph);
      hideNotification("savingData-notification");
      refresh();
    } catch (error) {
      console.log(error);
      showNotification({
        id: "savingData-error",
        disallowClose: true,
        title: t("message.error"),
        message: error,
        loading: true,
      });
    }
  };

  const onEditNodes = (e) => {
    const list = [];
    const newConns = [];
    const connIdsToRemove = [];
    const color = "cyan";
    const ref = stageRef.current;
    const staticNodesLayer = staticNodeLayerRef.current;
    const staticConnectorsLayer = staticConnectorsLayerRef.current;

    selectedNodes.forEach((node) => {
      const userData = node.attrs.userData;

      const nodeFound = findNodeById(staticNodesLayer, userData.id);

      if (nodeFound) {
        const position = nodeFound.getAbsolutePosition(ref);

        node.destroy();
        const newNode = {
          id: userData.id,
          locationx: position.x,
          locationz: position.y,
          width: NODE_RADIO,
          height: NODE_RADIO,
          color: color,
          name: userData.name,
          draggable: true,
          connectors: userData.connectors ? [...userData.connectors] : [],
          inboundConnectors: [],
          outboundConnectors: [],
          linked: false,
          onDblClick: onDblClickNode,
        };

        list.push(newNode);

        const connectors = staticConnectorsLayer.find((c) => {
          return c.attrs.userData.originId === userData.id || c.attrs.userData.targetId === userData.id;
        });

        connectors.forEach((c) => {
          const id = uuid();
          const points = c.attrs.points;
          const component = (
            <G2dConnector
              origin={{ x: points[0], y: points[1] }}
              target={{ x: points[2], y: points[3] }}
              name={c.attrs.name}
              key={id}
              id={id}
              userData={c.attrs.userData}
              bidirectional={c.attrs.userData.bidirectional}
              type={"G2dConnector"}
            />
          );

          c.remove();
          c.destroy();
          newConns.push(component);
          connIdsToRemove.push(c.attrs.name);
        });
      }
    });

    setNodes([...nodes, ...list]);
    setConnectorsG2d([...connectorsG2d, ...newConns]);

    const filterstaticConnectorsG2d = staticConnectorsG2d.filter((c) => {
      const ret = connIdsToRemove.includes(c.props.name);
      return(!ret)
    })

    setStaticConnectorsG2d(filterstaticConnectorsG2d);

    staticNodeLayerRef.current.cache({ pixelRatio: 3 });
    staticConnectorsLayerRef.current.cache({ pixelRatio: 3 });

    onEmptySelection();
  };

  return (
    <Stack>
      <Toolbar>
        <Group spacing={"xs"} position="apart" w={"100%"}>
          <Group spacing={"xs"}>
            <Group spacing={"xs"}>
              <ActionIcon disabled={graphName ? false : true} color={"blue"} variant="filled" onClick={onLocalSave}>
                <IconDeviceFloppy size={20} />
              </ActionIcon>
            </Group>

            <SettingsMenu
              name={graphName}
              setName={setGraphName}
              elementGroup={elementGroup}
              setElementGroup={setElementGroup}
              direction={direction}
              setDirection={setDirection}
              rackOrientation={rackOrientation}
              setRackOrientation={setRackOrientation}
            />
            <Button
              leftIcon={<IconCirclePlus size={20} />}
              size="xs"
              onClick={onCreateBaseNodes}
              disabled={selectedRacks && selectedRacks.length === 0}
            >
              <Text>{t("crud.floorGrapthEditor.label.createBaseNodes")}</Text>
            </Button>

            <Button
              leftIcon={<IconArrowRightSquare size={20} />}
              size="xs"
              onClick={onLinkStructures}
              disabled={isLinkRacksDisabled()}
            >
              <Text>{t("crud.floorGrapthEditor.label.linkStructures")}</Text>
            </Button>

            <Button
              leftIcon={<IconArrowRightCircle size={20} />}
              size="xs"
              onClick={onLinkNodes}
              disabled={selectedNodes && selectedNodes.length <= 1}
            >
              <Text>{t("crud.floorGrapthEditor.label.linkNodes")}</Text>
            </Button>

            <Group spacing={"xs"}>
              <Text size={"xs"}>{t("crud.floorGrapthEditor.label.addNode")}</Text>
              <Switch
                size="md"
                checked={activeAddNode}
                onChange={(event) => {
                  setActiveAddNode(event.currentTarget.checked);
                }}
                onLabel={<IconClick size={16} />}
                offLabel={<IconClick size={16} />}
              />
            </Group>

            <Group spacing={"xs"}>
              <ActionIcon
                disabled={selectedNodes && selectedNodes.length <= 1}
                color={"blue"}
                variant="filled"
                onClick={onVerticalAlignNodes}
              >
                <IconLayoutAlignMiddle size={20} />
              </ActionIcon>
              <ActionIcon
                disabled={selectedNodes && selectedNodes.length <= 1}
                color={"blue"}
                variant="filled"
                onClick={onHorizontalAlignNodes}
              >
                <IconLayoutAlignCenter size={20} />
              </ActionIcon>

              <ActionIcon
                disabled={selectedNodes && selectedNodes.length === 0}
                color={"blue"}
                variant="filled"
                onClick={onEditNodes}
              >
                <IconEdit size={20} />
              </ActionIcon>
            </Group>
          </Group>
          <Group spacing={"xs"}>
            <ActionIcon
              color={"blue"}
              variant="filled"
              onClick={() => {
                initilizeContext();
                navigate(-1);
              }}
            >
              <IconArrowBack size={20} />
            </ActionIcon>
          </Group>
        </Group>
      </Toolbar>
      <Stage
        ref={stageRef}
        width={width ? width : 0}
        height={height ? height - TOOLBAR_HIGHT : 0}
        draggable={!isTouchEnabled()}
        onWheel={zoomStage}
        onTouchMove={handleTouch}
        onTouchEnd={handleTouchEnd}
        onMouseDown={onEmptySelection}
        onTap={onEmptySelection}
        onContextMenu={(event) => {
          event.evt.preventDefault();
        }}
        onClick={addNodeOnPoint}
      >
        <Layer ref={baseLayerRef} name="base-layer">
          {layoutG2d}
          {racksG2d}
          {markersG2d}
        </Layer>

        <Layer ref={nodeLayerRef} name="node-layer">
          {nodesG2d}
        </Layer>

        <Layer ref={staticNodeLayerRef} name="staticNode-layer">
          {staticNodesG2d}
        </Layer>

        <Layer ref={staticConnectorsLayerRef} name="staticConnectors-layer">
          {staticConnectorsG2d}
        </Layer>

        <Layer ref={connectorsLayerRef} name="connectors-layer">
          {connectorsG2d}
        </Layer>

        <Layer ref={selLayerRef} name="sel-layer"></Layer>
      </Stage>

      <NodePropertiesModal
        opened={openNodeProperties}
        close={() => {
          setOpenNodeProperties(false);
        }}
        node={selectedNode}
        setSelectedNode={setSelectedNode}
      />

      <DeleteConfirmation
        opened={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={onConfirm}
        title={t("notification.title")}
        text={t("notification.delete")}
      />
    </Stack>
  );
}

export default Editor2d;
