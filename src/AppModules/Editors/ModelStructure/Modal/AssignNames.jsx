import React from "react";
import { Accordion, Button, Checkbox, Group, JsonInput, Modal, SegmentedControl, Stack } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useState } from "react";
import { IconPlus } from "@tabler/icons-react";

const AssignNames = ({ opened, close, structure }) => {
  const { t } = useTranslation();
  const [rows, setRows] = useState([]);

  // useEffect(() => {
  //   if (structure) {
  //     const modules = structure.modules;

  //     modules.sort((a,b) => a.number - b.number)

  //     const rows = modules.map((module) => {
  //       const name = t("editor.modelStructure.label.module") + "-" + module.number;
  //       const parts = module.parts;
  //       parts.sort((a,b) => a.positiony - b.positiony);

  //       const content = parts.map((part) => {
  //         return (
  //           <tr key={part.id}>
  //             <td>{part.name}</td>
  //             <td>{part.type}</td>
  //           </tr>
  //         );
  //       });

  //       return (

  //       );
  //     });

  //     setRows(rows);
  //   }
  // }, [structure]);

  return (
    <Modal opened={opened} onClose={close} title={t("editor.modelStructure.title.assignNames")}>
      <Stack justify="flex-start">
        <JsonInput
          label={t("label.jsonData")}
          placeholder={t("placeholder.jsonData")}
          validationError={t("error.jsonData")}
          formatOnBlur
          minRows={14}
        />
        <Checkbox label={t("label.reverseAssignment")} />
        <Group position="right">
          <Button
            onClick={() => {
              close();
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
