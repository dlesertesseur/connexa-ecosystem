import { Card, Group, Image, Text } from "@mantine/core";
import React from "react";

const PhotoCard = ({ src, alt, name, height = 160 }) => {
  return (
    <>
      <Card withBorder>
        <Card.Section p={"xl"}>
          <Image radius="xs" src={src} alt={alt} height={height} fit="contain"/>
        </Card.Section>

        {name ? (
          <Group position="apart" mt="md" mb="xs">
            <Text weight={500}>{name}</Text>
          </Group>
        ) : null}
      </Card>
    </>
  );
};

export default PhotoCard;
