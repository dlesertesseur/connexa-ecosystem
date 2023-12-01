import React from "react";
import { ActionIcon, Button, Group, Indicator, Popover, Select, Stack } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconFilter } from "@tabler/icons-react";
import { useImportationContext } from "./ImportationContextProvider";
import { useState } from "react";
import { useEffect } from "react";

const ImportationFilterDialog = ({ opened, open, close, businessObjectives, analysts, onRefresh }) => {
  const { t } = useTranslation();

  const { businessObjectiveSelected, setBusinessObjectiveSelected, analystSelected, setAnalystSelected } =
    useImportationContext();

  const [businessObjectiveSelectedLocal, setBusinessObjectiveSelectedLocal] = useState(null);
  const [analystSelectedLocal, setAnalystSelectedLocal] = useState(null);

  useEffect(() => {
    setBusinessObjectiveSelectedLocal(businessObjectiveSelected);
    setAnalystSelectedLocal(analystSelected);
  }, [opened]);

  const onAccept = () => {
    setBusinessObjectiveSelected(businessObjectiveSelectedLocal);
    setAnalystSelected(analystSelectedLocal);
    onRefresh();
    close();
  };

  const disabledIndicator = () => {
    let ret = true;

    if (businessObjectiveSelected !== t("importations.label.all") || analystSelected !== t("importations.label.all")) {
      ret = false;
    }

    return ret;
  };

  return (
    <Popover width={400} position="bottom-start" withArrow shadow="md" opened={opened}>
      <Popover.Target>
        <Indicator offset={2} size={14} position={"top-end"} color={"red"} withBorder disabled={disabledIndicator()}>
          <ActionIcon variant="filled" color="blue" onClick={open}>
            <IconFilter size={16} />
          </ActionIcon>
        </Indicator>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack>
          <Select
            label={t("importations.label.businessObjective")}
            searchable
            data={businessObjectives}
            value={businessObjectiveSelectedLocal}
            onChange={setBusinessObjectiveSelectedLocal}
          />

          <Select
            label={t("importations.label.analyst")}
            searchable
            data={analysts}
            value={analystSelectedLocal}
            onChange={setAnalystSelectedLocal}
          />

          <Group position="right" mt={"xs"}>
            <Button onClick={onAccept}>{t("button.accept")}</Button>
            <Button onClick={close}>{t("button.close")}</Button>
          </Group>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
};

export default ImportationFilterDialog;
