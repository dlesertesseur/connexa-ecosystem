import { Button, Card, Group, Image, Text } from "@mantine/core";
import React from "react";
import { useTranslation } from "react-i18next";

const ImageCard = ({ imageId, src, alt, name, onDelete, height=160 }) => {
  const { t } = useTranslation();

  return (
    <>
      <Card withBorder>
        <Card.Section>
          <Image radius="xs" src={src} alt={alt} height={height} />
        </Card.Section>

        <Group position="apart" mt="md" mb="xs">
          <Text weight={500}>{name}</Text>
        </Group>

        <Group position="right">
          <Button color="blue" mt="xs" onClick={() => {onDelete(imageId)}}>
            {t("button.deleteImage")}
          </Button>
        </Group>
      </Card>
    </>
  );
};

export default ImageCard;
