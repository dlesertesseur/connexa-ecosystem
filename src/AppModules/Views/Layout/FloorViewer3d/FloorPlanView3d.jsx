import React from "react";
import { useWindowSize } from "../../../../Hook";
import { HEADER_HIGHT } from "../../../../Constants";
import { Canvas } from "@react-three/fiber";
import { TransformControls, MapControls, Grid } from "@react-three/drei";
import { Stack } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useRef } from "react";

const FloorPlanView3d = () => {
  const wSize = useWindowSize();
  const matches = useMediaQuery("(min-width: 768px)");
  const controlRef = useRef(null);
  
  return (
    <Stack width={wSize.width - (matches ? 316 : 32)} height={wSize.height - HEADER_HIGHT}>
      <Canvas camera={{ position: [5, 5, 5], fov: 25 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} />
        <Grid infiniteGrid position={[0, 0, 0]} />
        {/* <OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI / 2.1} makeDefault /> */}
        <MapControls
          ref={controlRef}
          enableDamping={false}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2.1}
          makeDefault
        />

        {/* {selectedPart ? (
          <TransformControls
            object={selectedPart}
            onObjectChange={(event) => {
              onUpdateData(event);
            }}
            mode={"rotation"}
          />
        ) : null} */}
      </Canvas>
    </Stack>
  );
};

export default FloorPlanView3d;
