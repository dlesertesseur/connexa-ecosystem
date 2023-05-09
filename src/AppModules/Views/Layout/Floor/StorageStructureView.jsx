import React, { useState } from "react";
import StorageStructure from "../Model/StorageStructure";
import View2D from "../../../../Components/View2D";
import { Layer } from "react-konva";
import { useRef } from "react";
import { Stack } from "@mantine/core";

const StorageStructureView = ({
  racks,
  rack,
  actors,
  updateTime = 3000,
  pixelMeterRelation,
  editingEnabled = false,
}) => {
  const [selectedRack, setSelectedRack] = useState(null);

  // const onDblClick = (actor) => {
  //   // setOpenPlanogram(true);
  // };

  const onRackClick = (ref, rack) => {
    setSelectedRack(rack);

    if (editingEnabled) {
      const transformNode = trRef.current;
      transformNode.nodes([ref.current]);
    }
  };

  // const onOption = (event, option) => {
  //   if (option === "EngineeringIcon") {
  //     setOperatorsStatus(true);
  //   } else {
  //     setOperatorsStatus(false);
  //   }
  // };

  // function handleTransform(e) {
  //   const obj = e.target;
  //   const transform = obj.getTransform().copy();
  //   const attrs = transform.decompose();

  //   if (selectedRack) {
  //     if (selectedRack.userData !== null) {
  //       selectedRack.rotationy = attrs.rotation;
  //     }
  //   }
  // }

  const trRef = useRef();

  return (
    <>
      <Stack>
        {/* <StorageStructureViewToolbar onOption={onOption} /> */}
        <View2D>
          <Layer id="zone">
            <StorageStructure
              name={rack.name}
              modules={rack.modules}
              pixelMeterRelation={pixelMeterRelation}
              onPartClick={onRackClick}
              selectedPart={selectedRack}
              editingEnabled={editingEnabled}
            />
          </Layer>

          {/* <Layer id="centerPoint">
            <Group x={0} y={0}>
              <Line x={0} y={0} points={[-10, 0, 10, 0]} stroke="#ff0000" />
              <Line x={0} y={0} points={[0, -10, 0, 10]} stroke="#ff0000" />
            </Group>
          </Layer> */}
        </View2D>
      </Stack>

      {/* {openPlanogram ? (
        <PlanogramDialog open={openPlanogram} setOpen={setOpenPlanogram} actorName={actorSelected.nombre} />
      ) : (
        <></>
      )} */}
    </>
  );
};

export default StorageStructureView;
