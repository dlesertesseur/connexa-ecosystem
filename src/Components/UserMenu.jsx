import {
  Avatar,
  Flex,
  Group,
  MediaQuery,
  Menu,
  Text,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import {
  IconChevronDown,
  IconChevronUp,
  IconLogout,
  IconSettings,
} from "@tabler/icons-react";
import { useState } from "react";
import { useSelector } from "react-redux";

const fontColor = "black"
const UserMenu = () => {
  const { user } = useSelector((state) => state.auth.value);
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const theme = useMantineTheme();

  const getInitials = (user) => {
    const name = user.firstName + " " + user.lastName;

    let rgx = new RegExp(/(\p{L}{1})\p{L}+/, "gu");
    let initials = [...name.matchAll(rgx)] || [];

    initials = (
      (initials.shift()?.[1] || "") + (initials.pop()?.[1] || "")
    ).toUpperCase();

    return initials;
  };

  return (
    <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
      <Menu
        opened={userMenuOpened}
        position="bottom-end"
        transitionProps={{ transition: "pop-top-right" }}
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
            sx={{ borderTopLeftRadius: 36, borderBottomLeftRadius: 36 }}
          >
            <Group spacing={"xs"}>
              {user.image ? (
                <Avatar size={"md"} radius="xl" ml={3} src={user.image} />
              ) : (
                <Avatar size={"md"} radius="xl" ml={3}>
                  {getInitials(user)}
                </Avatar>
              )}
              <Flex align="flex-start" direction="column" wrap="wrap">
                <Text
                  weight={500}
                  size="sm"
                  sx={{ lineHeight: 1, color: fontColor }}
                  mr={3}
                  mb={5}
                >
                  {user.firstName + " " + user.lastName}
                </Text>
                <Text
                  weight={200}
                  size="xs"
                  sx={{ lineHeight: 1, color: fontColor }}
                  mr={3}
                >
                  {user.role ? user.role : "Usuario"}
                </Text>
              </Flex>

              <Group mr={"xs"}>
                {userMenuOpened ? (
                  <IconChevronDown size={16} />
                ) : (
                  <IconChevronUp size={16} />
                )}
              </Group>
            </Group>
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>Settings</Menu.Label>
          <Menu.Item icon={<IconSettings size={16} stroke={1.5} />}>
            Account settings
          </Menu.Item>
          <Menu.Item icon={<IconLogout size={16} stroke={1.5} />}>
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </MediaQuery>
  );
};

export default UserMenu;
