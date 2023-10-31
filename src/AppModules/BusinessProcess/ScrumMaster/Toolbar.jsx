import React from "react";
import { Button, Group, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";

const Toolbar = ({ rowSelected, onViewDiagram, onViewDocument, onViewLog, onViewSprints }) => {
  const { t } = useTranslation();

  return (
    <Group spacing={"xs"}>
      <Button disabled={!rowSelected} onClick={onViewDiagram}>
        <Text>{t("businessProcessInstances.buttons.viewDiagram")}</Text>
      </Button>

      <Button disabled={!rowSelected} onClick={onViewDocument}>
        <Text>{t("businessProcessInstances.buttons.viewDocument")}</Text>
      </Button>

      <Button disabled={!rowSelected} onClick={onViewLog}>
        <Text>{t("businessProcessInstances.buttons.viewLog")}</Text>
      </Button>

      <Button disabled={!rowSelected} onClick={onViewSprints}>
        <Text>{t("businessProcessInstances.buttons.viewSprints")}</Text>
      </Button>
    </Group>
  );
};

export default Toolbar;
