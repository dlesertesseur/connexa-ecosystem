import { Button, Center, Group, Modal, SegmentedControl, Tabs, Text, TextInput } from "@mantine/core";

import React, { useEffect } from "react";
import { CreateRackPage } from "./CreateRackPage";
import { useDisclosure } from "@mantine/hooks";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { AbmStateContext } from "./Context";
import { IconMessageCircle, IconPhoto } from "@tabler/icons-react";

const EditorToolbar = ({ structure, setTransformOption, transformOption, onCreate }) => {
  const { structureName, setStructureName } = useContext(AbmStateContext);
  const [opened, { open, close }] = useDisclosure(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (structure) {
      setStructureName(structure.name);
    }
  }, [structure]);

  return (
    <Group>
      {structureName ? (
        <TextInput
          size="xs"
          value={structureName}
          onChange={(event) => setStructureName(event.currentTarget.value)}
        ></TextInput>
      ) : null}

      {onCreate ? (
        <Button size="xs" onClick={open}>
          {t("editor.modelStructure.title.create")}
        </Button>
      ) : null}

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

      <Modal opened={opened} onClose={close} title={t("editor.modelStructure.title.create")}>
        <Tabs variant="default" defaultValue="shelves">
          <Tabs.List>
            <Tabs.Tab value="shelves" icon={<IconPhoto size="0.8rem" />}>
              {t("editor.modelStructure.items.1")}
            </Tabs.Tab>
            <Tabs.Tab value="racks" icon={<IconMessageCircle size="0.8rem" />}>
              {t("editor.modelStructure.items.2")}
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="shelves" pt="xs">
            <CreateRackPage
              onCreate={(values) => {
                close();
                onCreate(values);
              }}
            />
          </Tabs.Panel>

          <Tabs.Panel value="racks" pt="xs">
            <Center>
              <Text>RACKS</Text>
            </Center>
          </Tabs.Panel>
        </Tabs>
      </Modal>
    </Group>
  );
};

export default EditorToolbar;
