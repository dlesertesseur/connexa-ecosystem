import { Button, Center, Group, NumberInput, SegmentedControl, Stack, Switch, Text } from "@mantine/core";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import { Layer, Stage } from "react-konva";
import {
  CONNECTOR_ONE_WAY,
  CONNECTOR_TWO_WAY,
  NODE_RADIO,
  RACK_ORIENTATION_X,
  RACK_ORIENTATION_Y,
  TOOLBAR_HIGHT,
} from "../../../../../Constants";
import { useTranslation } from "react-i18next";
import { IconArrowNarrowRight, IconArrowsHorizontal, IconAxisX, IconAxisY } from "@tabler/icons-react";
import G2dPolygon from "./models/G2dPolygon";
import G2dRack from "./models/G2dRack";
import G2dMarker from "./models/G2dMarker";
import G2dNode from "./models/G2dNode";
import G2dBaseNode from "./models/G2dBaseNode";
import G2dConnector from "./models/G2dConnector";
import uuid from "react-uuid";
import Toolbar from "../Toolbar";

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

function Editor2d({
  width,
  height,
  layouts,
  racks,
  markers,
  nodes,
  setNodes,
  staticNodes,
  setStaticNodes,
  connectors,
  setConnectors,
  pixelMeterRelation,
  multiSelect = true,
}) {
  const { t } = useTranslation();

  const stageRef = useRef(null);
  const baseLayerRef = useRef(null);
  const nodeLayerRef = useRef(null);
  const staticNodeLayerRef = useRef(null);
  const connectorsLayerRef = useRef(null);
  const selLayerRef = useRef(null);

  let lastCenter = null;
  let lastDist = 0;

  const [layoutG2d, setLayoutG2d] = useState(null);
  const [racksG2d, setRacksG2d] = useState(null);
  const [markersG2d, setMarkersG2d] = useState(null);
  const [staticNodesG2d, setStaticNodesG2d] = useState(null);
  const [nodesG2d, setNodesG2d] = useState(null);
  const [connectorsG2d, setConnectorsG2d] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedRack, setSelectedRack] = useState(null);

  const [selectedRacks, setSelectedRacks] = useState([]);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [elementGroup, setElementGroup] = useState(2);
  const [direction, setDirection] = useState(CONNECTOR_TWO_WAY);
  const [rackOrientation, setRackOrientation] = useState(RACK_ORIENTATION_Y);
  const [activeAddNode, setActiveAddNode] = useState(false);
  const [nodesIdsSelected, setNodesIdsSelected] = useState([]);
  const [updatedNode, setUpdatedNode] = useState(null);

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
    // setUpdatedNode(position);
  }

  const buildNodes = (nodes) => {
    const list = [];

    nodes.forEach((node) => {
      const component = (
        <G2dNode
          key={node.id}
          node={node}
          selected={nodesIdsSelected.includes(node.id)}
          onSelect={onSelectNode}
          onUpdatePosition={onUpdatePosition}
        />
      );
      list.push(component);
    });

    return list;
  };

  const buildConnectors = (nodes) => {
    const list = [];
    const ref = stageRef.current;
    const staticNodesLayer = staticNodeLayerRef.current;
    let prevNode = null;

    nodes.forEach((node) => {
      node.connectors.forEach((connector) => {
        const target = staticNodesLayer.find(`.${connector}`);
        if (target && target.length > 0) {
          const targetPos = target[0].getAbsolutePosition(ref);
          const component = (
            <G2dConnector
              origin={{ x: node.positionx, y: node.positionz }}
              target={targetPos}
              key={uuid()}
              bidirectional={direction === CONNECTOR_TWO_WAY ? true : false}
            />
          );
          list.push(component);
        }
      });

      if (node.linked) {
        if (prevNode) {
          const component = (
            <G2dConnector
              origin={{ x: prevNode.positionx, y: prevNode.positionz }}
              target={{ x: node.positionx, y: node.positionz }}
              key={uuid()}
              bidirectional={direction === CONNECTOR_TWO_WAY ? true : false}
            />
          );
          list.push(component);
        }
      }

      prevNode = node;
    });

    return list;
  };

  const buildNodesFromRacks = (racks) => {
    const list = [];

    racks.forEach((rack) => {
      const modules = rack.modules;
      modules.forEach((module) => {
        const component = (
          <G2dBaseNode key={uuid()} rack={rack} module={module} draggable={false} onSelect={onSelectStaticNode} />
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

    const ref = stageRef.current;
    const node = event.target;

    setSelectedNode(node);

    const position = node.getAbsolutePosition(ref);
    const rotation = node.getAbsoluteRotation();

    const selObj = node.clone();

    selObj.stroke("red");
    selObj.x(position.x);
    selObj.y(position.y);
    selObj.rotation(0);
    selObj.stroke("red");

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

    const ref = stageRef.current;
    const rack = event.target;

    setSelectedRack(rack.attrs.userData);

    const position = rack.getAbsolutePosition(ref);
    const rotation = rack.getAbsoluteRotation();

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

      if (staticNodes === null) {
        const nodesG2d = buildNodesFromRacks(racks);
        setStaticNodesG2d(nodesG2d);
      }
    }
  }, [racks]);

  useEffect(() => {
    if (markers && markers.length > 0) {
      const markersG2d = buildMarkers(markers);
      setMarkersG2d(markersG2d);
    }
  }, [markers]);

  useEffect(() => {
    if (nodes) {
      const nodesG2d = buildNodes(nodes);
      setNodesG2d(nodesG2d);

      // const connectrosG2d = buildConnectors(nodes);
      // setConnectorsG2d(connectrosG2d);
    }
  }, [nodes, selectedNode]);


  useEffect(() => {
    if (nodes) {
      const connectrosG2d = buildConnectors(nodes);
      setConnectorsG2d(connectrosG2d);
    }
  }, [nodes, updatedNode]);

  useEffect(() => {
    if (layoutG2d && racksG2d && markersG2d) {
      baseLayerRef.current.cache({ pixelRatio: 3 });
      console.log("CACHE BASE LAYER");
    }
  }, [layoutG2d && racksG2d && markersG2d]);

  useEffect(() => {
    if (staticNodesG2d) {
      staticNodeLayerRef.current.cache({ pixelRatio: 3 });
      console.log("CACHE STATIC NODE LAYER");
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
    console.log("onLinkNodes");
  };

  const processRackGroup = (racksGroup) => {
    const ref = stageRef.current;
    const layerRef = staticNodeLayerRef.current;

    const newNodes = [];

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
            const node = arr[0];
            const pos = node.getAbsolutePosition(ref);
            p["absPos"] = pos;
            basesRack1.push(p);
          });
        });
        m2.forEach((m) => {
          m.parts.forEach((p) => {
            const arr = layerRef.find(`.${p.name}`);
            const node = arr[0];
            const pos = node.getAbsolutePosition(ref);
            p["absPos"] = pos;
            basesRack2.push(p);
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
            positionx: posx,
            positionz: posy,
            name: `${b1.name} - ${b2.name}`,
            draggable: false,
            connectors: [b1.name, b2.name],
            linked: true,
          };
          newNodes.push(metaData);
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

    setNodes([...nodes, ...arr]);
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
          positionx: clickPos.x,
          positionz: clickPos.y,
          width: NODE_RADIO,
          height: NODE_RADIO,
          color: color,
          name: "NODE-" + id,
          draggable: true,
          connectors: [],
          linked: false,
        };

        setNodes([...nodes, node]);
      }
    }
  };

  return (
    <Stack>
      <Toolbar>
        <Group>
          <Button size="xs" onClick={onLinkStructures} disabled={isLinkRacksDisabled()}>
            <Text>{t("crud.floorGrapthEditor.label.linkStructures")}</Text>
          </Button>
          <Button size="xs" onClick={onLinkNodes} disabled={isLinkNodesDisabled()}>
            <Text>{t("crud.floorGrapthEditor.label.linkNodes")}</Text>
          </Button>
          <Group spacing={"xs"}>
            <Text size={"xs"}>{t("crud.floorGrapthEditor.label.group")}</Text>
            <NumberInput
              defaultValue={2}
              size="xs"
              step={1}
              min={1}
              w={60}
              value={elementGroup}
              onChange={setElementGroup}
            />
          </Group>

          <SegmentedControl
            value={direction}
            onChange={setDirection}
            size="xs"
            data={[
              {
                value: CONNECTOR_TWO_WAY,
                label: (
                  <Center>
                    <IconArrowsHorizontal size={20} />
                  </Center>
                ),
              },
              {
                value: CONNECTOR_ONE_WAY,
                label: (
                  <Center>
                    <IconArrowNarrowRight size={20} />
                  </Center>
                ),
              },
            ]}
          />

          <Group spacing={2}>
            <Text size={"xs"}>{t("crud.floorGrapthEditor.label.rackOrientation")}</Text>
            <SegmentedControl
              value={rackOrientation}
              onChange={setRackOrientation}
              size="xs"
              data={[
                {
                  value: RACK_ORIENTATION_X,
                  label: (
                    <Center>
                      <IconAxisX size={20} />
                    </Center>
                  ),
                },
                {
                  value: RACK_ORIENTATION_Y,
                  label: (
                    <Center>
                      <IconAxisY size={20} />
                    </Center>
                  ),
                },
              ]}
            />
          </Group>

          <Group spacing={"xs"}>
            <Text size={"xs"}>{t("crud.floorGrapthEditor.label.addNode")}</Text>
            <Switch checked={activeAddNode} onChange={(event) => setActiveAddNode(event.currentTarget.checked)} />
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

        <Layer ref={connectorsLayerRef} name="connecttrs-layer">
          {connectorsG2d}
        </Layer>

        <Layer ref={selLayerRef} name="sel-layer" />
      </Stage>
    </Stack>
  );
}

export default Editor2d;
