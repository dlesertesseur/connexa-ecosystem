import { Stack } from "@mantine/core";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import { Layer, Stage } from "react-konva";
import G2dPolygon from "./models/G2dPolygon";
import G2dRack from "./models/G2dRack";
import G2dMarker from "./models/G2dMarker";
import G2dNode from "./models/G2dNode";
import G2dBaseNode from "./models/G2dBaseNode";
import uuid from "react-uuid";

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
  staticNodes,
  setStaticNodes,
  connectors,
  pixelMeterRelation,
  multiSelect = true,
}) {
  const stageRef = useRef(null);
  const baseLayerRef = useRef(null);
  const nodeLayerRef = useRef(null);
  const selLayerRef = useRef(null);

  let lastCenter = null;
  let lastDist = 0;

  const [layoutG2d, setLayoutG2d] = useState(null);
  const [racksG2d, setRacksG2d] = useState(null);
  const [markersG2d, setMarkersG2d] = useState(null);
  const [nodesG2d, setNodesG2d] = useState(null);
  const [selectedNode, setSelectedNode] = useState([]);
  const [selectedRack, setSelectedRack] = useState([]);

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
      const component = <G2dRack key={rack.id} rack={rack} onSelect={onSelectRack} onDblClick={onDblClickRack} />;
      list.push(component);
    });

    return list;
  };

  const buildNodes = (nodes) => {
    const list = [];

    nodes.forEach((node) => {
      const component = <G2dNode key={node.id} node={node} draggable={false} />;
      list.push(component);
    });

    return list;
  };

  const buildNodesFromRacks = (racks) => {
    const list = [];

    racks.forEach((rack) => {
      const modules = rack.modules;
      modules.forEach((module) => {
        const component = (
          <G2dBaseNode key={uuid()} rack={rack} module={module} draggable={false} onSelect={onSelectNode} />
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

  const onSelectNode = (event) => {
    event.cancelBubble = true;

    const ref = stageRef.current;
    const node = event.target;

    console.log("onSelectNode node -> ", node.name());

    setSelectedNode([...selectedNode, node]);

    const position = node.getAbsolutePosition(ref);
    const rotation = node.getAbsoluteRotation();
    const selObj = node.clone();

    selObj.x(position.x);
    selObj.y(position.y);
    selObj.rotation(rotation);
    selObj.stroke("red");

    if (!multiSelect) {
      selLayerRef.current.removeChildren();
    }

    selLayerRef.current.add(selObj);
  };

  const onSelectRack = (event) => {
    event.cancelBubble = true;

    const ref = stageRef.current;
    const rack = event.target;

    console.log("onSelectRack rack -> ", rack.name());

    setSelectedRack([...selectedRack, rack]);

    const position = rack.getAbsolutePosition(ref);
    const rotation = rack.getAbsoluteRotation();
    const selObj = rack.clone();

    selObj.x(position.x);
    selObj.y(position.y);
    selObj.rotation(rotation);
    selObj.stroke("red");

    if (!multiSelect) {
      selLayerRef.current.removeChildren();
    }

    selLayerRef.current.add(selObj);
  };

  const onDblClickRack = (evt) => {
    const rack = evt.target;
    console.log("onDblClickRack rack -> ", rack.name());
    // setSelectedRack(rack);
    // rack.fill("red");
  };

  const onEmptySelection = (evt) => {
    const ref = selLayerRef.current;

    setSelectedRack([]);
    setSelectedNode([]);
    
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

      if (nodes === null) {
        const nodesG2d = buildNodesFromRacks(racks);
        setNodesG2d(nodesG2d);
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
    }
  }, [nodes]);

  useEffect(() => {
    if (layoutG2d && racksG2d && markersG2d) {
      baseLayerRef.current.cache({ pixelRatio: 3 });
      console.log("CACHE BASE LAYER");
    }
  }, [layoutG2d && racksG2d && markersG2d]);

  useEffect(() => {
    if (nodesG2d) {
      nodeLayerRef.current.cache({ pixelRatio: 3 });
      console.log("CACHE NODE LAYER");
    }
  }, [nodesG2d]);

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

  return (
    <Stack>
      <Stage
        ref={stageRef}
        width={width ? width : 0}
        height={height ? height : 0}
        draggable={!isTouchEnabled()}
        onWheel={zoomStage}
        onTouchMove={handleTouch}
        onTouchEnd={handleTouchEnd}
        onMouseDown={onEmptySelection}
        onTap={onEmptySelection}
      >
        <Layer ref={baseLayerRef} name="base-layer">
          {layoutG2d}
          {racksG2d}
          {markersG2d}
        </Layer>

        <Layer ref={nodeLayerRef} name="node-layer">
          {nodesG2d}
        </Layer>

        <Layer ref={selLayerRef} name="sel-layer" />
      </Stage>
    </Stack>
  );
}

export default Editor2d;
