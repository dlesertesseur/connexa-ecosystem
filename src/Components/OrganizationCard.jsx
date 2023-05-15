import {
  Badge,
  Group,
  Paper,
  Select,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectSite } from "../Features/Auth";
import { useTranslation } from "react-i18next";

const OrganizationCard = () => {
  const theme = useMantineTheme();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { organizationSelected, projectSelected, siteSelected } = useSelector(
    (state) => state.auth.value
  );

  const [sites, setSites] = useState([]);
  const bgColor = theme.colors.gray[0];

  useEffect(() => {
    if (projectSelected !== null) {
      const sites = projectSelected?.sites?.map((s) => {
        return { value: s.id, label: s.name };
      });

      setSites(sites);
    }
  }, [projectSelected]);

  const onChange = (siteId) => {
    const site = projectSelected?.sites.find((s) => s.id === siteId);
    dispatch(selectSite(site));
  };

  return (
    <Stack radius="md" p={"xs"}>
      <Paper withBorder bg={bgColor} p={"xs"}>
        {/* <Group align="center" position="center">
          <Image src="./images/mondelez.png" alt="logo" width={150} />
        </Group> */}
        <Group position="apart" mb={"xs"}>
          <Text size={"lg"} weight={500}>
            {organizationSelected?.name}
          </Text>
          <Badge color="green" variant="filled">
            Activa
          </Badge>
        </Group>
        <Select
          dropdownPosition="bottom"
          w={"100%"}
          data={sites}
          label={t("label.selectedSite")}
          value={siteSelected?.id}
          onChange={onChange}
        />
      </Paper>
    </Stack>
  );
};

export default OrganizationCard;
