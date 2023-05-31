import * as THREE from "three";
import { config } from "../../Constants/config";
const SCALE_CD = 1;
const positionRegex = /^[A-Z]\d{2}_\d{2}[A-Z]_\d{2}$/;
const columnsRegex = /^(FRONT|BACK) COLUMN - \d+$/;

const matBase = new THREE.MeshLambertMaterial({ color: 0xced4da });
const matShelf = new THREE.MeshLambertMaterial({ color: 0x0000ee });
const matStructure = new THREE.MeshLambertMaterial({ color: 0x868e96 });
const material = new THREE.MeshLambertMaterial({ color: 0xd5d5d5 });

const materials = {
  ESTANTE: matShelf,
  BASE: matBase,
  BACK: matStructure,
  LEFT: matStructure,
  RIGHT: matStructure,
  INTERNAL: matStructure,
  VISUALITY: matStructure,
  VISUAL: matStructure,
};

const layerMap = new Map();
layerMap.set("BASE", 1);
layerMap.set("BACK", 2);
layerMap.set("LEFT", 2);
layerMap.set("RIGHT", 2);
layerMap.set("INTERNAL", 2);
layerMap.set("ESTANTE", 3);
layerMap.set("VISUALITY", 3);
layerMap.set("VISUAL", 3);

function buildLOD(group, structures, pixelMeterRelation) {
  const count = structures.length;

  /*ASIGNA TIPOS*/
  for (let i = 0; i < count; i++) {
    const structure = structures[i];
    asignaTipo(structure);
  }

  for (let i = 0; i < count; i++) {
    const structure = structures[i];
    buildCDStructureLOD(group, structure, pixelMeterRelation);
  }
}

function createStructurePart(part, view3d=false) {
  let mat = null;
  switch (part.type) {
    case "BASE":
      mat = matBase;
      break;
    case "STRUCTURE":
      mat = matShelf;
      break;
    case "OTHER":
      mat = material;
      break;
  }
  
  const dimY = view3d ? (part.dim_y * SCALE_CD) : 0.1;
  const posY = view3d ? (part.pos_y * SCALE_CD) : 0;

  const geometry = new THREE.BoxGeometry(
    part.dim_x * SCALE_CD, 
    dimY, 
    part.dim_z * SCALE_CD);

  const grPart = new THREE.Mesh(geometry, mat);

  grPart.name = part.name;
  grPart.position.x = part.pos_x * SCALE_CD;
  grPart.position.y = posY;
  grPart.position.z = part.pos_z * SCALE_CD;
  grPart.updateMatrix();
  grPart.matrixAutoUpdate = false;

  return grPart;
}

function createStructure(structure, view3d=false) {
  let mat = material;
  const dimY = view3d ? (structure.dim_y * SCALE_CD) : 0.1;
  const posY = view3d ? ((structure.dim_y * SCALE_CD) / 2.0) : 0;

  const geometry = new THREE.BoxGeometry(
    structure.dim_x * SCALE_CD,
    dimY,
    structure.dim_z * SCALE_CD
  );

  const grStructure = new THREE.Mesh(geometry, mat);

  grStructure.name = structure.name;
  grStructure.position.y = posY;
  grStructure.updateMatrix();
  grStructure.matrixAutoUpdate = false;

  return grStructure;
}

function createMesh(partPrefix, part) {
  const mat = materials[partPrefix];
  if (!mat) {
    console.log(part.name);
  }

  const geometry = new THREE.BoxGeometry(part.dim_x * SCALE_CD, part.dim_y * SCALE_CD, part.dim_z * SCALE_CD);

  const grPart = new THREE.Mesh(geometry, mat ? mat : material);

  grPart.name = part.name;
  grPart.position.x = part.pos_x * SCALE_CD;
  grPart.position.y = part.pos_y * SCALE_CD;
  grPart.position.z = part.pos_z * SCALE_CD;
  grPart.updateMatrix();
  grPart.matrixAutoUpdate = false;

  return grPart;
}

function asignaTipo(structure) {
  const parts = structure.parts;

  let base = null;
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (positionRegex.test(part.name)) {
      part["type"] = "BASE";
    } else {
      if (columnsRegex.test(part.name)) {
        part["type"] = "STRUCTURE";
      } else {
        part["type"] = "OTHER";
      }
    }
  }
}

function buildCDStructureLOD(group, structure, pixelMeterRelation = 1) {
  const parts = structure.parts;
  const grStructure = new THREE.Group();
  const grLow = new THREE.Group();
  const grHigh = new THREE.Group();

  grStructure.name = structure.name;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    switch (part.type) {
      case "BASE":
      case "STRUCTURE":
        grLow.add(createStructurePart(part));
      case "OTHER":
        grHigh.add(createStructurePart(part));
    }
  }

  const lod = new THREE.LOD();
  lod.addLevel(grHigh, 100);
  lod.addLevel(grLow, 500);
  lod.addLevel(createStructure(structure), 2000);

  grStructure.add(lod);
  grStructure.position.x = structure.pos_x * pixelMeterRelation;
  grStructure.position.y = structure.pos_y * pixelMeterRelation;
  grStructure.position.z = structure.pos_z * pixelMeterRelation;
  grStructure.rotateY((structure.rot * 3.14) / 180);

  group.add(grStructure);
}

function buildStructureLOD(scene, structure) {
  const modules = structure.modules;
  const grStructure = new THREE.Group();
  const grBase = new THREE.Group();
  const grLow = new THREE.Group();
  const grHigh = new THREE.Group();

  grStructure.name = structure.name;

  for (let m = 0; m < modules.length; m++) {
    const module = modules[m];
    const parts = module.parts;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const partPrefix = part.name.split(" ")[0];
  
      switch (partPrefix) {
        case "BASE":
          grBase.add(createMesh(partPrefix, part));
        case "BACK":
        case "FRONT":
        case "RIGHT":
        case "LEFT":
          grLow.add(createMesh(partPrefix, part));
        case "ESTANTE":
        case "INTERNAL":
        case "VISUALITY":
        case "VISUAL":
          grHigh.add(createMesh(partPrefix, part));
          break;
  
        default:
          grBase.add(createMesh(partPrefix, part));
          console.log("default ->", partPrefix);
          break;
      }
    }
  }


  var lod = new THREE.LOD();
  lod.addLevel(grHigh, 100);
  lod.addLevel(grLow, 500);
  lod.addLevel(grBase, 2000);

  grStructure.add(lod);
  grStructure.position.x = structure.pos_x * config.PIXEL_METER_RELATION;
  grStructure.position.y = structure.pos_y * config.PIXEL_METER_RELATION;
  grStructure.position.z = structure.pos_z * config.PIXEL_METER_RELATION;
  grStructure.rotateY((structure.rot * 3.14) / 180);

  scene.add(grStructure);
}

export { buildLOD, buildStructureLOD };
