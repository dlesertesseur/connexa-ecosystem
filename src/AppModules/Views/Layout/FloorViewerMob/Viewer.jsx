import React, { useState } from "react";
import View2DRef from "../../../../Components/View2dRef";
import { Stack } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";

const Viewer = ({ layouts, racks, pixelmeterrelation, markers }) => {
  const [actorId, setActorId] = useState(null);
  const { height, width } = useViewportSize();

  const onActorDblClick = (id) => {
    console.log("### Viewer ### onActorDblClick -> id:" + id);
    //inspectRack(actorId);
  };

  const onSelectActor = (id) => {
    console.log("### Viewer ### onSelectActor -> id:" + id);
    setActorId(id);
  };

  return (
    <Stack>
      <Stack
        justify="flex-start"
        spacing="0"
        sx={(theme, width) => ({
          backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[2],
          width:width,
          height:height,
          border: "solid 1px" + theme.colors.gray[3],
        })}
      >
        <View2DRef
          width={width - 10}
          height={height - 10}
          layouts={layouts}
          pixelMeterRelation={pixelmeterrelation}
          racks={racks}
          markers={markers}
          onSelect={onSelectActor}
          onDblClick={onActorDblClick}
        />

        {console.log("REPAINT ----> Viewer " + Date.now())}
      </Stack>
    </Stack>
  );
};

export default Viewer;
