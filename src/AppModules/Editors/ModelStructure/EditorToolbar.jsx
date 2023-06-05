import React, { useEffect } from "react";
import { Button, Group, Menu, SegmentedControl, TextInput } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { AbmStateContext } from "./Context";
import { IconBuildingWarehouse, IconShoppingCart } from "@tabler/icons-react";
import { useState } from "react";
import { ShelvesBuilder } from "./builders/ShelvesBuilder";
import { RackBuilder } from "./builders/RackBuilder";
import { BasicRackBuilder } from "./builders/BasicRackBuilder";

const EditorToolbar = ({ structure, setTransformOption, transformOption, editing }) => {
  const { structureName, setStructureName } = useContext(AbmStateContext);

  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);

  const { t } = useTranslation();

  useEffect(() => {
    if (structure) {
      setStructureName(structure.name);
    }
  }, [structure]);

  const rackingMenu = (
    <Menu shadow="md" position="bottom-start" withArrow arrowPosition="center">
      <Menu.Target>
        <Button size="xs">{t("editor.modelStructure.title.racking")}</Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          icon={<IconBuildingWarehouse size={16} />}
          onClick={() => {
            setOpen2(true);
          }}
        >
          {t("editor.modelStructure.items.racking.basic")}
        </Menu.Item>
        <Menu.Item
          icon={<IconBuildingWarehouse size={16} />}
          onClick={() => {
            setOpen1(true);
          }}
        >
          {t("editor.modelStructure.items.racking.selective")}
        </Menu.Item>
        <Menu.Item icon={<IconBuildingWarehouse size={16} />}>
          {t("editor.modelStructure.items.racking.pushBack")}
        </Menu.Item>
        <Menu.Item icon={<IconBuildingWarehouse size={16} />}>
          {t("editor.modelStructure.items.racking.palletFlow")}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );

  const shelvingMenu = (
    <Menu shadow="md" position="bottom-start" withArrow arrowPosition="center">
      <Menu.Target>
        <Button size="xs">{t("editor.modelStructure.title.shelving")}</Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          icon={<IconShoppingCart size={16} />}
          onClick={() => {
            setOpen(true);
          }}
        >
          {t("editor.modelStructure.items.shelving.retailStore")}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );

  return (
    <Group>
      {structureName !== null ? (
        <TextInput
          size="xs"
          value={structureName}
          onChange={(event) => setStructureName(event.currentTarget.value)}
        ></TextInput>
      ) : null}

      {!editing ? rackingMenu : null}
      {!editing ? shelvingMenu : null}
      
      <SegmentedControl
        size="xs"
        value={transformOption}
        onChange={setTransformOption}
        data={[
          { label: t("label.translate"), value: "translate" },
          { label: t("label.rotate"), value: "rotate" },
          { label: t("label.scale"), value: "scale" },
        ]}
      />
      <ShelvesBuilder
        opened={open}
        close={() => {
          setOpen(false);
        }}
      />
      <RackBuilder
        opened={open1}
        close={() => {
          setOpen1(false);
        }}
      />

      <BasicRackBuilder
        opened={open2}
        close={() => {
          setOpen2(false);
        }}
      />
    </Group>
  );
};

export default EditorToolbar;
