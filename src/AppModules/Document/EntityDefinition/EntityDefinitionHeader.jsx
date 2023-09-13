import React from "react";
import { Anchor, Breadcrumbs, Group, Paper, Skeleton, Stack, Text } from "@mantine/core";

const EntityDefinitionHeader = ({ entityDefinition, text }) => {
  const items = [
    { title: entityDefinition?.name, href: null },
    { title: text, href: null },
  ].map((item, index) => <Text key={index}>{item.title}</Text>);

  return (
    <Group p={0}>
      {entityDefinition ? (
        <Group position="left">
          <Breadcrumbs>{items}</Breadcrumbs>
        </Group>
      ) : (
        <Skeleton visible={true} h={"100%"}></Skeleton>
      )}
    </Group>
  );
};

export default EntityDefinitionHeader;
