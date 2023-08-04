import { Button, Center, Group, Text } from "@mantine/core";
import React from "react";
import { useNavigate } from "react-router-dom";

const DummyPage = ({ title, action }) => {
  console.log("DummyPage -> ", title);
  const navigate = useNavigate();
  const onAtion = () => {
    navigate(action);
  };
  return (
    <Group p={"xs"} bg={"lime"} spacing={"xs"} position="apart">
      <Text weight={700} size={"md"}>{title}</Text>
      {action ? (
        <Button onClick={onAtion}>
          <Text>Action</Text>
        </Button>
      ) : null}
    </Group>
  );
};

export default DummyPage;
