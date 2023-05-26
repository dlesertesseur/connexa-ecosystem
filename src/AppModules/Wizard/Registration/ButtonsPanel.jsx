import React from "react";
import { Group, Button } from "@mantine/core";
import { useTranslation } from "react-i18next";

const ButtonsPanel = ({ onCancel, nextStep, prevStep, onCreate }) => {
  const { t } = useTranslation();
  return (
    <Group position="apart" py={"xs"}>
      <Button onClick={onCancel}>{t("button.cancel")}</Button>

      <Group>
        {prevStep ? (
          <Button variant="default" onClick={prevStep}>
            {t("button.backStep")}
          </Button>
        ) : null}

        {nextStep ? (
          <Button onClick={nextStep}>{t("button.nextStep")}</Button>
        ) : null}
        {onCreate ? (
          <Button onClick={onCreate}>{t("button.create")}</Button>
        ) : null}
      </Group>
    </Group>
  );
};

export default ButtonsPanel;
