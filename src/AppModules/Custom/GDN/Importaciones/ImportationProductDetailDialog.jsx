import { Badge, Button, Card, Group, Image, Modal, Text } from "@mantine/core";
import React from "react";
import { API } from "../../../../Constants";

const ImportationProductDetailDialog = ({ title, open, setOpen, product }) => {
  return (
    <Modal
      opened={open}
      onClose={() => {
        setOpen(false);
      }}
      title={title}
      centered
    >
      <Card >
        <Card.Section>
          <Image
            src={`${API.productImages.baseUrl}${product?.image}`}
            alt={product?.upc}
          />
        </Card.Section>

        <Group position="apart" mt="md" mb="xs">
          <Text weight={500}>{product?.descripcion}</Text>
          <Badge color="pink" variant="light">
          {product?.tipo}
          </Badge>
        </Group>

        <Text size="sm" color="dimmed">
        {product?.upc}
        </Text>
      </Card>
    </Modal>
  );
};

export default ImportationProductDetailDialog;
