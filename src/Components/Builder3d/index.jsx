import * as THREE from "three";
import { useRef, useState } from "react";
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

const materialsMap = new Map();
materialsMap.set(1, "grey");
materialsMap.set(2, "blue");
materialsMap.set(3, "#c5c5c5");
materialsMap.set(4, "#c5c5c5");
materialsMap.set(5, "green");

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

function createStructurePart(part, view3d = false) {
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

  const dimY = view3d ? part.dim_y * SCALE_CD : 0.1;
  const posY = view3d ? part.pos_y * SCALE_CD : 0;

  const geometry = new THREE.BoxGeometry(part.dim_x * SCALE_CD, dimY, part.dim_z * SCALE_CD);

  const grPart = new THREE.Mesh(geometry, mat);

  grPart.name = part.name;
  grPart.position.x = part.pos_x * SCALE_CD;
  grPart.position.y = posY;
  grPart.position.z = part.pos_z * SCALE_CD;
  grPart.updateMatrix();
  grPart.matrixAutoUpdate = false;

  return grPart;
}

function createStructure(structure, view3d = false) {
  let mat = material;
  const dimY = view3d ? structure.dim_y * SCALE_CD : 0.1;
  const posY = view3d ? (structure.dim_y * SCALE_CD) / 2.0 : 0;

  const geometry = new THREE.BoxGeometry(structure.dim_x * SCALE_CD, dimY, structure.dim_z * SCALE_CD);

  const grStructure = new THREE.Mesh(geometry, mat);

  grStructure.name = structure.name;
  grStructure.position.y = posY;
  grStructure.updateMatrix();
  grStructure.matrixAutoUpdate = false;

  return grStructure;
}

function createMesh(part) {
  console.log("createMesh -> ", part.name);

  const mat = materialsMap.get(part.type);
  const geometry = new THREE.BoxGeometry(part.dimensionx, part.dimensiony, part.dimensionz);
  const grPart = new THREE.Mesh(geometry, mat ? mat : material);

  grPart.name = part.name;
  grPart.position.x = part.positionx;
  grPart.position.y = part.positiony;
  grPart.position.z = part.positionz;
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

function buildModules(grBase, modules) {
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
}

function buildFrames(grBase, frames) {
  for (let m = 0; m < frames.length; m++) {
    const frame = frames[m];
    grBase.add(createMesh(frame));
  }
}

function buildModelStructure_(scene, structure) {
  const modules = structure.modules;
  const frames = structure.frames;
  const grStructure = new THREE.Group();
  const grBase = new THREE.Group();

  grStructure.name = structure.name;

  //buildModules(grBase, modules);
  buildFrames(grBase, frames);

  grStructure.add(grBase);
  grStructure.position.x = structure.positionx;
  grStructure.position.y = structure.positiony;
  grStructure.position.z = structure.positionz;
  grStructure.rotateY((structure.rotationy * 3.14) / 180);

  scene.add(grStructure);
}

function Box({
  name,
  position,
  dimension,
  rotation,
  color = 0xd5d5d5,
  opacity = 1,
  transparent = false,
  onClick,
  userData,
}) {
  const ref = useRef();
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);
  return (
    <mesh
      name={name}
      position={position}
      ref={ref}
      rotateX={rotation[0]}
      rotateY={rotation[1]}
      rotateZ={rotation[2]}
      onClick={onClick}
      userData={userData}
      // onPointerOver={(event) => hover(true)}
      // onPointerOut={(event) => hover(false)}
    >
      <boxGeometry args={[dimension[0], dimension[1], dimension[2]]} />

      {/* <meshStandardMaterial color={hovered ? "hotpink" : "blue"} /> */}
      <meshLambertMaterial color={hovered ? "gray" : color} opacity={opacity} transparent={transparent} />
    </mesh>
  );
}

function buildModelStructure(structure, setSelectedPart) {
  const modules = structure.modules;
  const frames = structure.frames;

  return (
    <group
      key={structure.id ? structure.id : structure.key}
      name={structure.name}
      //position={[structure.positionx, structure.positiony, structure.positionz]}
      position={[0, structure.positiony, 0]}
      rotateY={(structure.rotationy * 3.14) / 180}
    >
      {frames?.map((frame) => {
        const matColor = materialsMap.get(frame.type);
        const box = (
          <Box
            key={frame.id ? frame.id : frame.key}
            position={[frame.positionx, frame.positiony, frame.positionz]}
            dimension={[frame.dimensionx, frame.dimensiony, frame.dimensionz]}
            rotation={[frame.rotationx, frame.rotationy, frame.rotationz]}
            color={matColor}
            userData={frame}
          />
        );
        return box;
      })}

      {modules?.map((module) => {
        return (
          <group
            key={module.id ? module.id : module.key}
            name={module.name}
            position={[module.positionx, module.positiony, module.positionz]}
            rotateX={(module.rotationx * 3.14) / 180}
            rotateY={(module.rotationy * 3.14) / 180}
            rotateZ={(module.rotationz * 3.14) / 180}
          >
            {module?.parts.map((part) => {
              const matPart = materialsMap.get(part.type);
              const bPart = (
                <Box
                  key={part.id ? part.id : part.key}
                  name={part.name}
                  position={[part.positionx, -part.positiony, part.positionz]}
                  dimension={[part.dimensionx, part.dimensiony, part.dimensionz]}
                  rotation={[part.rotationx, part.rotationy, part.rotationz]}
                  color={matPart}
                  opacity={part.type === 5 ? 0.5 : 1}
                  transparent={part.type === 5 ? true : false}
                  onClick={setSelectedPart}
                  userData={part}
                />
              );
              return bPart;
            })}
          </group>
        );
      })}
    </group>
  );
}
export { buildLOD, buildModelStructure };
