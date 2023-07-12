import React, { useState } from "react";
import { ActionIcon, Button, Group, Popover, Stack, TextInput } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { FloorViewerStateContext } from "../Context";
import { useEffect } from "react";
import { IconTrash } from "@tabler/icons-react";

const FindPathMenu = ({ loading = false, disabled = false, onFind }) => {
  const { t } = useTranslation();
  const { actorName } = useContext(FloorViewerStateContext);
  const [opened, setOpened] = useState(false);
  const [startPos, setStartPos] = useState("");
  const [endPos, setEndPos] = useState("");

  useEffect(() => {
    if (opened) {
      if (startPos) {
        setEndPos(actorName);
      } else {
        setStartPos(actorName);
      }
    }
  }, [actorName]);

  return (
    <Popover position="bottom-start" withArrow shadow="md" opened={opened}>
      <Popover.Target>
        <Button loading={loading} disabled={disabled} size={"xs"} py={0} onClick={() => setOpened((o) => !o)}>
          {t("view.floorViewer.findRouteNenu.button")}
        </Button>
      </Popover.Target>

      <Popover.Dropdown>
        <Stack>
          <Group align="flex-end" spacing={"xs"}>
            <Group>
              <TextInput
                size="xs"
                placeholder=""
                value={startPos}
                onChange={(event) => setStartPos(event.currentTarget.value)}
                label={t("view.floorViewer.findRouteNenu.label.startPosition")}
                withAsterisk
              />
            </Group>
            <Group>
              <ActionIcon color="blue" variant="outline" onClick={() => {setStartPos("")}}>
                <IconTrash size={16} />
              </ActionIcon>
            </Group>
          </Group>

          <Group align="flex-end" spacing={"xs"}>
            <Group>
              <TextInput
                size="xs"
                placeholder=""
                value={endPos}
                onChange={(event) => setEndPos(event.currentTarget.value)}
                label={t("view.floorViewer.findRouteNenu.label.endPosition")}
                withAsterisk
              />
            </Group>
            <Group>
              <ActionIcon color="blue" variant="outline" onClick={() => {setEndPos("")}}>
                <IconTrash size={16} />
              </ActionIcon>
            </Group>
          </Group>

          <Group position="right">
            <Button
              loading={loading}
              disabled={disabled}
              size={"xs"}
              py={0}
              onClick={(e) => {
                setOpened(false);
                onFind(startPos, endPos);
              }}
            >
              {t("view.floorViewer.findRouteNenu.label.find")}
            </Button>
          </Group>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
};

export default FindPathMenu;
