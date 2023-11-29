import React from "react";
import ImportarionCard from "./ImportarionCard";
import { Button, Flex, Group, ScrollArea, Stack, Text } from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { HEADER_HIGHT } from "../../../../Constants";
import { useViewportSize } from "@mantine/hooks";
import { convertMilisegToYYYYMMDDHHMISS } from "../../../../Util";

const ImportationsPanel = ({ statuses, processControl }) => {
  const { height } = useViewportSize();
  const { t } = useTranslation();
  const [refresh, setRefresh] = useState(null);

  const onRefresh = (e) => {
    setRefresh(new Date());
  };

  return (
    <Stack spacing={0}>
      <Group position="apart" mb={"md"}>
        {processControl ? (
          <Group position="left" align="center">
            <Text size="md" weight={700}>{`${t("importations.label.lastUpdate")} :`}</Text>
            <Text align="center" c="dimmed" size="md" fw={500}>
              {convertMilisegToYYYYMMDDHHMISS(processControl?.dateAndTime)}
            </Text>
          </Group>
        ) : null}

        <Button
          leftIcon={<IconRefresh size={20} />}
          onClick={(e) => {
            onRefresh(e);
          }}
        >
          {t("button.refresh")}
        </Button>
      </Group>

      <ScrollArea type="scroll" style={{ width: "100%", height: height - HEADER_HIGHT }}>
        <Flex wrap={"wrap"} gap={"xs"} justify="center">
          {statuses?.map((s) => (
            <ImportarionCard key={s} status={s} lastUpdate={refresh} />
          ))}
        </Flex>
      </ScrollArea>
    </Stack>
  );
};

export default ImportationsPanel;
