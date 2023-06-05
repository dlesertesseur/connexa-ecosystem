import React from "react";
import { Modal, Tabs } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { AbmStateContext } from "./Context";
import { IconBuildingWarehouse, IconShoppingCart } from "@tabler/icons-react";
import { ShelvesBuilder } from "./ShelvesBuilder";
import { RackBuilder } from "./RackBuilder";
import { STRUCTURE_TYPE_RACK, STRUCTURE_TYPE_SHELVING } from "../../../Constants/structures";

const StructureBuilderModal = ({ opened, close }) => {
  const { t } = useTranslation();
  const { onCreate } = useContext(AbmStateContext);

  return (
    <Modal opened={opened} onClose={close} title={t("editor.modelStructure.title.create")}>
      <Tabs variant="default" defaultValue="shelves">
        <Tabs.List>
          <Tabs.Tab value="shelves" icon={<IconShoppingCart size={20} />}>
            {t("editor.modelStructure.items.1")}
          </Tabs.Tab>
          <Tabs.Tab value="racks" icon={<IconBuildingWarehouse size={20} />}>
            {t("editor.modelStructure.items.2")}
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="shelves" pt="xs">
          <ShelvesBuilder
            onCreate={(values) => {
              close();
              onCreate(values, STRUCTURE_TYPE_SHELVING);
            }}
          />
        </Tabs.Panel>

        <Tabs.Panel value="racks" pt="xs">
          <RackBuilder
            onCreate={(values) => {
              close();
              onCreate(values, STRUCTURE_TYPE_RACK);
            }}
          />
        </Tabs.Panel>
      </Tabs>
    </Modal>
  );
};

export default StructureBuilderModal;
