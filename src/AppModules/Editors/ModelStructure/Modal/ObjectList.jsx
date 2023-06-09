import { Accordion, Button, Group, Modal, ScrollArea, Stack, Table, UnstyledButton } from "@mantine/core";
import React from "react";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useState } from "react";
import { IconPlus } from "@tabler/icons-react";

const ObjectList = ({ opened, close, structure }) => {
  const { t } = useTranslation();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (structure) {
      const modules = structure.modules;
      
      modules.sort((a,b) => a.number - b.number)

      const rows = modules.map((module) => {
        const name = t("editor.modelStructure.label.module") + "-" + module.number;
        const parts = module.parts;
        parts.sort((a,b) => a.positiony - b.positiony);

        const content = parts.map((part) => {
          return (
            <tr key={part.id ? part.id : part.key}>
              <td><UnstyledButton>{part.name}</UnstyledButton></td>
              <td>{`${part.dimensionx.toFixed(2)}m`}</td>
              <td>{`${part.dimensiony.toFixed(2)}m`}</td>
              <td>{`${part.dimensionz.toFixed(2)}m`}</td>
            </tr>
          );
        });

        return (
          <Accordion.Item value={name} key={module.id ? module.id : module.key}>
            <Accordion.Control>{name}</Accordion.Control>
            <Accordion.Panel>
              <Table striped highlightOnHover withBorder withColumnBorders>
                <thead>
                  <tr>
                    <th>{t("editor.modelStructure.label.name")}</th>
                    <th>{t("editor.modelStructure.label.dimx")}</th>
                    <th>{t("editor.modelStructure.label.dimy")}</th>
                    <th>{t("editor.modelStructure.label.dimz")}</th>
                  </tr>
                </thead>
                <tbody>{content}</tbody>
              </Table>
            </Accordion.Panel>
          </Accordion.Item>
        );
      });

      setRows(rows);
    }
  }, [structure]);

  return (
    <Modal opened={opened} onClose={close} title={t("editor.modelStructure.title.objectList")}>
      <Stack>
        <ScrollArea h={400}>
          <Accordion
            chevron={<IconPlus size={16} />}
            styles={{
              chevron: {
                "&[data-rotate]": {
                  transform: "rotate(45deg)",
                },
              },
            }}
          >
            {rows}
          </Accordion>
        </ScrollArea>

        <Group position="right">
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

export default ObjectList;
