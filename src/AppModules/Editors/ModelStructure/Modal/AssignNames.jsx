import React from "react";
import {
  Accordion,
  Button,
  Checkbox,
  Group,
  JsonInput,
  LoadingOverlay,
  Modal,
  SegmentedControl,
  Stack,
  Textarea,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useState } from "react";
import { IconPlus } from "@tabler/icons-react";

const AssignNames = ({ opened, close, structure }) => {
  const { t } = useTranslation();
  const [checked, setChecked] = useState(false);
  const [data, setData] = useState("");
  const [processing, setProcessing] = useState(false);

  const assignNames = () => {
    let arrData = data.split(/[\n\r,]+/);

    setProcessing(true);
    
    if(checked){
      arrData = arrData.reverse();
    }
    
    const modules = structure.modules;
    let valuesIdx = 0;

    for (let index = 0; index < modules.length && index < arrData.length; index++) {
      const module = modules[index];
      const parts = module.parts;

      parts.sort((a,b) => a.positionx - b.positionx)

      for (let index = 0; index < parts.length; index++, valuesIdx++) {
        if (valuesIdx < arrData.length) {
          const part = parts[index];
          part.name = arrData[valuesIdx];
        }
     }
    }
    setProcessing(false);
    close();
  };

  return (
    <Modal opened={opened} onClose={close} title={t("editor.modelStructure.title.assignNames")}>
      <Stack justify="flex-start">
        <LoadingOverlay visible={processing} overlayBlur={2} />
        <Textarea
          label={t("label.informationData")}
          placeholder={t("placeholder.informationData")}
          minRows={14}
          value={data}
          onChange={(event) => setData(event.currentTarget.value)}
        />
        <Checkbox
          label={t("label.reverseAssignment")}
          checked={checked}
          onChange={(event) => setChecked(event.currentTarget.checked)}
        />
        <Group position="right">
          <Button
            disabled={!data}
            onClick={() => {
              assignNames();
            }}
          >
            {t("button.assignNames")}
          </Button>
          <Button
            onClick={() => {
              close();
            }}
          >
            {t("button.close")}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default AssignNames;
