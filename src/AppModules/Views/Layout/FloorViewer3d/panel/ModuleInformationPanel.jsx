import React from "react";
import LabelProperty from "../../../../../Components/LabelProperty";
import CardsProperty from "../../../../../Components/CardsProperty";
import { Group, ScrollArea, Stack, Title } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useState } from "react";
import { useWindowSize } from "../../../../../Hook";
import { useContext } from "react";
import { FloorView3dContext } from "../Context";
import { getLocations } from "../../../../../DataAccess/Wms";

const ModuleInformationPanel = ({ positionName }) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState(null);
  const [pallets, setPallets] = useState(null);
  const [position, setPosition] = useState(null);
  const wSize = useWindowSize();

  const { wmsApiToken } = useContext(FloorView3dContext);

  const getData = async () => {
    if (positionName) {
      setTitle(positionName);
      if (wmsApiToken) {
        const filterData = `code_like=${positionName}`;
        const position = await getLocations({ token: wmsApiToken, filter: filterData });
        setPosition(position[0]);
        setPallets(position[0].pallets);
      } else {
        setErrorMessage(t("errors.wmsApiTokenNotFound"));
      }
    }
  };

  useEffect(() => {
    getData();
  }, [positionName]);

  return (
    <ScrollArea h={wSize.height - 64}>
      <Stack spacing={"xs"} m={"xs"} pr={"xs"} w={380}>
        <Title order={4}>{title}</Title>

        {position ? (
          <Group grow spacing={"xs"}>
            <LabelProperty
              label={t("view.floorViewer.moduleInspector.label.width")}
              value={`${position?.width} ${position?.unit}`}
            />
            <LabelProperty
              label={t("view.floorViewer.moduleInspector.label.height")}
              value={`${position?.height} ${position?.unit}`}
            />
            <LabelProperty
              label={t("view.floorViewer.moduleInspector.label.depth")}
              value={`${position?.depth} ${position?.unit}`}
            />
          </Group>
        ) : null}

        {position ? (
          <Group grow spacing={"xs"}>
            <LabelProperty label={t("view.floorViewer.moduleInspector.label.rackType")} value={position?.kind} />
            <LabelProperty label={t("view.floorViewer.moduleInspector.label.status")} value={position?.status} />
          </Group>
        ) : null}

        {pallets && pallets.length > 0 ? (
          <CardsProperty title={t("view.floorViewer.moduleInspector.label.pallets")} pallets={pallets} />
        ) : null}
      </Stack>
    </ScrollArea>
  );
};

export default ModuleInformationPanel;
