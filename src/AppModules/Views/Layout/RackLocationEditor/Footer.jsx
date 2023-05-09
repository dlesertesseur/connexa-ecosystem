import React from "react";
import { Group, Text } from "@mantine/core";
import { TOOLBAR_HIGHT } from "../../../../Constants";

const Footer = ({ seletedObject = null , updateData = false}) => {

  // useEffect(() => {
  //   if (seletedObject) {
  //     console.log("Footer", seletedObject);
  //   }
  // }, [seletedObject, updateData]);

  return (
    <Group
      position="apart"
      px={0}
      spacing={"xs"}
      sx={(theme) => ({
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[1],
        height: TOOLBAR_HIGHT + "px",
      })}
    >
      <Group px={"xs"} spacing={"xs"}>
        <Text size="md">{seletedObject?.name}</Text>
      </Group>
    </Group>
  );
};

export default Footer;
