import { Breadcrumbs, Button, Group, Skeleton, Stack, Text } from "@mantine/core";
import React from "react";
import { useTranslation } from "react-i18next";

const HeaderPanel = ({ title, businessProcessInstanceName, onBack, children }) => {
  const { t } = useTranslation();

  const items = [
    { title: businessProcessInstanceName, href: null },
    { title: title, href: null },
  ].map((item, index) => <Text key={index}>{item.title}</Text>);

  return (
    <Stack mt={"xs"} spacing={"xs"}>
      <Group position="apart">
        <Group p={0} h={32}>
          {businessProcessInstanceName ? (
            <Group position="left">
              <Breadcrumbs>{items}</Breadcrumbs>
            </Group>
          ) : (
            <Skeleton visible={true} h={"100%"}></Skeleton>
          )}
        </Group>
        <Group spacing={"xs"}>
          <Group>{children}</Group>
          <Button size="xs" onClick={onBack}>
            <Text>{t("button.back")}</Text>
          </Button>
        </Group>
      </Group>
    </Stack>
  );
};

export default HeaderPanel;
