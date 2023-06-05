import * as THREE from "three";
import { useRef, useState } from "react";
import { Detailed } from "@react-three/drei";

const materialsMap = new Map();
materialsMap.set(1, "grey");
materialsMap.set(2, "blue");
materialsMap.set(3, "#c5c5c5");
materialsMap.set(4, "#c5c5c5");
materialsMap.set(5, "green");
materialsMap.set(10, "grey");
materialsMap.set(11, "orange");
materialsMap.set(12, "blue");
materialsMap.set(100, "yellow");

function Box({
  name,
  position,
  dimension,
  rotations,
  color = 0xd5d5d5,
  opacity = 1,
  transparent = false,
  onClick,
  userData,
}) {
  const ref = useRef();
  return (
    <mesh
      name={name}
      position={position}
      ref={ref}
      rotation={
        new THREE.Euler(
          THREE.MathUtils.degToRad(rotations[0]),
          THREE.MathUtils.degToRad(rotations[1]),
          THREE.MathUtils.degToRad(rotations[2])
        )
      }
      onClick={onClick}
      userData={userData}
    >
      <boxGeometry args={[dimension[0], dimension[1], dimension[2]]} />
      <meshLambertMaterial color={color} opacity={opacity} transparent={transparent} />
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
            rotations={[frame.rotationx, frame.rotationy, frame.rotationz]}
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
            rotation={
              new THREE.Euler(
                THREE.MathUtils.degToRad(module.rotationx),
                THREE.MathUtils.degToRad(module.rotationy),
                THREE.MathUtils.degToRad(module.rotationz)
              )
            }
          >
            {module?.parts.map((part) => {
              const matPart = materialsMap.get(part.type);
              const bPart = (
                <Box
                  key={part.id ? part.id : part.key}
                  name={part.name}
                  dimension={[part.dimensionx, part.dimensiony, part.dimensionz]}
                  position={[part.positionx, -part.positiony, part.positionz]}
                  rotations={[part.rotationx, part.rotationy, part.rotationz]}
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

// function buildStructureLOD(structure) {
//   const parts = structure.parts;
//   const grStructure = new THREE.Group();
//   const grLow = new THREE.Group();
//   const grHigh = new THREE.Group();

//   grStructure.name = structure.name;

//   for (let i = 0; i < parts.length; i++) {
//     const part = parts[i];
//     switch (part.type) {
//       case "BASE":
//       case "STRUCTURE":
//         grLow.add(createStructurePart(part));
//       case "OTHER":
//         grHigh.add(createStructurePart(part));
//     }
//   }

//   const lod = new THREE.LOD();
//   lod.addLevel(grHigh, 100);
//   lod.addLevel(grLow, 500);
//   lod.addLevel(createStructure(structure), 2000);

//   grStructure.add(lod);
//   grStructure.position.x = structure.pos_x * pixelMeterRelation;
//   grStructure.position.y = structure.pos_y * pixelMeterRelation;
//   grStructure.position.z = structure.pos_z * pixelMeterRelation;
//   grStructure.rotateY((structure.rot * 3.14) / 180);

//   group.add(grStructure);
// }

function buildStructure(structure, setSelectedPart) {
  const modules = structure.modules;
  const frames = structure.frames;

  return (
    <group
      key={structure.id ? structure.id : structure.key}
      name={structure.name}
      position={[structure.positionx, structure.positiony, structure.positionz]}
      rotation={
        new THREE.Euler(
          THREE.MathUtils.degToRad(structure.rotationx),
          THREE.MathUtils.degToRad(structure.rotationy),
          THREE.MathUtils.degToRad(structure.rotationz)
        )
      }
    >
      {frames?.map((frame) => {
        const matColor = materialsMap.get(frame.type);
        const box = (
          <Box
            key={frame.id ? frame.id : frame.key}
            position={[frame.positionx, frame.positiony, frame.positionz]}
            dimension={[frame.dimensionx, frame.dimensiony, frame.dimensionz]}
            rotations={[frame.rotationx, frame.rotationy, frame.rotationz]}
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
            rotation={
              new THREE.Euler(
                THREE.MathUtils.degToRad(module.rotationx),
                THREE.MathUtils.degToRad(module.rotationy),
                THREE.MathUtils.degToRad(module.rotationz)
              )
            }
          >
            {module?.parts.map((part) => {
              const matPart = materialsMap.get(part.type);
              const bPart = (
                <Box
                  key={part.id ? part.id : part.key}
                  name={part.name}
                  dimension={[part.dimensionx, part.dimensiony, part.dimensionz]}
                  position={[part.positionx, -part.positiony, part.positionz]}
                  rotations={[part.rotationx, part.rotationy, part.rotationz]}
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

function buildStructureLOD(structure, setSelectedPart) {
  const grHigh = buildHighLevel(structure, setSelectedPart);
  const grLow = buildLowLevel(structure, setSelectedPart);
  const grBase = buildBaseLevel(structure, setSelectedPart);

  return (
    <Detailed distances={[0, 50, 300]}>
      {grHigh}
      {grLow}
      {grBase}
    </Detailed>
  );
}

const buildHighLevel = (structure, setSelectedPart) => {
  const modules = structure.modules;
  const frames = structure.frames;
  return (
    <group
      // key={structure.id ? structure.id : structure.key}
      name={structure.name}
      position={[structure.positionx, structure.positiony, structure.positionz]}
      rotation={
        new THREE.Euler(
          THREE.MathUtils.degToRad(structure.rotationx),
          THREE.MathUtils.degToRad(structure.rotationy),
          THREE.MathUtils.degToRad(structure.rotationz)
        )
      }
    >
      {frames?.map((frame) => {
        const matColor = materialsMap.get(frame.type);
        const box = (
          <Box
            // key={frame.id ? frame.id : frame.key}
            position={[frame.positionx, frame.positiony, frame.positionz]}
            dimension={[frame.dimensionx, frame.dimensiony, frame.dimensionz]}
            rotations={[frame.rotationx, frame.rotationy, frame.rotationz]}
            color={matColor}
            userData={frame}
          />
        );
        return box;
      })}

      {modules?.map((module) => {
        return (
          <group
            // key={module.id ? module.id : module.key}
            name={module.name}
            position={[module.positionx, module.positiony, module.positionz]}
            rotation={
              new THREE.Euler(
                THREE.MathUtils.degToRad(module.rotationx),
                THREE.MathUtils.degToRad(module.rotationy),
                THREE.MathUtils.degToRad(module.rotationz)
              )
            }
          >
            {module?.parts.map((part) => {
              const matPart = materialsMap.get(part.type);
              const bPart = (
                <Box
                  // key={part.id ? part.id : part.key}
                  name={part.name}
                  dimension={[part.dimensionx, part.dimensiony, part.dimensionz]}
                  position={[part.positionx, -part.positiony, part.positionz]}
                  rotations={[part.rotationx, part.rotationy, part.rotationz]}
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
};

const buildLowLevel = (structure, setSelectedPart) => {
  const frames = structure.frames;
  return (
    <group
      // key={structure.id ? structure.id : structure.key}
      name={structure.name}
      position={[structure.positionx, structure.positiony, structure.positionz]}
      rotation={
        new THREE.Euler(
          THREE.MathUtils.degToRad(structure.rotationx),
          THREE.MathUtils.degToRad(structure.rotationy),
          THREE.MathUtils.degToRad(structure.rotationz)
        )
      }
    >
      {frames?.map((frame) => {
        const matColor = materialsMap.get(frame.type);
        const box = (
          <Box
            // key={frame.id ? frame.id : frame.key}
            position={[frame.positionx, frame.positiony, frame.positionz]}
            dimension={[frame.dimensionx, frame.dimensiony, frame.dimensionz]}
            rotations={[frame.rotationx, frame.rotationy, frame.rotationz]}
            color={matColor}
            userData={frame}
          />
        );
        return box;
      })}
    </group>
  );
};

const buildBaseLevel = (structure, setSelectedPart) => {
  const matColor = materialsMap.get(100);
  return (
    <Box
      // key={structure.id ? structure.id : structure.key}
      name={structure.name}
      position={[structure.positionx, structure.positiony, structure.positionz]}
      dimension={[structure.dimensionx, structure.dimensiony, structure.dimensionz]}
      rotations={
        new THREE.Euler(
          THREE.MathUtils.degToRad(structure.rotationx),
          THREE.MathUtils.degToRad(structure.rotationy),
          THREE.MathUtils.degToRad(structure.rotationz)
        )
      }
      color={matColor}
      userData={structure}
    />
  );
};

const buildEnvironmentLOD = (racks, setSelectedPart) => {
  const env = [];

  for (let index = 0; index < racks.length; index++) {
    const rack = racks[index];
    //env.push(buildStructure(rack, setSelectedPart));
    env.push(buildStructureLOD(rack, setSelectedPart));
  }

  return env;
};

export { buildModelStructure, buildEnvironmentLOD };
