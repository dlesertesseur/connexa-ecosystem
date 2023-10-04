import React from "react";
import InstanceFormPanel from "./InstanceFormPanel";
import { Stack } from "@mantine/core";
import { useEffect } from "react";
import { findFormInstanceById } from "../../../../DataAccess/FormInstance";
import { useState } from "react";
import { useSelector } from "react-redux";

const Index = ({ task }) => {
  const { user } = useSelector((state) => state.auth.value);
  const [formId, setFormId] = useState(null);
  const [parentId, setParentId] = useState(null);

  const getData = async () => {
    const id = "d6c0f8ba-2d1f-4162-9fdf-d1d609bc56a4";
    const params = { token: user.token, id: id };
    try {
      const instanceNode = await findFormInstanceById(params);
      setFormId(instanceNode.options);
      setParentId(instanceNode.id);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Stack
      spacing={"xs"}
      justify="flex-start"
      sx={(theme) => ({
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
      })}
    >
      <InstanceFormPanel task={task} formId={formId} type={"FORM"} parentId={parentId} />
    </Stack>
  );
};

export default Index;
