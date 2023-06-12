import React from "react";
import { Button, Checkbox, Group, LoadingOverlay, Modal, Stack, Textarea } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useEffect } from "react";
import { updateRack } from "../../../../../DataAccess/Racks";
import { useSelector } from "react-redux";
import { useContext } from "react";
import { FloorViewerStateContext } from "../Context";

const AssignNames = ({ opened, close, structure }) => {
  const { t } = useTranslation();
  const [checked, setChecked] = useState(false);
  const [data, setData] = useState("");
  const [processing, setProcessing] = useState(false);
  const [reloadData, setReloadData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const { user } = useSelector((state) => state.auth.value);
  const { siteId, floorId } = useContext(FloorViewerStateContext);

  useEffect(() => {
    if (structure) {
      const modules = structure.modules;
      let positions = "";
      modules.sort((a, b) => a.number - b.number);

      modules.forEach((module, moduleIdx) => {
        const parts = module.parts;
        parts.sort((a, b) => a.positiony - b.positiony);

        parts.forEach((part, partIdx) => {
          positions += part.name;
          if(moduleIdx < (modules.length-1)){
            positions += "\n";
          }
          else{
            if(partIdx < (parts.length-1)){
              positions += "\n";
            }
          }
        });
      });

      setData(positions);
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
      data: structure,
      siteId: siteId,
      floorId: floorId,
    };

    setProcessing(true);

    assignNames();

    try {
      const ret = await updateRack(params);
      if (ret.error) {
        setProcessing(false);
        setErrorMessage(ret.message);
      } else {
        setErrorMessage(null);
        setProcessing(false);
        close();
      }
    } catch (error) {
      setErrorMessage(error);
    }
    setProcessing(false);
  };

  return (
    <Modal opened={opened} onClose={close} title={t("editor.modelStructure.title.assignNames")}>
      <Stack>
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
      <Group position="right" mt={"xs"}>
        <Button
          onClick={() => {
            onSave();
          }}
        >
          {t("button.save")}
        </Button>
        <Button
          onClick={() => {
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
