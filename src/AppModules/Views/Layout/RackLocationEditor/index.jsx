import Editor from "./Editor";
import { useState } from "react";
import { Group } from "@mantine/core";

const DynamicApp = ({app}) => {
  const [setRack] = useState(null);

  const inspectRack = (rack) => {
    setRack(rack);
  };

  return (
    <Group display={"flex"}>
      <Editor
        inspectRack={inspectRack}
        drawCenter={false}
        app={app}
      />
    </Group>
  );
};

export default DynamicApp;
