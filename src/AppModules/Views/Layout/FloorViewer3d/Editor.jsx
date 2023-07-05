import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { TransformControls, MapControls } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { buildEnvironmentLOD } from "../../../../Components/Builder3d";
import { Group, Stack } from "@mantine/core";
import { useContext } from "react";
import { EditorStateContext } from "./Context";
import { useState } from "react";
import EditorToolbar from "./EditorToolbar";

const Editor = () => {
  const [model, setModel] = useState(null);
  const { racks, markers, selectedPart, setSelectedPart } = useContext(EditorStateContext);
  const controlRef = useRef(null);
  
  const onSelect = (event) => {
    if (event.intersections && event.intersections.length > 0) {
      const obj = event.intersections[0].object;
      //setSelectedPart(obj);
    }
  };

  // useEffect(() => {
  //   console.log("camDistance ->", controlRef.current.getDistance());
  // }, [controlRef.current.getDistance()]);

  useEffect(() => {
    if (racks) {
      const ret = buildEnvironmentLOD(racks, onSelect);
      setSelectedPart(null);
      setModel(ret);
    }
  }, [racks]);

  const onUpdateData = (event) => {
    const userData = selectedPart.userData;
    const positions = selectedPart.position;
    const rotations = [
      THREE.MathUtils.radToDeg(selectedPart.rotation.x),
      THREE.MathUtils.radToDeg(selectedPart.rotation.y),
      THREE.MathUtils.radToDeg(selectedPart.rotation.z),
    ];
    const dimensions = [
      selectedPart.geometry.parameters.width * selectedPart.scale.x,
      selectedPart.geometry.parameters.height * selectedPart.scale.y,
      selectedPart.geometry.parameters.depth * selectedPart.scale.z,
    ];

    userData.positionx = positions.x;
    userData.positiony = -positions.y;
    userData.positionz = positions.z;

    userData.rotationx = rotations[0];
    userData.rotationy = rotations[1];
    userData.rotationz = rotations[2];

    userData.dimensionx = dimensions[0];
    userData.dimensiony = dimensions[1];
    userData.dimensionz = dimensions[2];
  };

  return (
    <Stack w={"100%"} h={"100%"} spacing={0}>
      <Group mb={"xs"}>
        <EditorToolbar />
      </Group>
      <Canvas camera={{ position: [5, 5, 5], fov: 25 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} />
          {/* <Grid infiniteGrid position={[0, 0, 0]} /> */}
          {model}
        {/* <OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI / 2.1} makeDefault /> */}
        <MapControls
          ref={controlRef}
          enableDamping={false}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2.1}
          makeDefault
        />

        {selectedPart ? (
          <TransformControls
            object={selectedPart}
            onObjectChange={(event) => {
              onUpdateData(event);
            }}
            mode={"rotation"}
          />
        ) : null}
      </Canvas>
    </Stack>
  );
};

export default Editor;
