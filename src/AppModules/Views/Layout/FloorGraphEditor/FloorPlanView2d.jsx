import { LoadingOverlay, Stack, Switch } from "@mantine/core";
import { useContext, useEffect, useRef } from "react";
import { Stage } from "react-konva";
import {
  buildActorsAndAnchors,
  buildStaticsGraphNodeLayer,
  buildLayout,
  buildMarkers,
  buildNode,
  buildSelectionLayer,
  clearSelection,
  selectActor,
  showNodes,
  buildDraggableGraphNodeLayer,
  findObjectInLayer,
  findObjectsInLayer,
} from "../../../../Components/Builder2d";
import Toolbar from "./Toolbar";
import { useWindowSize } from "../../../../Hook";
import { HEADER_HIGHT, PIXEL_METER_RELATION, TOOLBAR_HIGHT } from "../../../../Constants";
import { useMediaQuery } from "@mantine/hooks";
import { AbmStateContext } from "./Context";
import { useState } from "react";
import { useSelector } from "react-redux";
import { findLayoutByFloorId, findRacksByZoneId } from "../../../../DataAccess/Surfaces";
import { findAllLayoutMarkersById } from "../../../../DataAccess/LayoutsMarkers";
import { useTranslation } from "react-i18next";
import { useCallback } from "react";

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

function FloorPlanView2d() {
  const stageRef = useRef(null);
  const matches = useMediaQuery("(min-width: 768px)");
  const wSize = useWindowSize();
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const [racks, setRacks] = useState(null);
  const [layouts, setLayouts] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [baseNodes, setBaseNodes] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [partsMap, setPartsMap] = useState(null);
  const [pixelMeterRelation, setPixelMeterRelation] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(null);
  const [loading, setLoading] = useState(false);
  const [addNodeOnClick, setAddNodeOnClick] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const { site, floor } = useContext(AbmStateContext);

  let lastCenter = null;
  let lastDist = 0;

  const onLocalLayerSelection = useCallback((evt) => {
    const ref = stageRef.current;

    clearDraggableNodesSelection(ref);

    const node = findObjectInLayer(ref, "draggableGraphNode-layer", evt);
    if (node) {
      node.children[0].stroke("red");
      node.children[0].strokeWidth(2);
    }
  }, []);

  useEffect(() => {
    const ref = stageRef.current;
    ref.off("mousedown touchstart");
    ref.on("mousedown touchstart", (e) => {
      onLocalSelect(e, addNodeOnClick);
    });
  }, [addNodeOnClick]);

  const addNode = (e) => {
    if (e.target.getStage()) {
      const color = "green";
      const ref = stageRef.current;
      var transform = ref.getAbsoluteTransform().copy();
      transform.invert();
      const pos = e.target.getStage().getPointerPosition();
      let clickPos = transform.point(pos);
      buildNode(ref, onLocalLayerSelection, clickPos, color);
    }
  };

  const clearDraggableNodesSelection = (ref) => {
    const nodes = findObjectsInLayer(ref, "draggableGraphNode-layer");

    if (nodes) {
      nodes.forEach((node) => {
        node.children[0].stroke("green");
        node.children[0].strokeWidth(0);
      });
    }
  };

  const onLocalSelect = useCallback((e, addNodeOnClick) => {
    const ref = stageRef.current;

    if (!e.target.attrs.type && !e.target.attrs.id) {
      clearSelection(ref);
      clearDraggableNodesSelection(ref);
      if (addNodeOnClick) {
        addNode(e);
      }
    }
  }, []);

  const onLocalDblClick = (evt) => {
    const obj = evt.target;
    const group = obj.getParent();
  };

  const getData = async () => {
    const params = {
      token: user.token,
      siteId: site,
      floorId: floor,
      types: "2,10",
    };

    setLoading(true);

    const layouts = await findLayoutByFloorId(params);

    const n = (1.0 / layouts[0].pixelmeterrelation) * PIXEL_METER_RELATION;
    setPixelMeterRelation(n);
    setLayouts(layouts);

    const racks = await findRacksByZoneId(params);
    setRacks(racks);

    const markerts = await findAllLayoutMarkersById(params);
    setMarkers(markerts);

    setDataLoaded(Date.now());
    setLoading(false);
  };

  const onSelectActor = (evt) => {
    const obj = evt.target;
    const ref = stageRef.current;
    selectActor(ref, obj.getParent());
  };

  const buildData = () => {
    const ref = stageRef.current;
    ref.batchDraw();

    ref.off("mousedown touchstart");
    ref.on("mousedown touchstart", (e) => {
      onLocalSelect(e, addNodeOnClick);
    });

    if (layouts && racks && pixelMeterRelation && markers) {
      ref.destroyChildren();

      buildLayout(ref, pixelMeterRelation, layouts[0], true);
      const anchorMap = buildActorsAndAnchors(ref, racks, true, onSelectActor);
      setPartsMap(anchorMap);

      buildStaticsGraphNodeLayer(ref);
      buildDraggableGraphNodeLayer(ref);

      // buildGraphAxisLayer(ref);
      buildSelectionLayer(ref);

      if (markers) {
        buildMarkers(ref, markers);
      }

      const baseNodes = Array.from(anchorMap.values());
      showNodes(ref, baseNodes, "orange", onLocalLayerSelection);
      setBaseNodes(baseNodes);

      console.log("########### buildActors ########### ");
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    buildData();
  }, [dataLoaded]);

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
      <LoadingOverlay visible={loading} overlayBlur={2} />
      <Toolbar>
        <Switch
          label={t("crud.floorGrapthEditor.label.addNode")}
          checked={addNodeOnClick}
          onChange={(event) => setAddNodeOnClick(event.currentTarget.checked)}
        />
      </Toolbar>
      <Stage
        width={wSize.width - (matches ? 316 : 32)}
        height={wSize.height - HEADER_HIGHT - TOOLBAR_HIGHT - 16}
        draggable={!isTouchEnabled()}
        onWheel={zoomStage}
        ref={stageRef}
        onTouchMove={handleTouch}
        onTouchEnd={handleTouchEnd}
      ></Stage>
    </Stack>
  );
}

export default FloorPlanView2d;
