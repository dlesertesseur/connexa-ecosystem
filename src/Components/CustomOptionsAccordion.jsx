import { Accordion, Group, Loader, ScrollArea, Stack, Text, UnstyledButton } from "@mantine/core";
import { IconApps, IconChevronRight, IconPhoto } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { findTranslatedField } from "../Util";
import { useNavigate } from "react-router";
import React from "react";

const CustomOptionsAccordion = () => {
  const [links, setLinks] = useState(null);
  const { i18n, t } = useTranslation();

  const { siteSelected } = useSelector((state) => state.auth.value);
  const navigate = useNavigate();

  const createMenuGroup = (role, item) => {
    const ret = (
      <Accordion.Item key={role.id} value={role.name}>
        <Accordion.Control icon={<IconApps size={22} color={"grey"} stroke={1.5}/>}>
          
          <Text weight={600}>{role.name}</Text></Accordion.Control>
        <Accordion.Panel>
          {item?.links.map((link) => {
            const lnk = (
              <UnstyledButton
                w={"100%"}
                sx={{
                  "&:hover": {
                    color: "black",
                    backgroundColor: "#f5f5f5",
                  },
                  borderRadius: 6,
                }}
                mr={5}
                p={5}
                key={link.id}
                onClick={(event) => navigate("/menu" + link.link)}
              >
                <Group position="apart" noWrap spacing={0}>
                  <Stack spacing={0}>
                    <Text weight={600}>{link.label}</Text>
                    <Text size={"xs"} weight={450}>
                      {link.description}
                    </Text>
                  </Stack>

                  <Stack spacing={0}>
                    <IconChevronRight size={16} />
                  </Stack>
                </Group>
              </UnstyledButton>
            );
            return lnk;
          })}
        </Accordion.Panel>
      </Accordion.Item>
    );

    return ret;
  };

  useEffect(() => {
    if (siteSelected) {
      const l = siteSelected.roles.map((role) => {
        const item = {
          label: findTranslatedField(i18n.language, role, "name"),
          icon: IconApps,
        };

        item.links = role.applications.map((app) => {
          const subItem = {
            id: app.id,
            label: findTranslatedField(i18n.language, app, "name"),
            description: findTranslatedField(i18n.language, app, "description"),
            icon: app.icon,
            link: app.path,
          };
          return subItem;
        });

        /*Ordena por label*/
        item.links.sort((a, b) => {
          const nameA = a.label.toUpperCase();
          const nameB = b.label.toUpperCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });

        return createMenuGroup(role, item);
      });

      setLinks(l);
    }
  }, [i18n.language, siteSelected]);

  const draw = links ? (
    <ScrollArea px={"xs"} h={"100%"}>
      <Stack justify="center" h={"100%"} m={0} spacing={"xs"}>
        <Accordion variant="separated">{links}</Accordion>
      </Stack>
    </ScrollArea>
  ) : (
    <Group grow h={"100%"}>
      <Loader size="sm" />
    </Group>
  );

  return draw;
};

export default CustomOptionsAccordion;
