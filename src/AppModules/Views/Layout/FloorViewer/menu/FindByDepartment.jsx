import { Stack, Button, Group, HueSlider, Select, ColorPicker } from "@mantine/core";
import React from "react";
import { useContext } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FloorViewerStateContext } from "../Context";

const FindByDepartment = ({ code }) => {
  const { t } = useTranslation();
  const { showData } = useContext(FloorViewerStateContext);

  const [color, onChange] = useState("#ff0000");
  const [department, setDepartment] = useState(null);

  return (
    <Stack>
      <Select
        label={t("view.floorViewer.option.itemByDepartament.label")}
        placeholder={t("view.floorViewer.option.itemByDepartament.placeholder")}
        data={[
          { value: "AL", label: "ALMACEN" },
          { value: "BE", label: "BEBIDAS CON ALCHOOL" },
          { value: "BS", label: "BEBIDAS SIN ALCHOOL" },
          { value: "LI", label: "LIMPIEZA" },
          { value: "PF", label: "PERFUMERIA" },
          { value: "EL", label: "ELECTRO" },
        ]}
        value={department}
        onChange={setDepartment}
      />

      <ColorPicker format="hex" value={color} onChange={onChange} fullWidth withPicker={true} />

      <Group position="right">
        <Button
          size="xs"
          disabled={!department}
          onClick={(evt) => {
            showData(code, department, color);
          }}
        >
          {t("button.accept")}
        </Button>
      </Group>
    </Stack>
  );
};

export default FindByDepartment;
