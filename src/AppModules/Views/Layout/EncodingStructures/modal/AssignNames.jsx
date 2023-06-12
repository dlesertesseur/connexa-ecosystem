import React from "react";
import {
  Accordion,
  Button,
  Checkbox,
  Group,
  LoadingOverlay,
  Modal,
  ScrollArea,
  Stack,
  Table,
  Textarea,
  UnstyledButton,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { IconPlus } from "@tabler/icons-react";
import { useEffect } from "react";
import { updateRack } from "../../../../../DataAccess/Racks";

const AssignNames = ({ opened, close, structure }) => {
  const { t } = useTranslation();
  const [checked, setChecked] = useState(false);
  const [data, setData] = useState("");
  const [processing, setProcessing] = useState(false);
  const [rows, setRows] = useState([]);
  const [reloadData, setReloadData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    setData("");
    if (structure) {
      const modules = structure.modules;

      modules.sort((a, b) => a.number - b.number);

      const rows = modules.map((module) => {
        const name = t("editor.modelStructure.label.module") + "-" + module.number;
        const parts = module.parts;
        parts.sort((a, b) => a.positiony - b.positiony);

        const content = parts.map((part) => {
          return (
            <tr key={part.id ? part.id : part.key}>
              <td>
                <UnstyledButton>{part.name}</UnstyledButton>
              </td>
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
  }, [structure, reloadData]);

  const assignNames = () => {
    let arrData = data.split(/[\n\r,]+/);

    setProcessing(true);

    if (checked) {
      arrData = arrData.reverse();
    }

    const modules = structure.modules;
    let valuesIdx = 0;

    for (let index = 0; index < modules.length && index < arrData.length; index++) {
      const module = modules[index];
      const parts = module.parts;

      parts.sort((a, b) => a.positionx - b.positionx);

      for (let index = 0; index < parts.length; index++, valuesIdx++) {
        if (valuesIdx < arrData.length) {
          const part = parts[index];
          part.name = arrData[valuesIdx];
        }
      }
    }
    setProcessing(false);
    setReloadData(Date.now());
  };

  const onSave = async () => {
    const params = {
      token: user.token,
      data: modelStructure,
      siteId: site,
      floorId: floor,
    };

    setProcessing(true);

    try {
      const ret = await updateRack(params);
      if (ret.error) {
        setProcessing(false);
        setErrorMessage(ret.message);
      } else {
        setErrorMessage(null);
        setProcessing(false);
      }
    } catch (error) {
      setErrorMessage(error);
    }
    setProcessing(false);
  };

  return (
    <Modal size={"xl"} opened={opened} onClose={close} title={t("editor.modelStructure.title.assignNames")}>
      <Group position="apart">
        <Stack w={"48%"}>
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
        </Stack>
        <Stack w={"48%"}>
          <LoadingOverlay visible={processing} overlayBlur={2} />
          <Textarea
            w={"100%"}
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
        </Stack>
      </Group>
      <Group position="right" mt={"xs"}>
        <Button
          disabled={!data}
          onClick={() => {
            assignNames();
          }}
        >
          {t("button.assignNames")}
        </Button>
        <Button
          disabled={reloadData === null ? true : false}
          onClick={() => {
            close();
          }}
        >
          {t("button.save")}
        </Button>
        <Button
          onClick={() => {
            setData("");
            close();
          }}
        >
          {t("button.close")}
        </Button>
      </Group>
    </Modal>
  );
};

export default AssignNames;
