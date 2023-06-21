import Konva from "konva";
import { PIXEL_METER_RELATION } from "../../Constants";
import { getModulePartColor, getModulePartStrokeColor, getPartSelectedColor } from "../../Util";
import uuid from "react-uuid";

const radioNode = 16;

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

function buildModule(grModule, parts, number, firtsBaseIndicador = false) {
  let grPart = null;
  let modulePart = null;

  parts.sort((a, b) => a.positionx - b.positionx);

  for (let index = 0; index < parts.length; index++) {
    modulePart = parts[index];

    grPart = new Konva.Rect({
      id: modulePart.id,
      x: (modulePart.positionx - modulePart.dimensionx / 2.0) * PIXEL_METER_RELATION,
      y: (modulePart.positionz - modulePart.dimensionz / 2.0) * PIXEL_METER_RELATION,
      width: modulePart.dimensionx * PIXEL_METER_RELATION,
      height: modulePart.dimensionz * PIXEL_METER_RELATION,
      rotation: modulePart.rotationy,
      name: modulePart.name,
      stroke: getModulePartStrokeColor(modulePart.type),
      fill: getModulePartColor(modulePart),
      perfectDrawEnabled: true,
    });

    grModule.add(grPart);

    if (number === 1 && index === 0 && firtsBaseIndicador) {
      var circle = new Konva.Circle({
        radius: (modulePart.dimensionx * PIXEL_METER_RELATION) / 8,
        x: modulePart.positionx * PIXEL_METER_RELATION,
        y: modulePart.positionz * PIXEL_METER_RELATION,
        fill: "red",
      });
      grModule.add(circle);
    }
  }
}

function buildActorModules(grActor, modules, firtsBaseIndicador) {
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

    buildModule(grModule, module.parts, module.number, firtsBaseIndicador);
    grActor.add(grModule);
  }

  return grModule;
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

function buildActor(pixelMeterRelation, actor, onDblClick, selectPart = false, firtsBaseIndicador) {
  let grActor = null;

  grActor = new Konva.Group({
    id: actor.id,
    x: actor.positionx * pixelMeterRelation,
    y: actor.positionz * pixelMeterRelation,
    name: actor.name,
    width: actor.dimensionx * pixelMeterRelation,
    height: actor.dimensionz * pixelMeterRelation,
    rotation: -actor.rotationy,
    userData: actor,
  });

  grActor.on("dblclick dbltap", onDblClick);

  buildActorModules(grActor, actor.modules, firtsBaseIndicador);
  buildActorFrames(grActor, actor.frames);

  if (!selectPart) {
    buildActorBase(grActor, actor);
  }

  return grActor;
}

function buildActors(
  stageRef,
  actors,
  cache = false,
  onSelect = null,
  onDblClick = null,
  selectPart = false,
  firtsBaseIndicador = false
) {
  let layer = null;
  let actor = null;

  layer = new Konva.Layer({ id: "actors" });

  for (let index = 0; index < actors.length; index++) {
    actor = buildActor(PIXEL_METER_RELATION, actors[index], onDblClick, selectPart, firtsBaseIndicador);
    actor.on("mousedown touchstart", onSelect);

    layer.add(actor);
  }

  if (cache) {
    layer.cache({ pixelRatio: 3 });
  }
  stageRef.add(layer);

  return layer;
}

function buildActorsAndAnchors(stageRef, actors, cache = false, onSelect = null) {
  let layer = null;
  let actor = null;

  layer = new Konva.Layer({ id: "actors" });

  if (onSelect) {
    layer.on("mousedown touchstart", onSelect);
  }

  const anchorMap = new Map();

  for (let index = 0; index < actors.length; index++) {
    actor = buildActorAndAnchor(anchorMap, PIXEL_METER_RELATION, actors[index]);
    layer.add(actor);
  }

  if (cache) {
    layer.cache({ pixelRatio: 3 });
  }
  stageRef.add(layer);

  return anchorMap;
}

function buildActorAndAnchor(anchorMap, pixelMeterRelation, actor) {
  let grActor = null;

  grActor = new Konva.Group({
    id: actor.id,
    x: actor.positionx * pixelMeterRelation,
    y: actor.positionz * pixelMeterRelation,
    name: actor.name,
    width: actor.dimensionx * pixelMeterRelation,
    height: actor.dimensionz * pixelMeterRelation,
    rotation: -actor.rotationy,
    userData: actor,
  });

  buildActorModulesAndAnchor(anchorMap, grActor, actor.modules);
  buildActorFrames(grActor, actor.frames);

  return grActor;
}

function buildActorModulesAndAnchor(anchorMap, grActor, modules) {
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

    buildModuleAndAnchor(anchorMap, grModule, module.parts, module.number);
    grActor.add(grModule);
  }

  return grModule;
}

function buildModuleAndAnchor(anchorMap, grModule, parts) {
  let grPart = null;
  let modulePart = null;

  parts.sort((a, b) => a.positionx - b.positionx);

  for (let index = 0; index < parts.length; index++) {
    modulePart = parts[index];

    grPart = new Konva.Rect({
      id: modulePart.id,
      x: (modulePart.positionx - modulePart.dimensionx / 2.0) * PIXEL_METER_RELATION,
      y: (modulePart.positionz - modulePart.dimensionz / 2.0) * PIXEL_METER_RELATION,
      width: modulePart.dimensionx * PIXEL_METER_RELATION,
      height: modulePart.dimensionz * PIXEL_METER_RELATION,
      rotation: modulePart.rotationy,
      name: modulePart.name,
      stroke: getModulePartStrokeColor(modulePart.type),
      fill: getModulePartColor(modulePart),
      perfectDrawEnabled: true,
    });

    grModule.add(grPart);

    if (anchorMap) {
      anchorMap.set(modulePart.name, grPart);
    }
  }
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

function selectPartWithId(stageRef, obj, onDblClick) {
  const layers = stageRef.find("#selection-layer");

  if (layers) {
    const layer = layers[0];
    const group = obj.getParent();

    if (group && group.attrs.name !== "selection-box") {
      layer.removeChildren();

      const rot = group.getParent().attrs.rotation;
      const pos = obj.getAbsolutePosition(stageRef);
      const gr = new Konva.Group({
        x: pos.x,
        y: pos.y,
        rotation: rot,
        name: "selection-box",
        width: obj.width(),
        height: obj.height(),
      });

      gr.on("dblclick dbltap", (e) => {
        if (onDblClick) {
          onDblClick(obj.attrs);
        }
      });

      /*MARCO*/
      const selector = new Konva.Rect({
        x: 0,
        y: 0,
        width: obj.width(),
        height: obj.height(),
        stroke: getPartSelectedColor(),
        strokeWidth: 2,
      });

      /*CARTEL*/
      const label = new Konva.Label({ x: obj.width() / 2, y: obj.height() / 2 });
      label.rotation(-rot);
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
        text: obj.name(),
        align: "center",
      });

      label.add(tag, text);
      gr.add(selector, label);

      layer.add(gr);
    }
  }
}

function buildSelectionLayer(stageRef) {
  const selectionLayer = new Konva.Layer({ id: "selection-layer" });
  stageRef.add(selectionLayer);
  return selectionLayer;
}

function buildDataInformationLayer(stageRef) {
  const selectionLayer = new Konva.Layer({ id: "dataInformation-layer" });
  stageRef.add(selectionLayer);
}

function buildStaticsGraphNodeLayer(stageRef) {
  const layer = new Konva.Layer({ id: "staticGraphNode-layer" });
  stageRef.add(layer);
}

function buildDraggableGraphNodeLayer(stageRef) {
  const layer = new Konva.Layer({ id: "draggableGraphNode-layer" });
  stageRef.add(layer);
}

function buildGraphAxisLayer(stageRef) {
  const layer = new Konva.Layer({ id: "graphAxis-layer" });
  stageRef.add(layer);
}

function addLayer(stageRef, name) {
  const layer = new Konva.Layer({ id: name });
  stageRef.add(layer);
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

function showPart(stageRef, obj, color) {
  const layers = stageRef.find("#dataInformation-layer");

  if (layers) {
    const layer = layers[0];

    layer.removeChildren();

    const pos = obj.getAbsolutePosition(stageRef);

    const group = obj.getParent();
    const rot = group.getParent().attrs.rotation;

    const gr = new Konva.Group({
      x: pos.x,
      y: pos.y,
      rotation: rot,
      width: obj.width(),
      height: obj.height(),
    });

    const selector = new Konva.Rect({
      x: 0,
      y: 0,
      width: obj.width(),
      height: obj.height(),
      fill: color,
      // stroke: getPartSelectedColor(),
      // strokeWidth: 0,
    });

    gr.add(selector);

    layer.add(gr);
  }
}

function showParts(stageRef, bases, color, onSelect, onDblClick) {
  const layers = stageRef.find("#dataInformation-layer");

  if (layers) {
    const layer = layers[0];

    layer.removeChildren();

    for (let index = 0; index < bases.length; index++) {
      const base = bases[index];

      const pos = base.getAbsolutePosition(stageRef);

      const group = base.getParent();
      const rot = group.getParent().attrs.rotation;

      const gr = new Konva.Group({
        x: pos.x,
        y: pos.y,
        name: "dataInformation-box",
        rotation: rot,
        width: base.width(),
        height: base.height(),
      });

      const selector = new Konva.Rect({
        x: 0,
        y: 0,
        width: base.width(),
        height: base.height(),
        fill: color,
      });

      gr.on("dblclick dbltap", (e) => {
        if (onDblClick) {
          onDblClick(base.attrs);
        }
      });

      selector.on("mousedown touchstart", (e) => {
        selectDataInformation(stageRef, gr.clone(), base);
        if (onSelect) {
          onSelect(base.attrs.id);
        }
      });

      gr.add(selector);
      layer.add(gr);
    }
  }
}

function selectDataInformation(stageRef, group, base) {
  const layers = stageRef.find("#selection-layer");

  if (layers) {
    const layer = layers[0];

    layer.removeChildren();

    /*MARCO*/
    const selector = new Konva.Rect({
      x: 0,
      y: 0,
      width: base.width(),
      height: base.height(),
      stroke: getPartSelectedColor(),
      strokeWidth: 2,
    });

    /*CARTEL*/
    const label = new Konva.Label({ x: base.width() / 2, y: base.height() / 2 });
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
      text: base.name(),
      align: "center",
    });

    label.add(tag, text);
    group.add(selector, label);

    layer.add(group);
  }
}

function selectNode(stageRef, group, base) {
  const layers = stageRef.find("#selection-layer");

  if (layers) {
    const layer = layers[0];

    layer.removeChildren();

    /*MARCO*/
    const selector = new Konva.Circle({
      x: base.width() / 2,
      y: base.height() / 2,
      width: radioNode,
      height: radioNode,
      stroke: getPartSelectedColor(),
      strokeWidth: 2,
    });

    /*CARTEL*/
    const label = new Konva.Label({ x: base.width() / 2, y: base.height() / 2 });
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
      text: base.name(),
      align: "center",
    });

    label.add(tag, text);
    group.add(selector, label);

    layer.add(group);
  }
}

function findObjectInLayer(stageRef, layerName, objId) {
  let group = null;
  const layers = stageRef.find("#" + layerName);

  if (layers) {
    const layer = layers[0];
    const groups = layer.find("#" + objId);
    if (groups) {
      group = groups[0];
    }
  }

  return group;
}

function findObjectsInLayer(stageRef, layerName) {
  let children = null;
  const layers = stageRef.find("#" + layerName);

  if (layers && layers.length > 0) {
    const layer = layers[0];
    children = layer.children;
  }

  return (children);
}

function showNodes(stageRef, nodes, color, onSelect) {
  const layers = stageRef.find("#staticGraphNode-layer");
  if (layers) {
    const layer = layers[0];

    if (layer) {
      layer.removeChildren();

      for (let index = 0; index < nodes.length; index++) {
        const base = nodes[index];

        const pos = base.getAbsolutePosition(stageRef);

        const group = base.getParent();
        const rot = group.getParent().attrs.rotation;

        const gr = new Konva.Group({
          x: pos.x,
          y: pos.y,
          name: "dataInformation-box",
          rotation: rot,
          width: base.width(),
          height: base.height(),
        });

        const node = new Konva.Circle({
          x: base.width() / 2,
          y: base.height() / 2,
          width: radioNode,
          height: radioNode,
          fill: color,
          type: "GRAPH_NODE",
        });

        // gr.on("dblclick dbltap", (e) => {
        //   if(onDblClick){
        //     onDblClick(base.attrs)
        //   }
        // });

        node.on("mousedown touchstart", (e) => {
          selectNode(stageRef, gr.clone(), base);
          if (onSelect) {
            onSelect(base.attrs.id);
          }
        });

        gr.add(node);
        layer.add(gr);
      }

      layer.cache({ pixelRatio: 3 });
    }
  }
}

function buildNode(stageRef, onSelect, pos, color) {
  const layers = stageRef.find("#draggableGraphNode-layer");

  if (layers) {
    const id = uuid();
    const layer = layers[0];

    const base = new Konva.Rect({
      id: id,
      x: 0,
      y: 0,
      width: radioNode,
      height: radioNode,
      rotation: 0,
      name: "NEW-NODE",
    });

    const gr = new Konva.Group({
      id: id,
      x: pos.x - radioNode / 2,
      y: pos.y - radioNode / 2,
      name: "dataInformation-box",
      rotation: 0,
      width: base.width(),
      height: base.height(),
      draggable:true
    });

    const node = new Konva.Circle({
      x: radioNode / 2,
      y: radioNode / 2,
      width: radioNode,
      height: radioNode,
      fill: color,
      type: "GRAPH_NODE",
    });

    node.on("mousedown touchstart", (e) => {
      if (onSelect) {
        onSelect(base.attrs.id);
      }
    });

    gr.add(node);
    layer.add(gr);

    // layer.cache({ pixelRatio: 3 });
  }
}

function selectActor(stageRef, obj) {
  const layers = stageRef.find("#selection-layer");

  if (layers) {
    const layer = layers[0];

    layer.removeChildren();

    const group = obj.getParent().clone();
    group.removeChildren();

    /*MARCO*/
    const selector = new Konva.Rect({
      x: -(group.width() / 2),
      y: -(group.height() / 2),
      width: group.width(),
      height: group.height(),
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
  selectPartWithId,
  buildActorsAndAnchors,
  buildDataInformationLayer,
  showPart,
  showParts,
  showNodes,
  selectActor,
  addLayer,
  buildStaticsGraphNodeLayer,
  buildDraggableGraphNodeLayer,
  buildGraphAxisLayer,
  buildNode,
  findObjectInLayer,
  findObjectsInLayer
};
