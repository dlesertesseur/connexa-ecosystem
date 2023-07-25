import { Badge, Card, Center, Group, Image, Text } from "@mantine/core";
import React from "react";
import { API } from "../Constants";

const PalletCard = ({ detail }) => {
  return (
    <Card shadow="sm" padding="xs" radius="xs" withBorder>
      <Card.Section>
        <Center h={300}>
          <Image src={`${API.wms.getBaseUrlImage}${detail.image}`} fit="contain" width={160} alt="art-img" />
        </Center>
      </Card.Section>

      <Group position="apart" mt="md" mb="xs">
        <Text weight={500}>{detail.sku}</Text>
        <Badge color="green" variant="light">
          {detail.quantity}
        </Badge>
      </Group>

      <Text size="sm" color="dimmed">
        {detail.description}
      </Text>

      <Text mt="md" size="xs" color="dimmed">
        {detail.trademark}
      </Text>
    </Card>
  );
};

export default PalletCard;
