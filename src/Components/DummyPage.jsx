import { Button, Container, Group, Stack } from "@mantine/core";
import { useNavigate } from "react-router-dom";

import React from "react";

const DummyPage = ({ title, description, back = "/menu" }) => {
  const navigate = useNavigate();

  return (
    <Stack
      sx={(theme) => ({
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.green[2],
        height: "100%",
      })}
    >
      <Group position="left" spacing={"xs"}>
        <Container>
          <h2>{title}</h2>
          <h4>{description}</h4>
        </Container>
      </Group>

      <Group position="left" spacing={"xs"}>
        <Container>
          <Button
            onClick={(event) => {
              navigate(back);
            }}
          >
            to Menu
          </Button>
        </Container>
      </Group>
    </Stack>
  );
};

export default DummyPage;
