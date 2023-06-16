import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, TransformControls, Select, useSelect } from "@react-three/drei";
import { useContext, useEffect, useRef, useState } from "react";
import { buildParts } from "../../../Components/Builder3d";
import { Group, Stack } from "@mantine/core";
import { AbmStateContext } from "./Context";
import EditorToolbar from "./EditorToolbar";
import EditorSidebar from "./EditorSidebar";

const Editor = () => {
  const [model, setModel] = useState(null);
  const [selectedPart, setSelectedPart] = useState(null);
  const [transformOption] = useState("translate");
  const { parts } = useContext(AbmStateContext);
  const canvasRef = useRef();

  const onSelect = (event, ref) => {

    if (ref) {
      setSelectedPart(ref.current);
    } else {
      setSelectedPart(null);
    }
  };

  const onDlbClick = (event) => {
    if (event.intersections && event.intersections.length > 0) {
      const obj = event.intersections[0].object;
      if (obj) {
        setPartInspectorOpen(true);
      }
    }
  };

  useEffect(() => {
    if (parts) {
      const ret = buildParts(parts, onSelect);
      setSelectedPart(null);
      setModel(ret);
    }
  }, [parts]);

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
    userData.positiony = positions.y;
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
      <Canvas
        ref={canvasRef}
        camera={{ position: [0, 15, 15], fov: 25 }}
        onPointerMissed={() => {
          setSelectedPart(null);
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} />
        <Grid infiniteGrid position={[0, 0, 0]} />
        <axesHelper args={[10]} />

        <Select box multiple>
          {model}
        </Select>

        <OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI / 2.1} makeDefault />

        {selectedPart ? (
          <TransformControls
            object={selectedPart}
            onObjectChange={(event) => {
              onUpdateData(event);
            }}
            mode={transformOption}
          />
        ) : null}
      </Canvas>
      <EditorSidebar part={selectedPart} open={selectedPart ? true : false} />
    </Stack>
  );
};

export default Editor;
