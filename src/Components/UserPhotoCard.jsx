import React from "react";
import { Button, Card, Group, Image, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";

const UserPhotoCard = ({ imageId, src, alt, name, onDelete, height = 160 }) => {
  const { t } = useTranslation();

  return (
    <Card>
      <Card.Section >
        <Image maw={height} mx="auto" radius="xs" src={src} alt={alt} />
      </Card.Section>

      <Card.Section p={"xs"}>
        <Text weight={500}>{name}</Text>
      </Card.Section>

      <Card.Section >
        <Group position="right">
          <Button
            color="blue"
            mt="xs"
            onClick={() => {
              onDelete(imageId);
            }}
          >
            {t("button.deleteImage")}
          </Button>
        </Group>
      </Card.Section>
    </Card>
  );
};

export default UserPhotoCard;
