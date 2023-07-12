import React from "react";
import OptionLayerItem from "./OptionLayerItem";
import { Button, Popover, ScrollArea, Stack } from "@mantine/core";
import { useContext } from "react";
import { FloorView3dContext } from "../Context";
import { useTranslation } from "react-i18next";

const OptionsLayers = ({ disabled, children }) => {
  const { t } = useTranslation();
  const { layersOpened, setLayersOpened, loading } = useContext(FloorView3dContext);

  return (
    <Popover width={200} position="bottom-start" withArrow shadow="md" opened={layersOpened}>
      <Popover.Target>
        <Button loading={loading} disabled={disabled} size={"xs"} py={0} onClick={() => setLayersOpened((o) => !o)}>
          {t("view.floorViewer.layer.label")}
        </Button>
      </Popover.Target>

      <Popover.Dropdown>
        <Stack>
          <ScrollArea>
            {children}
          </ScrollArea>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
};

export default OptionsLayers;
