import React from "react";
import { LoadingOverlay, Stack } from "@mantine/core";
import { useEffect } from "react";
import { findFormInstanceById } from "../../../../DataAccess/FormInstance";
import { useState } from "react";
import { useSelector } from "react-redux";
import { findAllBusinessProcessInstanceRelationsById } from "../../../../DataAccess/BusinessProcessInstanceRelations";
import { useTranslation } from "react-i18next";
import InstanceFormPanel from "./InstanceFormPanel";
import ResponceNotification from "../../../../Modal/ResponceNotification";

const Index = ({ task }) => {
  const { user } = useSelector((state) => state.auth.value);
  const [formId, setFormId] = useState(null);
  const [parentId, setParentId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const getData = async () => {
    setLoading(true);
    try {
      let params = { token: user.token, id: task.businessProcessInstanceId };
      const relation = await findAllBusinessProcessInstanceRelationsById(params);

      if (relation && relation.length > 0) {
        const id = relation[0].formInstanceId;
        params = { token: user.token, id: id };
        const instanceNode = await findFormInstanceById(params);

        if (instanceNode.error) {
          throw new Error(instanceNode.error);
        } else {
          setFormId(instanceNode.options);
          setParentId(instanceNode.id);
        }
      } else {
        throw new Error(t("status.error"));
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error.message);
      setFormId(null);
      setParentId(null);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Modal
      fullScreen
      opened={open}
      onClose={() => {
        close();
      }}
      title={businessProcessModel?.name}
      centered
    >
      <Stack
        spacing={"xs"}
        justify="flex-start"
        sx={(theme) => ({
          backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
        })}
      >
        <InstanceFormPanel task={task} formId={formId} type={"FORM"} parentId={parentId} />

        <LoadingOverlay visible={loading} />

        <ResponceNotification
          opened={error ? true : false}
          code={error}
          onClose={() => {
            setError(null);
          }}
          title={t("status.error")}
          text={error}
        />
      </Stack>
    </Modal>
  );
};

export default Index;
