import React from "react";
import UserButton from "./UserButton";
import LanguageSelector from "./LanguageSelector";
import { Group, ActionIcon, useMantineColorScheme, Image } from "@mantine/core";
import { IconSun, IconMoonStars } from "@tabler/icons";

export default function CustomHeader() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  return (
    <Group position="apart" align={"center"} sx={{ width: "100%" }}>
      <Group>
        <div style={{ width: 240, marginLeft: "auto", marginRight: "auto" }}>
          <Image
            radius="xs"
            src={process.env.PUBLIC_URL + '/images/connexa_logo.png'}
            alt="logo"
          />
        </div>

        {/* <Title
          align="center"
          sx={(theme) => ({
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            fontWeight: 900,
          })}
        >
          {t("main.title")}
        </Title> */}

      </Group>
      <Group>
        <UserButton />
        <LanguageSelector />
        <ActionIcon variant="default" onClick={() => toggleColorScheme()} size={36}>
          {colorScheme === "dark" ? <IconSun size={16} /> : <IconMoonStars size={16} />}
        </ActionIcon>
      </Group>
    </Group>
  );
}
