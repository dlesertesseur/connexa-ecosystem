import { Container, Menu } from "@mantine/core";
import { useCallback, useEffect, useRef, useState } from "react";
import { Stage } from "react-konva";
import {
  buildActors,
  buildLayout,
  buildMarkers,
  buildRelocatableActors,
  buildSelectionLayer,
  selectObjectWithId,
  setDraggableGroups,
} from "../Builder2d";

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

function View2dEditActors({
  dimensions,
  centred = true,
  centerYOffsset = 0,
  width = 800,
  height = 600,
  pixelMeterRelation,
  layouts,
  racks,
  onSelect,
  onDblClick,
  updateAttrs,
  enableActorRelocation = false,
  isLockStage,
  stageContextMenu,
  setClickContextMenuPosition,
  markers,
}) {
  const stageRef = useRef(null);
  const [openMenu, setOpenMenu] = useState(false);
  let lastCenter = null;
  let lastDist = 0;

  const onLocalSelection = useCallback(
    (evt) => {
      const ref = stageRef.current;
      const obj = evt.target;
      const group = obj.getParent();
      selectObjectWithId(ref, obj);

      onSelect(group.id());
    },
    [onSelect]
  );

  const onLocalDblClick = useCallback(
    (evt) => {
      const obj = evt.target;
      const group = obj.getParent();
      onDblClick(evt, group.id());
    },
    [onDblClick]
  );

  const localDragend = (e) => {
    const tranform = e.target;
    const group = tranform.nodes()[0];
    updateAttrs(group.attrs);
  };

  const localTransformend = (e) => {
    const tranform = e.currentTarget;
    const group = tranform.nodes()[0];
    updateAttrs(group.attrs);
  };

  useEffect(() => {
    const ref = stageRef.current;

    ref.batchDraw();

    if (layouts && racks && pixelMeterRelation) {
      ref.destroyChildren();

      buildLayout(ref, pixelMeterRelation, layouts[0], true);

      if (!enableActorRelocation) {
        buildActors(ref, racks, true, onLocalSelection, onLocalDblClick);
      } else {
        buildRelocatableActors(ref, racks, onSelect, localDragend, localTransformend);
      }

      buildSelectionLayer(ref);

      console.log("########### buildActors ###########");
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

    console.log("########### centred ###########");
  }, [centerYOffsset, centred, dimensions, height, width]);

  useEffect(() => {
    const stage = stageRef.current;
    setDraggableGroups(stage, "actors", isLockStage);
    setDraggableGroups(stage, "markers-layer", isLockStage);
  }, [isLockStage]);

  useEffect(() => {
    const stage = stageRef.current;
    if (markers) {
      buildMarkers(stage, markers, false, onSelect, onDblClick);
      console.log("########### buildMarkers ###########");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markers]);

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

  // const processAction = (state) => {
  //   if(handleDragging){
  //     handleDragging(state);
  //   }
  // };

  function handleTouchEnd() {
    lastCenter = null;
    lastDist = 0;
  }

  function handleSelect(e) {
    setOpenMenu(false);

    if (racks || markers) {
      if (stageRef.current === e.target) {
        const objects = stageRef.current.find("#transformer-obj");

        onSelect(null);

        if (objects.length > 0) {
          const transformer = objects[0];
          transformer.nodes([]);
        }
      }
    }
  }

  const screenToDevice = (e) => {
    const stage = stageRef.current;
    var transform = stage.getAbsoluteTransform().copy();
    transform.invert();
    const pos = e.target.getStage().getPointerPosition();
    const clickPos = transform.point(pos);

    return clickPos;
  };

  const contextMenu = (e) => {
    const stage = stageRef.current;
    console.log("### CONTEXT MENU ####");

    e.evt.preventDefault();
    if (layouts?.length > 0) {
      if (e.target !== stage) {
        return;
      } else {
        if (setClickContextMenuPosition) {
          setClickContextMenuPosition(screenToDevice(e));
          var menuNode = document.getElementById("stage-context-menu");
          var containerRect = stage.container().getBoundingClientRect();
          menuNode.style.display = "initial";
          menuNode.style.top = containerRect.top + stage.getPointerPosition().y + "px";
          menuNode.style.left = containerRect.left + stage.getPointerPosition().x + "px";
          menuNode.style.visibility = "visible";
          setOpenMenu(true);
        }
      }
    }
  };

  return (
    <>
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
            contextMenu(e);
          }}
          onMouseDown={handleSelect}
          onTap={handleSelect}
        ></Stage>
      </Container>

      <div
        id={"stage-context-menu"}
        style={{
          position: "absolute",
          visibility: "hidden",
        }}
      >
        {stageContextMenu ? (
          <Menu shadow="md" width={200} opened={openMenu} onChange={setOpenMenu}>
            {stageContextMenu()}
          </Menu>
        ) : null}
      </div>
    </>
  );
}

export default View2dEditActors;
