import Konva from "konva";
import { PIXEL_METER_RELATION } from "../../Constants";
import { getModulePartColor, getModulePartStrokeColor, getPartSelectedColor } from "../../Util";

function buildPolygon(pixelMeterRelation, geometry, fill, stroke) {
  let polygon = null;
  let points = geometry.points;
  let pp = [];

  if (points) {
    points.forEach((p) => {
      pp.push(p.positionx * pixelMeterRelation);
      pp.push(p.positiony * pixelMeterRelation);
    });
  }

  polygon = new Konva.Line({ points: pp, stroke: stroke, fill: fill, strokeWidth: 1, closed: true });
  return polygon;
}

function buildEditablePolygon(pixelMeterRelation, geometry, fill, stroke) {
  let polygon = null;
  let points = geometry.points;

  const group = new Konva.Group();

  if (points) {
    points.forEach((p) => {
      polygon = new Konva.Circle({
        id: "editPoint",
        x: p.positionx * pixelMeterRelation,
        y: p.positiony * pixelMeterRelation,
        fill: "#0000ff",
        radius: 5,
        draggable: true,
      });

      group.add(polygon);
    });
  }

  return group;
}

function buildEditablePart(pixelMeterRelation, part) {
  let grPart = null;
  let polygon = null;
  let editPoints = null;

  grPart = new Konva.Group({
    id: part.id,
    x: part.positionx * PIXEL_METER_RELATION,
    y: part.positionz * PIXEL_METER_RELATION,
    rotation: part.rotationy,
    name: part.name,
  });
  polygon = buildPolygon(pixelMeterRelation, part.geometries[0], part.color, part.borderColor);
  editPoints = buildEditablePolygon(pixelMeterRelation, part.geometries[0], part.color, part.borderColor);

  grPart.add(polygon);
  grPart.add(editPoints);
  return grPart;
}

function buildPart(pixelMeterRelation, part) {
  let grPart = null;
  let polygon = null;

  grPart = new Konva.Group({
    id: part.id,
    x: part.positionx * PIXEL_METER_RELATION,
    y: part.positionz * PIXEL_METER_RELATION,
    rotation: part.rotationy,
    name: part.name,
  });
  polygon = buildPolygon(pixelMeterRelation, part.geometries[0], part.color, part.borderColor);

  grPart.add(polygon);
  return grPart;
}

function buildLayout(stageRef, pixelMeterRelation, layout, cache = false) {
  let layer = null;
  let part;
  const parts = layout.parts;

  if (parts.length > 0) {
    layer = new Konva.Layer({ id: layout.id });

    for (let index = 0; index < parts.length; index++) {
      part = buildPart(pixelMeterRelation, parts[index]);
      layer.add(part);
    }

    if (cache) {
      layer.cache();
    }

    stageRef.add(layer);
  }
}

function buildEditableLayout(stageRef, pixelMeterRelation, layout, onSelect) {
  let layer = null;
  let part;
  const parts = layout.parts;

  layer = new Konva.Layer({ id: layout.id });

  for (let index = 0; index < parts.length; index++) {
    part = buildEditablePart(pixelMeterRelation, parts[index]);
    layer.add(part);
  }

  stageRef.on("mousedown touchstart", (e) => {
    const stage = e.currentTarget;
    const target = e.target;
    const group = target.getParent();

    if (target !== stage) {
      onSelect(group.attrs);
    } else {
      onSelect(null);
    }
  });

  stageRef.add(layer);
}

function buildModule(grModule, parts, number) {
  let grPart = null;
  let modulePart = null;

  for (let index = 0; index < parts.length; index++) {
    modulePart = parts[index];

    grPart = new Konva.Rect({
      id: modulePart.id,
      x: (modulePart.positionx - modulePart.dimensionx / 2.0) * PIXEL_METER_RELATION,
      y: (modulePart.positionz - modulePart.dimensionz / 2.0) * PIXEL_METER_RELATION,
      width: modulePart.dimensionx * PIXEL_METER_RELATION,
      height: modulePart.dimensionz * PIXEL_METER_RELATION,
      rotation: modulePart.rotationy,
      name: "M" + number.toString().padStart(2, "0"),
      stroke: getModulePartStrokeColor(modulePart.type),
      fill: getModulePartColor(modulePart),
      perfectDrawEnabled: true,
    });

    grModule.add(grPart);
  }
}

function buildActorModules(grActor, modules) {
  let module = null;
  let grModule = null;

  for (let index = 0; index < modules.length; index++) {
    module = modules[index];

    grModule = new Konva.Group({
      x: module.positionx * PIXEL_METER_RELATION,
      y: module.positionz * PIXEL_METER_RELATION,
      name: "moduleGroup",
      width: module.dimensionx * PIXEL_METER_RELATION,
      height: module.dimensionz * PIXEL_METER_RELATION,
      rotation: -module.rotationy,
    });

    buildModule(grModule, module.parts, module.number);

    grActor.add(grModule);
  }
}

function buildActorFrames(grActor, frames) {
  let frame = null;
  let grFrame = null;

  for (let index = 0; index < frames.length; index++) {
    frame = frames[index];

    grFrame = new Konva.Rect({
      id: frame.id,
      x: (frame.positionx - frame.dimensionx / 2.0) * PIXEL_METER_RELATION,
      y: (frame.positionz - frame.dimensionz / 2.0) * PIXEL_METER_RELATION,
      width: frame.dimensionx * PIXEL_METER_RELATION,
      height: frame.dimensionz * PIXEL_METER_RELATION,
      rotation: frame.rotationy,
      name: frame.name,
      stroke: getModulePartStrokeColor(frame.type),
      fill: getModulePartColor(frame),
      strokeWidth: 0.2,
      listening: false,
      perfectDrawEnabled: true,
    });

    grActor.add(grFrame);
  }
}

function buildActorBase(grActor, actor, fill = null) {
  const grBase = new Konva.Rect({
    id: actor.id,
    name: actor.name,
    x: (-actor.dimensionx / 2.0) * PIXEL_METER_RELATION,
    y: (-actor.dimensionz / 2.0) * PIXEL_METER_RELATION,
    width: actor.dimensionx * PIXEL_METER_RELATION,
    height: actor.dimensionz * PIXEL_METER_RELATION,
    perfectDrawEnabled: true,
    fill: fill,
  });

  grActor.add(grBase);
}

function buildActor(pixelMeterRelation, actor, onDblClick) {
  let grActor = null;

  grActor = new Konva.Group({
    id: actor.id,
    x: actor.positionx * pixelMeterRelation,
    y: actor.positionz * pixelMeterRelation,
    name: actor.name,
    width: actor.dimensionx * pixelMeterRelation,
    height: actor.dimensionz * pixelMeterRelation,
    rotation: -actor.rotationy,
  });

  grActor.on("dblclick dbltap", onDblClick);

  buildActorModules(grActor, actor.modules);
  buildActorFrames(grActor, actor.frames);
  buildActorBase(grActor, actor);

  return grActor;
}

function buildActors(stageRef, actors, cache = false, onSelect = null, onDblClick = null) {
  let layer = null;
  let actor = null;

  layer = new Konva.Layer({ id: "actors" });
  layer.on("mousedown touchstart", onSelect);

  for (let index = 0; index < actors.length; index++) {
    actor = buildActor(PIXEL_METER_RELATION, actors[index], onDblClick);
    layer.add(actor);
  }

  if (cache) {
    layer.cache({ pixelRatio: 3 });
  }
  stageRef.add(layer);

  return layer;
}

function transformerActor(stageRef, obj) {
  const objects = stageRef.find("#transformer-obj");

  if (objects) {
    const transformer = objects[0];
    transformer.nodes(obj.children);
  }
}

function clearSelection(stageRef) {
  const layers = stageRef.find("#selection-layer");

  // console.log("#################### clearSelection()", layers);

  if (layers) {
    const layer = layers[0];
    layer.removeChildren();
  }
}

function selectObjectWithId(stageRef, obj) {
  const layers = stageRef.find("#selection-layer");

  if (layers) {
    const layer = layers[0];

    layer.removeChildren();

    const group = obj.getParent().clone();

    /*MARCO*/
    const selector = new Konva.Rect({
      x: obj.x(),
      y: obj.y(),
      width: obj.width(),
      height: obj.height(),
      stroke: getPartSelectedColor(),
      strokeWidth: 2,
    });

    /*CARTEL*/
    const label = new Konva.Label({ x: 0, y: 0 });
    label.rotation(-group.rotation());
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
      text: group.name(),
      align: "center",
    });

    label.add(tag, text);
    group.add(selector, label);

    layer.add(group);
  }
}

function buildSelectionLayer(stageRef) {
  const selectionLayer = new Konva.Layer({ id: "selection-layer" });
  stageRef.add(selectionLayer);
}

function buildRelocatableActors(stageRef, actors, onSelect, dragend, transformend) {
  let actor;

  const layer = new Konva.Layer({ id: "actors" });

  for (let index = 0; index < actors.length; index++) {
    actor = buildRelocatableActor(stageRef, PIXEL_METER_RELATION, actors[index], onSelect);
    layer.add(actor);
  }

  const trasformer = new Konva.Transformer({
    id: "transformer-obj",
    resizeEnabled: false,
    rotateEnabled: true,
    rotationSnaps: [0, 90, 180, 270],
    borderStrokeWidth: 2,
    borderStroke: "#ff0000",
    shouldOverdrawWholeArea: false,
  });

  trasformer.on("dragend", dragend);
  trasformer.on("transformend", transformend);
  
  layer.add(trasformer);
  stageRef.add(layer);

  return layer;
}

function buildRelocatableActor(stageRef, pixelMeterRelation, actor, onSelect) {
  let grActor = null;

  grActor = new Konva.Group({
    id: actor.id,
    x: actor.positionx * pixelMeterRelation,
    y: actor.positionz * pixelMeterRelation,
    name: actor.name,
    width: actor.dimensionx * pixelMeterRelation,
    height: actor.dimensionz * pixelMeterRelation,
    rotation: -actor.rotationy,
  });

  // buildActorModules(grActor, actor.modules);
  buildActorBase(grActor, actor, "#c5c5c5");
  buildActorFrames(grActor, actor.frames);

  grActor.cache({ pixelRatio: 3 });

  grActor.on("mousedown touchstart", (e) => {
    const objects = stageRef.find("#transformer-obj");

    if (objects) {
      const target = e.target;
      const group = target.getParent();
      //group.draggable(isLockStage());
      const transformer = objects[0];
      transformer.nodes([group]);

      onSelect(actor.id);
    }
  });

  return grActor;
}

function setDraggableGroups(stageRef, layerNname, state) {
  const layers = stageRef.find("#" + layerNname);
  if (layers !== null && layers.length > 0) {
    const layer = layers[0];

    const groups = layer.children;

    groups.forEach((element) => {
      element.draggable(state);
    });
  }
}

function selectPolygon(stageRef, id, pixelMeterRelation) {
  const groups = stageRef.find("#" + id);
  if (groups !== null && groups.length > 0) {
    const group = groups[0];

    const line = group.children[0];
    line.stroke("#ff0000");
    line.strokeWidth(1);

    // const layer = stageRef.find("#selection-layer")[0];
    // line.attrs.points.forEach((p, index) => {
    //   const c = new Konva.Circle({
    //     id: index,
    //     x: p.x * pixelMeterRelation,
    //     y: p.y * pixelMeterRelation,
    //     radius: 5,
    //     fill: "#0000ff",
    //   });
    //   layer.add(c);
    // });

    //console.log("selectPolygon() -> ", edit, layer);
  }
}

function buildMarker(stageRef, pixelMeterRelation, marker, onSelect, onDblClick) {
  let grMarker = null;

  grMarker = new Konva.Group({
    id: marker.id,
    x: marker.positionx * pixelMeterRelation,
    y: marker.positionz * pixelMeterRelation,
    rotation: -marker.rotationy,
    draggable: marker.draggable,
  });

  grMarker.on("dblclick dbltap", (e) => {
    onDblClick(e, marker.id);
  });

  grMarker.on("mousedown touchstart", (e) => {
    const objects = stageRef.find("#transformer-obj");

    if (objects.length > 0) {
      const target = e.target;
      const group = target.getParent();
      const transformer = objects[0];
      transformer.nodes([group]);

      onSelect(marker.id);
    }
  });

  const text = new Konva.Text({
    text: marker.text,
    fontSize: marker.fontSize,
    fontFamily: marker.fontFamily,
    fill: marker.stroke,
    stroke: marker.stroke,
    strokeWidth: 0.5,
  });

  grMarker.add(text);
  return grMarker;
}

function buildMarkers(stageRef, markers, cache = false, onSelect = null, onDblClick = null) {
  let layer = null;
  let actor = null;

  const objects = stageRef.find("#markers-layer");

  if (objects) {
    layer = objects[0];
  }

  if (layer === undefined) {
    layer = new Konva.Layer({ id: "markers-layer" });

    if (cache) {
      layer.cache({ pixelRatio: 3 });
    }
    stageRef.add(layer);
  } else {
    layer.removeChildren();
  }

  for (let index = 0; index < markers.length; index++) {
    actor = buildMarker(stageRef, 1, markers[index], onSelect, onDblClick);
    layer.add(actor);
  }

  return layer;
}

export {
  buildLayout,
  buildActors,
  selectObjectWithId,
  buildSelectionLayer,
  buildRelocatableActors,
  transformerActor,
  setDraggableGroups,
  buildEditableLayout,
  selectPolygon,
  buildMarkers,
  clearSelection,
};
