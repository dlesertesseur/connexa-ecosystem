import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, GizmoHelper, GizmoViewport, TransformControls } from "@react-three/drei";
import { useEffect, useState } from "react";
import { buildModelStructure } from "../../../Components/Builder3d";

const Editor = ({structure, transforOption}) => {
  const [model, setModel] = useState(null);
  const [selectedPart, setSelectedPart] = useState(null);

  const onSelect = (event) => {
    if(event.intersections && event.intersections.length > 0){
      const obj = event.intersections[0].object;
      setSelectedPart(obj);
    }
  }

  useEffect(() => {
    if (structure) {
      const ret = buildModelStructure(modelStructure, onSelect);
      setModel(ret);
    }
  }, [structure]);

  useEffect(() => {
    if(selectedPart){
      console.log("selectedPart.uuid ->", selectedPart)
    }
  }, [selectedPart]);

  return (
    <Canvas camera={{ position: [5, 5, 5], fov: 25 }}>
      <scene>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} />
        <Grid infiniteGrid position={[0, 0, 0]} />
        <axesHelper args={[10]} />
        {model}
      </scene>
      <OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI / 2.1} makeDefault/>

      {selectedPart ? <TransformControls object={selectedPart} mode={transforOption} /> : null}
      
    </Canvas>
  );
};

export default Editor;
