import React from "react";
import { Burger, Group, Header, MediaQuery, useMantineTheme } from "@mantine/core";
import UserMenu from "./UserMenu";
import Logo from "./Logo";
import { useMediaQuery } from "@mantine/hooks";

export default function CustomHeader({ isOpen, setIsOpen }) {
  const theme = useMantineTheme();
  const matches = useMediaQuery('(min-width: 48em)');
  return (
    <Header height={60}>
      <Group position={"apart"} align={"center"} h={60}>
        <MediaQuery largerThan="sm" styles={{ display: "none" }}>
          <Burger opened={isOpen} onClick={setIsOpen} size="md" color={theme.colors.gray[6]} mx="xs" />
        </MediaQuery>

        <Logo width={230}/>

         <UserMenu compact={matches} />
      </Group>
    </Header>
  );
}
