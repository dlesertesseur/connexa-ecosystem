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

  const groupParts = (arrObjPos) => {
    const ret = new Map();
    let group = null;

    if (arrObjPos) {
      arrObjPos.forEach((pos) => {
        const arr = pos.code.split("-");
        const name = `${arr[0]}-${arr[1]}`;

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
        const dimension = action.dimension;
        const ref = sceneRef.current;

        const gPart = groupParts(parts);
        let bases = [...gPart.keys()];

        bases.forEach((base) => {
          const holes = gPart.get(base);
          let deltaY = 0;
          const obj = ref.getObjectByName(base);
          const position = new THREE.Vector3();

          obj.getWorldPosition(position);

          holes.forEach((p, index) => {
            deltaY = (dimension.y + config.PALLET_VERTICAL_SEPARATION) * index;
            const newPos = {
              x: position.x,
              y: position.y + deltaY,
              z: position.z,
            };

            const id = uuid();
            const userData = { id: id, name: p.code, color: color, selected: false };
            const posObj = buildPosition(id, p.code, newPos, dimension, color, userData, onSelect, onDblclick);
            arrObjPos.push(posObj);
          });
        });

        setFoundParts(arrObjPos);
      }
    }
  }, [action]);

  useEffect(() => {
    const ref = sceneRef.current;

    foundParts?.forEach((p) => {
      const obj = ref.getObjectByName(p.props.userData.name);
      if (obj) {
        if (selectedPart) {
          if (p.props.userData.id === selectedPart.userData.id) {
            obj.material.color.set("#0000ff");
          } else {
            obj.material.color.set(obj.userData.color);
          }
        } else {
          obj.material.color.set(obj.userData.color);
        }
      }
    });
  }, [selectedPart]);

  return (
    <Stack w={wSize.width - (matches ? 316 : 32)} h={wSize.height - HEADER_HIGHT}>
      <Canvas camera={{ position: [5, 5, 5], fov: 25 }}>
        <scene
          ref={sceneRef}
          onPointerMissed={() => {
            // if (selectedPart) {
            //   const color = selectedPart.userData.color;
            //   selectedPart.material.color.set(color);
            // }
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

export default FloorPlanView3d;
