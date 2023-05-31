import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { buildStructureLOD } from "../../../Components/Builder3d";

const Editor = ({ structure }) => {
  const groupRef = useRef();

  useEffect(()=>{
    if(structure){

      console.log("Editor structure -> ", structure);
      buildStructureLOD(groupRef.current, structure)
    }
  },[structure])

  return (
    <Canvas camera={{ position: [5, 5, 5], fov: 25 }}>
      <scene ref={groupRef}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} />
        <Grid infiniteGrid position={[0, 0, 0]} />
        <axesHelper args={[10]} />
      </scene>

      <OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI / 2.1} />
    </Canvas>
  );
};

export default Editor;
