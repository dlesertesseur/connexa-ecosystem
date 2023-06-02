import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, TransformControls } from "@react-three/drei";
import { useEffect, useState } from "react";
import { buildModelStructure } from "../../../Components/Builder3d";
import { Group, Stack } from "@mantine/core";
import EditorToolbar from "./EditorToolbar";

const Editor = ({ structure, onCreate }) => {
  const [model, setModel] = useState(null);
  const [selectedPart, setSelectedPart] = useState(null);
  const [transformOption, setTransformOption] = useState("translate");

  const onSelect = (event) => {
    if (event.intersections && event.intersections.length > 0) {
      const obj = event.intersections[0].object;
      setSelectedPart(obj);
    }
  };

  useEffect(() => {
    if (structure) {
      const ret = buildModelStructure(structure, onSelect);
      setSelectedPart(null);
      setModel(ret);
    }
  }, [structure]);

  useEffect(() => {
    if (selectedPart) {
      console.log("selectedPart.uuid ->", selectedPart.userData);
    }
  }, [selectedPart]);

  return (
    <Stack w={"100%"} h={"100%"} spacing={0}>
      <Group mb={"xs"}>
        <EditorToolbar
          structure={structure}
          transforOption={transformOption}
          setTransformOption={setTransformOption}
          onCreate={onCreate}
        />
      </Group>
      <Canvas camera={{ position: [5, 5, 5], fov: 25 }}>
        <scene>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} />
          <Grid infiniteGrid position={[0, 0, 0]} />
          <axesHelper args={[10]} />
          {model}
        </scene>
        <OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI / 2.1} makeDefault />

        {selectedPart ? (
          <TransformControls
            object={selectedPart}
            onObjectChange={(event) => {
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

              console.log("TransformControls positions ->", positions);
              console.log("TransformControls rotations ->", rotations);
              console.log("TransformControls dimensions ->", dimensions);
            }}
            mode={transformOption}
          />
        ) : null}
      </Canvas>
    </Stack>
  );
};

export default Editor;
