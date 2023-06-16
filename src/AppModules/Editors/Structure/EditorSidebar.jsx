import React from "react";
import { Button, Dialog, Group, Text, TextInput } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useWindowSize } from "../../../Hook";

const EditorSidebar = ({ open, part }) => {
  const { t } = useTranslation();
  const wSize = useWindowSize();

  return (
    <Dialog position={{ top: 190, right: 20 }} opened={open} size="lg" radius="md">
      <Text size="sm" mb="xs" weight={500}>
        {part?.userData.name}
      </Text>

      <Group grow position="apart" align="center">
        <TextInput label={"PosX"} placeholder="" value={part?.userData.positionx}/>
        <TextInput label={"PosY"} placeholder="" value={part?.userData.positiony}/>
        <TextInput label={"PosZ"} placeholder="" value={part?.userData.positionz}/>
      </Group>

      <Group position="right" mt={"xs"}>
        <Button onClick={close}>Subscribe</Button>
      </Group>
    </Dialog>
  );
};

export default EditorSidebar;
