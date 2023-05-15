import React from "react";
import {
  Burger,
  Group,
  Header,
  MediaQuery,
  useMantineTheme,
} from "@mantine/core";
import UserMenu from "./UserMenu";
import Logo from "./Logo";

export default function CustomHeader({isOpen, setIsOpen}) {
  const theme = useMantineTheme();
  return (
    <Header height={60}>
      <Group position={"apart"} align={"center"} h={60}>
        <MediaQuery largerThan="sm" styles={{ display: "none" }}>
          <Burger
            opened={isOpen}
            onClick={setIsOpen}
            size="md"
            color={theme.colors.gray[6]}
            mx="xs"
          />
        </MediaQuery>

        <Logo />

        <MediaQuery largerThan="sm" styles={{ display: "none" }}>
          <Group mx={"xs"} w={40} h={"100%"}></Group>
        </MediaQuery>

        <UserMenu/>
      </Group>
    </Header>
  );
}
