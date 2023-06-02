import { Button, Group, Modal, SegmentedControl, TextInput } from "@mantine/core";

import React, { useEffect, useState } from "react";
import { CreateRackPage } from "./CreateRackPage";
import { useDisclosure } from "@mantine/hooks";
import { useTranslation } from "react-i18next";

const EditorToolbar = ({ structure, setTransformOption, transformOption, onCreate }) => {
  const [structureName, setStructureName] = useState(null);
  const [opened, { open, close }] = useDisclosure(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (structure) {
      setStructureName(structure.name);
    }
  }, [structure]);

  return (
    <Group>
      {structureName ? <TextInput size="xs" value={structureName} onChange={setStructureName}></TextInput> : null}
      
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
          { label: "Translate", value: "translate" },
          { label: "Rotate", value: "rotate" },
          { label: "Scale", value: "scale" },
        ]}
      />

      <Modal opened={opened} onClose={close} title={t("editor.modelStructure.title.create")}>
        <CreateRackPage
          onCreate={(values) => {
            close();
            onCreate(values);
          }}
        />
      </Modal>
    </Group>
  );
};

export default EditorToolbar;
