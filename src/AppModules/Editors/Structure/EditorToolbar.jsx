import React, { useEffect } from "react";
import { ActionIcon, Group } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { AbmStateContext } from "./Context";
import { IconBox, IconCone, IconSphere } from "@tabler/icons-react";
import { PRIMITIVE_BOX, PRIMITIVE_CONE, PRIMITIVE_SPHERE } from "../../../Constants/structures";

const EditorToolbar = () => {
  const { onCreate } = useContext(AbmStateContext);
  const { t } = useTranslation();

  // useEffect(() => {
  //   if (structure) {
  //     setStructureName(structure.name);
  //   }
  // }, [structure]);

  return (
    <Group spacing={"xs"}>
      <ActionIcon variant="filled" color="blue" onClick={() => { onCreate(PRIMITIVE_BOX)}}>
        <IconBox size={16} />
      </ActionIcon>
      <ActionIcon variant="filled" color="blue" onClick={() => { onCreate(PRIMITIVE_SPHERE)}}>
        <IconSphere size={16} />
      </ActionIcon>
      <ActionIcon variant="filled" color="blue" onClick={() => { onCreate(PRIMITIVE_CONE)}}>
        <IconCone size={16} />
      </ActionIcon>
    </Group>
  );
};

export default EditorToolbar;
