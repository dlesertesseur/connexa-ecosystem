import React from "react";
import ImportarionCard from "./ImportarionCard";
import { Button, Divider, Flex, Group, ScrollArea, Stack, Text, Title } from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { HEADER_HIGHT } from "../../../../Constants";
import { useViewportSize } from "@mantine/hooks";

const ImportationsPanel = ({ statuses }) => {
  const { height } = useViewportSize();
  const { t } = useTranslation();
  const [refresh, setRefresh] = useState(null);

  const onRefresh = (e) => {
    setRefresh(new Date());
  };

  return (
    <Stack spacing={0}>
      <Group position="apart" mb={"md"}>

        <Group position="left" align="center">
          <Title order={5}>{`${t("importations.label.lastUpdate")} :`}</Title>
          <Text align="center" c="dimmed" size="xs" tt="uppercase" fw={500} mr={"xl"}>
            {"2023/11/28 08:00"}
          </Text>

          <Title order={5}>{`${t("importations.label.nextUpdate")} :`}</Title>
          <Text align="center" c="dimmed" size="xs" tt="uppercase" fw={500}>
            {"2023/11/28 16:00"}
          </Text>
        </Group>

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
