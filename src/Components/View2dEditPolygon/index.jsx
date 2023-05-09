import { Container } from "@mantine/core";
import { useEffect, useRef } from "react";
import { Stage } from "react-konva";
import { buildEditableLayout, buildSelectionLayer } from "../Builder2d";

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

function View2dEditPolygon({
  dimensions,
  centred = true,
  centerYOffsset = 0,
  width = 800,
  height = 600,
  pixelMeterRelation,
  layouts,
  racks = [],
}) {
  const stageRef = useRef(null);

  let lastCenter = null;
  let lastDist = 0;

  const onSelect = (attrs) => {
    console.log("onSelect ", attrs);

    if (attrs.id !== "editPoint") {
      //setTargetAttrs(attrs);
    } else {
    }
  };

  useEffect(() => {
    const ref = stageRef.current;

    if (layouts && racks && pixelMeterRelation) {
      ref.destroyChildren();
      buildEditableLayout(ref, pixelMeterRelation, layouts[0], onSelect);
      buildSelectionLayer(ref);
      console.log("########### View2dEditPolygon - buildLayout ###########");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layouts, pixelMeterRelation, racks]);

  useEffect(() => {
    const stage = stageRef.current;

    if (centred) {
      /*CLEAR LAYERS*/
      stage.children?.forEach((element) => {
        element.clear();
      });

      var scale = stage.scaleX();

      stage.scaleX(scale);
      stage.scaleY(scale);
      let px = width;
      let py = height;
      py += centerYOffsset;
      px /= 2.0;
      py /= 2.0;

      var newPos = {
        x: px * scale,
        y: py * scale,
      };

      stage.position(newPos);
      stage.batchDraw();
    }

    console.log("########### View2dEditPolygon - centred ###########");
  }, [centerYOffsset, centred, dimensions, height, width]);

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
    <Container fluid px={0}>
      <Stage
        width={width}
        height={height}
        draggable={!isTouchEnabled()}
        onWheel={zoomStage}
        onTouchMove={handleTouch}
        onTouchEnd={handleTouchEnd}
        ref={stageRef}
        onContextMenu={(e) => {
          e.evt.preventDefault();
        }}
      ></Stage>
    </Container>
  );
}

export default View2dEditPolygon;
