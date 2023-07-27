import * as THREE from "three";
import React, { useEffect } from "react";
import uuid from "react-uuid";
import { useWindowSize } from "../../../Hook";
import { HEADER_HIGHT } from "../../../Constants";
import { Canvas } from "@react-three/fiber";
import { MapControls, Select } from "@react-three/drei";
import { Stack } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useRef } from "react";
import { buildPosition, buildStructures } from "../../../Components/Builder3d";
import { useState } from "react";
import { config } from "../../../Constants/config";

const FloorPlanView3d = ({
  racks,
  action = null,
  drawFrames,
  selectedPart,
  setSelectedPart,
  setOpenModuleInfoPanel,
}) => {
  const wSize = useWindowSize();
  const matches = useMediaQuery("(min-width: 768px)");
  const controlRef = useRef(null);
  const sceneRef = useRef(null);
  const [foundParts, setFoundParts] = useState(null);
  const [lastPosSelectedName, setLastPosSelectedName] = useState(null);

  const groupParts = (arrObjPos) => {
    const ret = new Map();
    let group = null;

    if (arrObjPos) {
      arrObjPos.forEach((pos) => {
        const arr = pos.code.split("-");
        const name = createName(arr);

        group = ret.get(name);
        if (group === undefined) {
          group = [];
          ret.set(name, group);
        }

        group.push(pos);
      });
    }

    return ret;
  };

  const onSelect = (event, ref) => {
    if (event.object) {
      setSelectedPart(event.object);
    } else {
      setSelectedPart(null);
    }
  };

  const onDblclick = (event) => {
    if (event.intersections && event.intersections.length > 0) {
      const obj = event.intersections[0].object;
      if (obj) {
        setOpenModuleInfoPanel(true);
      }
    }
  };

  useEffect(() => {
    if (action) {
      const parts = action.positionsNames;
      const arrObjPos = [];
      if (parts) {
        const color = action.color;
        const ref = sceneRef.current;

        const gPart = groupParts(parts);
        let bases = [...gPart.keys()];

        bases.forEach((base) => {
          const holes = gPart.get(base);
          let deltaY = 0;
          const obj = ref.getObjectByName(base);

          /*Get structure*/
          const arr = base.split("-");
          const structureName = createName(arr);
          const structure = ref.getObjectByName(structureName);

          let rotation = null;
          if (structure) {
            rotation = { x: 0, y: THREE.MathUtils.radToDeg(structure.rotation.y), z: 0 };
          } else {
            rotation = { x: 0, y: 0, z: 0 };
          }

          deltaY = 0;
          if (obj) {
            const position = new THREE.Vector3();
            obj.getWorldPosition(position);

            holes.forEach((h, index) => {
              const newPos = {
                x: position.x,
                y: position.y + deltaY,
                z: position.z,
              };

              const id = uuid();
              const dimension = { x: h.width / 100.0, y: h.height / 100.0 / 2.0, z: h.depth / 100.0 };
              const userData = { id: id, name: h.code, color: color, selected: false };
              const posObj = buildPosition(
                id,
                h.code,
                newPos,
                dimension,
                rotation,
                color,
                userData,
                onSelect,
                onDblclick
              );
              arrObjPos.push(posObj);
              deltaY += h.height / 2.0 / 100.0 + config.PALLET_VERTICAL_SEPARATION;

              // let posX = newPos.x;
              // const pallets = h.pallets;
              // pallets.forEach((p) => {
              //   if (p.details && p.details.length > 0) {
              //     const id = uuid();

              //     const dimension = { x: p.width / 100.0, y: h.height / 100.0, z: p.depth / 100.0 };
              //     const detailPos = {
              //       x: posX,
              //       y: newPos.y, //+ (p.height / 100.0),
              //       z: newPos.z, //+ ((p.depth / 100.0) / 2.0)
              //     };

              //     const userData = { id: id, name: h.code, color: color, selected: false };
              //     const posObj = buildPosition(
              //       id,
              //       h.code,
              //       detailPos,
              //       dimension,
              //       rotation,
              //       color,
              //       userData,
              //       onSelect,
              //       onDblclick
              //     );
              //     arrObjPos.push(posObj);

              //     posX += p.width / 100.0;
              //   }
              // });
            });
          }
        });

        setFoundParts(arrObjPos);
        setLastPosSelectedName(null);
      }
    }
  }, [action]);

  useEffect(() => {
    const ref = sceneRef.current;
    if (lastPosSelectedName) {
      const lastSelObj = ref.getObjectByName(lastPosSelectedName);
      lastSelObj.material.color.set(lastSelObj.userData.color);
    }

    if (selectedPart) {
      const obj = ref.getObjectByName(selectedPart.name);
      obj.material.color.set("#0000ff");
      setLastPosSelectedName(selectedPart.name);
    }
  }, [selectedPart]);

  return (
    <Stack w={wSize.width - (matches ? 316 : 32)} h={wSize.height - HEADER_HIGHT}>
      <Canvas camera={{ position: [5, 5, 5], fov: 25 }}>
        <scene
          ref={sceneRef}
          onPointerMissed={() => {
            setSelectedPart(null);
          }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} />
          {/* <Grid infiniteGrid position={[0, 0, 0]} /> */}
          <MapControls
            ref={controlRef}
            enableDamping={false}
            minPolarAngle={0}
            maxPolarAngle={Math.PI / 2.1}
            makeDefault
          />
          {racks ? buildStructures(racks, drawFrames) : null}

          <Select box multiple>
            {foundParts ? foundParts : null}
          </Select>
        </scene>
      </Canvas>
    </Stack>
  );
};

function createName(arr) {
  if (!Array.isArray(arr)) {
    throw new Error("Se espera un array como argumento.");
  }

  if (arr.length === 0) {
    return "";
  }

  return arr.slice(0, -1).join("-");
}

export default FloorPlanView3d;
