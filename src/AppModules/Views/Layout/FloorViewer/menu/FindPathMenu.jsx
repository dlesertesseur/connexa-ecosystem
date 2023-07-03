import React, { useState } from "react";
import { Button, Group, Popover, Stack, TextInput } from "@mantine/core";
import { useTranslation } from "react-i18next";

const FindPathMenu = ({ loading = false, disabled = false, onFind }) => {
  const { t } = useTranslation();
  const [opened, setOpened] = useState(false);
  const [startPos, setStartPos] = useState("");
  const [endPos, setEndPos] = useState("");

  return (
    <Popover width={200} position="bottom-start" withArrow shadow="md" opened={opened}>
      <Popover.Target>
        <Button loading={loading} disabled={disabled} size={"xs"} py={0} onClick={() => setOpened((o) => !o)}>
          {t("view.floorViewer.findRouteNenu.button")}
        </Button>
      </Popover.Target>

      <Popover.Dropdown>
        <Stack>
          <TextInput
            placeholder=""
            value={startPos}
            onChange={(event) => setStartPos(event.currentTarget.value)}
            label={t("view.floorViewer.findRouteNenu.label.startPosition")}
            withAsterisk
          />
          <TextInput
            placeholder=""
            value={endPos}
            onChange={(event) => setEndPos(event.currentTarget.value)}
            label={t("view.floorViewer.findRouteNenu.label.endPosition")}
            withAsterisk
          />

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
