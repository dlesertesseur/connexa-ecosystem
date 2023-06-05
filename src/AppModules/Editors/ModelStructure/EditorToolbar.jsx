import React, { useEffect } from "react";
import { Button, Group, SegmentedControl, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { AbmStateContext } from "./Context";
import StructureBuilderModal from "./StructureBuilderModal";

const EditorToolbar = ({ structure, setTransformOption, transformOption, editing }) => {
  const { structureName, setStructureName, modelStructure } = useContext(AbmStateContext);
  const [opened, { open, close }] = useDisclosure(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (structure) {
      setStructureName(structure.name);
    }
  }, [structure]);

  return (
    <Group>
      {structureName !== null ? (
        <TextInput
          size="xs"
          value={structureName}
          onChange={(event) => setStructureName(event.currentTarget.value)}
        ></TextInput>
      ) : null}

      {!editing ? (
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
      <StructureBuilderModal opened={opened} close={close} />
    </Group>
  );
};

export default EditorToolbar;
