import React from "react";
import LabelProperty from "../../../../Components/LabelProperty";
import CardsProperty from "../../../../Components/CardsProperty";
import { Group, ScrollArea, Select, Stack, Title } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useState } from "react";
import { useWindowSize } from "../../../../Hook";

const ModuleInformationPanel = ({ positions, actorName }) => {
  const { t } = useTranslation();
  const [position, setPosition] = useState([]);
  const [levels, setLevels] = useState([]);
  const [level, setLevel] = useState(null);
  const [title, setTitle] = useState(null);
  const [pallets, setPallets] = useState(null);
  const wSize = useWindowSize();

  function createName(arr) {
    if (!Array.isArray(arr)) {
      throw new Error("Se espera un array como argumento.");
    }

    if (arr.length === 0) {
      return "";
    }

    return arr.slice(0, -1).join("-");
  }

  const getData = () => {
    if (positions && positions.length > 0 && actorName) {

      positions.sort((a, b) => {
        return a.code.localeCompare(b.code);
      });

      let title = null;
      const levels = [];
      positions.forEach((position, index) => {
        const arr = position.code.split("-");
        if (arr) {
          const level = arr[arr.length - 1];
          levels.push({ value: index, label: level });
          if (title === null) {
            title = createName(arr);
          }
        }
      });

      setPosition(positions[0]);
      setPallets(positions[0].pallets);
      setLevels(levels);
      setLevel(0);
      setTitle(title);
    }
  };

  useEffect(() => {
    getData();
  }, [positions]);

  return (
    <ScrollArea h={wSize.height - 64}>
      <Stack spacing={"xs"} m={"xs"} pr={"xs"} w={380}>
        <Title order={4}>{title}</Title>
        <Group grow spacing={"xs"}>
          <Select
            label={t("view.floorViewer.moduleInspector.label.rackLevel")}
            data={levels}
            value={level}
            onChange={(e) => {
              setLevel(e);
              setPosition(positions[e]);
              setPallets(positions[e].pallets);
            }}
          />
        </Group>

        <Group grow spacing={"xs"}>
          <LabelProperty
            label={t("view.floorViewer.moduleInspector.label.width")}
            value={`${position?.width?.toFixed(0)} ${position?.unit}`}
          />
          <LabelProperty
            label={t("view.floorViewer.moduleInspector.label.height")}
            value={`${position?.height?.toFixed(0)} ${position?.unit}`}
          />
          <LabelProperty
            label={t("view.floorViewer.moduleInspector.label.depth")}
            value={`${position?.depth?.toFixed(0)} ${position?.unit}`}
          />
        </Group>

        <Group grow spacing={"xs"}>
          <LabelProperty label={t("view.floorViewer.moduleInspector.label.rackType")} value={position?.kind} />
          <LabelProperty label={t("view.floorViewer.moduleInspector.label.status")} value={position?.status} />
        </Group>

        {pallets && pallets.length > 0 ? (
          <CardsProperty title={t("view.floorViewer.moduleInspector.label.pallets")} pallets={pallets} />
        ) : null}
      </Stack>
    </ScrollArea>
  );
};

export default ModuleInformationPanel;
