import React from "react";
import { Button, Group, Modal, Stack, TextInput } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useEffect } from "react";

const NodePropertiesModal = ({ opened, close, node, setSelectedNode  }) => {
  const { t } = useTranslation();
  const [name, setName] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (node) {
      setName(node.attrs.name);
    }
  }, [node]);

  const onUpdate = async () => {
    node.attrs.name = name;
    const userData = node.attrs.userData;
    if (userData) {
      userData.name = name;
      setSelectedNode({...node});
    }
    close();
  };

  return (
    <Modal opened={opened} onClose={close} title={t("crud.floorGrapthEditor.label.nodeProperties")}>
      <Stack>
        <TextInput
          w={"100%"}
          label={t("crud.floorGrapthEditor.label.name")}
          value={name}
          onChange={(event) => setName(event.currentTarget.value)}
        />
      </Stack>
      <Group position="right" mt={"xs"}>
        <Button
          onClick={() => {
            onUpdate();
          }}
        >
          {t("button.accept")}
        </Button>
        <Button
          onClick={() => {
            close();
          }}
        >
          {t("button.close")}
        </Button>
      </Group>
    </Modal>
  );
};

export default NodePropertiesModal;
