import * as THREE from "three";
import { useRef, useState } from "react";
import { Edges, useSelect } from "@react-three/drei";

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

function getColor(obj) {
  let color = null;
  if (obj.color) {
    color = obj.color;
  } else {
    color = materialsMap.get(obj.type);
  }
  return color;
}

function SelectebleBox({
  name,
  position,
  dimension,
  rotations,
  color = 0xd5d5d5,
  opacity = 1,
  transparent = false,
  onClick,
  onDlbClick,
  userData,
}) {
  const ref = useRef();

  const list = useSelect();
  const selected = list.map((sel) => {
    return sel.userData.id;
  });
  const isSelected = !!selected.find((sel) => sel === userData.id);

  return (
    <group name={"gPos"} position={position}>
      <group
        name={"gRot"}
        rotation={rotations.map(r => THREE.MathUtils.degToRad(r))}
      >
        <mesh
          name={name}
          ref={ref}
          onClick={(event) => {
            if (onClick) {
              onClick(event, ref, isSelected);
            }
          }}
          onDoubleClick={onDlbClick}
          userData={userData}
        >
          <boxGeometry args={[dimension[0], dimension[1], dimension[2]]} />
          <meshLambertMaterial color={color} opacity={opacity} transparent={transparent} />

          <Edges visible={isSelected} scale={1} renderOrder={1000} color="#ff0000" />
        </mesh>
      </group>
    </group>
  );
}

function Box({
  name,
  position,
  dimension,
  rotations,
  color = 0xd5d5d5,
  opacity = 1,
  transparent = false,
  onClick,
  onDlbClick,
  userData,
}) {
  const ref = useRef();
  const [selected, setSelected] = useState(false);
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
      onClick={(event) => {
        if (onClick) {
          setSelected(!selected);
          onClick(event, ref);
        }
      }}
      onDoubleClick={onDlbClick}
      userData={userData}
    >
      <boxGeometry args={[dimension[0], dimension[1], dimension[2]]} />
      <meshLambertMaterial color={color} opacity={opacity} transparent={transparent} />
    </mesh>
  );
}

function buildModelStructure(structure, setSelectedPart, onDlbClick) {
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
        const matColor = getColor(frame);
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
              const matPart = getColor(part);
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
                  onDlbClick={onDlbClick}
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

function buildStructure(structure, withFrames, setSelectedPart) {
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
      {withFrames && frames?.map((frame) => {
        const matColor = getColor(frame);
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
              const matPart = getColor(part);
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

// function buildStructureLOD(structure, setSelectedPart) {
//   const grHigh = buildHighLevel(structure, setSelectedPart);
//   const grLow = buildLowLevel(structure, setSelectedPart);
//   const grBase = buildBaseLevel(structure, setSelectedPart);

//   return (
//     <Detailed distances={[0, 50, 300]}>
//       {grHigh}
//       {grLow}
//       {grBase}
//     </Detailed>
//   );
// }

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
        const matColor = getColor(frame);
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
              const matPart = getColor(part);
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
        const matColor = getColor(frame);
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

// const buildBaseLevel = (structure, setSelectedPart) => {
//   const matColor = materialsMap.get(100);
//   return (
//     <Box
//       // key={structure.id ? structure.id : structure.key}
//       name={structure.name}
//       position={[structure.positionx, structure.positiony, structure.positionz]}
//       dimension={[structure.dimensionx, structure.dimensiony, structure.dimensionz]}
//       rotations={
//         new THREE.Euler(
//           THREE.MathUtils.degToRad(structure.rotationx),
//           THREE.MathUtils.degToRad(structure.rotationy),
//           THREE.MathUtils.degToRad(structure.rotationz)
//         )
//       }
//       color={matColor}
//       userData={structure}
//     />
//   );
// };

const buildStructures = (racks, withFrames = true, setSelectedPart) => {
  const env = [];

  for (let index = 0; index < racks.length; index++) {
    const rack = racks[index];
    env.push(buildStructure(rack, withFrames, setSelectedPart));
  }

  return env;
};

function buildParts(parts, onSelect, selectedId) {
  return parts?.map((part) => {
    const matColor = getColor(part);
    const box = (
      <SelectebleBox
        id={part.id}
        key={part.id ? part.id : part.key}
        position={[part.positionx, part.positiony, part.positionz]}
        dimension={[part.dimensionx, part.dimensiony, part.dimensionz]}
        rotations={[part.rotationx, part.rotationy, part.rotationz]}
        color={matColor}
        onClick={onSelect}
        userData={part}
        selectedId={selectedId}
      />
    );
    return box;
  });
}

export { buildModelStructure, buildStructures, SelectebleBox, buildParts };
