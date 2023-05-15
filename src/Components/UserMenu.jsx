import { Avatar, Flex, Group, MediaQuery, Menu, Text, UnstyledButton, useMantineTheme } from "@mantine/core";
import { IconChevronDown, IconChevronUp, IconLogout, IconUser } from "@tabler/icons-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../Features/Auth";

const fontColor = "black";
const UserMenu = ({ compact = true }) => {
  const { user } = useSelector((state) => state.auth.value);
  const { t } = useTranslation();
  const theme = useMantineTheme();
  const dispatch = useDispatch();
  const [userMenuOpened, setUserMenuOpened] = useState(false);

  const getInitials = (user) => {
    const name = user.firstName + " " + user.lastName;

    let rgx = new RegExp(/(\p{L}{1})\p{L}+/, "gu");
    let initials = [...name.matchAll(rgx)] || [];

    initials = ((initials.shift()?.[1] || "") + (initials.pop()?.[1] || "")).toUpperCase();

    return initials;
  };

  const onLogout = () => {
    dispatch(logOut());
  };

  return (
    // <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
      <Menu
        opened={userMenuOpened}
        position="bottom-end"
        onClose={() => setUserMenuOpened(false)}
        onOpen={() => setUserMenuOpened(true)}
        withinPortal
        withArrow
      >
        <Menu.Target>
          <UnstyledButton
            bg={theme.colors.gray[2]}
            mx={"xs"}
            py={3}
            sx={{ borderTopLeftRadius: 36, borderBottomLeftRadius: 36, borderTopRightRadius: compact ? 6 : 36, borderBottomRightRadius: compact ? 6 : 36}}
          >
            <Group spacing={"xs"}>
              {user.image ? (
                <Avatar size={"md"} radius="xl" ml={3} mr={compact ? 3 : 0} src={user.image} />
              ) : (
                <Avatar size={"md"} radius="xl" ml={3} mr={3}>
                  {getInitials(user)}
                </Avatar>
              )}

              {compact ? (
                <>
                  <Flex align="flex-start" direction="column" wrap="wrap">
                    <Text weight={500} size="sm" sx={{ lineHeight: 1, color: fontColor }} mr={3} mb={5}>
                      {user.firstName + " " + user.lastName}
                    </Text>
                    <Text weight={200} size="xs" sx={{ lineHeight: 1, color: fontColor }} mr={3}>
                      {user.role ? user.role : t("label.basicUser")}
                    </Text>
                  </Flex>

                  <Group mr={"xs"}>
                    {userMenuOpened ? <IconChevronDown size={16} /> : <IconChevronUp size={16} />}
                  </Group>
                </>
              ) : null}
            </Group>
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>{t("label.settings")}</Menu.Label>
          <Menu.Item icon={<IconUser size={16} stroke={1.5} />}>{t("userOptions.account")}</Menu.Item>
          <Menu.Item icon={<IconLogout size={16} stroke={1.5} />} onClick={onLogout}>
            {t("userOptions.logout")}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    // </MediaQuery>
  );
};

export default UserMenu;
