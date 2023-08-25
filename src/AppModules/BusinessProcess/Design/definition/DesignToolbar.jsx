import React from "react";
import { ActionIcon, Button, Group, Stack, Text } from "@mantine/core";
import { IconDeviceFloppy, IconEdit, IconEditOff } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { DesignerStateContext } from "../Context";

const DesignToolbar = ({onSave}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {editing, setEditing} = useContext(DesignerStateContext);

  const onBack = () => {
    navigate("../");
  };

  return (
    <Stack spacing={"xs"}>
      <Group position="apart" spacing={"xs"}>
        <Group spacing={"xs"}>
          <ActionIcon color="blue" variant="filled" onClick={() => {
              onSave();
            }}>
            <IconDeviceFloppy size="20" />
          </ActionIcon>

          <ActionIcon
            color="blue"
            variant="filled"
            onClick={() => {
              setEditing(!editing);
            }}
          >
            {editing ? <IconEdit size="20" /> : <IconEditOff size="20" />}
          </ActionIcon>
        </Group>
        <Group>
          <Button size="xs" onClick={onBack}>
            <Text>{t("button.back")}</Text>
          </Button>
        </Group>
      </Group>
    </Stack>
  );
};

export default DesignToolbar;
