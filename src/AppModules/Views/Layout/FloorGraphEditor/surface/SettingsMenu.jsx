import React, { useContext } from "react";
import { Button, Center, Divider, Group, NumberInput, Popover, SegmentedControl, Text, TextInput } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { IconArrowNarrowRight, IconArrowsHorizontal, IconAxisX, IconAxisY } from "@tabler/icons-react";
import { CONNECTOR_ONE_WAY, CONNECTOR_TWO_WAY, RACK_ORIENTATION_X, RACK_ORIENTATION_Y } from "../../../../../Constants";
import { findSiteById } from "../../../../../DataAccess/Sites";
import { findFloorById } from "../../../../../DataAccess/Floors";
import { useSelector } from "react-redux";
import { AbmStateContext } from "../Context";
import { useEffect } from "react";

const SettingsMenu = ({
  name,
  setName,
  elementGroup,
  setElementGroup,
  direction,
  setDirection,
  rackOrientation,
  setRackOrientation,
}) => {
  const { t } = useTranslation();
  const [opened, setOpened] = useState(false);

  const { user } = useSelector((state) => state.auth.value);
  const { site, floor } = useContext(AbmStateContext);

  const [siteData, setSiteData] = useState(null);
  const [floorData, setFloorData] = useState(null);

  const getData = async () => {
    const params = {
      token: user.token,
      siteId: site,
      floorId: floor,
    };

    const siteData = await findSiteById(params);
    setSiteData(siteData);

    const floorData = await findFloorById(params);
    setFloorData(floorData);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Popover width={300} position="bottom-start" withArrow shadow="md" opened={opened}>
      <Popover.Target>
        <Button size="xs" onClick={() => setOpened((o) => !o)}>
          {t("crud.floorGrapthEditor.label.settingsNenu")}
        </Button>
      </Popover.Target>
      
      <Popover.Dropdown
        sx={(theme) => ({ background: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white })}
      >
        {siteData && floorData ? (
          <>
            <Text weight={500}>{siteData.name}</Text>
            <Text weight={300} mb={"md"}>
              {floorData.name}
            </Text>
            <Divider my="sm" />
          </>
        ) : null}
        <TextInput
          description={t("crud.floorGrapthEditor.label.nameDescription")}
          placeholder={t("crud.floorGrapthEditor.label.name")}
          label={t("crud.floorGrapthEditor.label.name")}
          withAsterisk
          value={name}
          onChange={(event) => setName(event.currentTarget.value)}
          mb={"md"}
        />

        <Group spacing={"xs"} mt={"xs"} position="apart">
          <Text size={"sm"}>{t("crud.floorGrapthEditor.label.group")}</Text>
          <NumberInput
            defaultValue={2}
            size="sm"
            step={1}
            min={1}
            w={86}
            value={elementGroup}
            onChange={setElementGroup}
          />
        </Group>

        <Group spacing={"xs"} mt={"xs"} position="apart">
          <Text size={"sm"}>{t("crud.floorGrapthEditor.label.connectors")}</Text>

          <SegmentedControl
            size="sm"
            value={direction}
            onChange={setDirection}
            data={[
              {
                value: CONNECTOR_TWO_WAY,
                label: (
                  <Center>
                    <IconArrowsHorizontal size={20} />
                  </Center>
                ),
              },
              {
                value: CONNECTOR_ONE_WAY,
                label: (
                  <Center>
                    <IconArrowNarrowRight size={20} />
                  </Center>
                ),
              },
            ]}
          />
        </Group>

        <Group spacing={"xs"} mt={"xs"} position="apart">
          <Text size={"sm"}>{t("crud.floorGrapthEditor.label.rackOrientation")}</Text>
          <SegmentedControl
            value={rackOrientation}
            onChange={setRackOrientation}
            size="sm"
            data={[
              {
                value: RACK_ORIENTATION_X,
                label: (
                  <Center>
                    <IconAxisX size={20} />
                  </Center>
                ),
              },
              {
                value: RACK_ORIENTATION_Y,
                label: (
                  <Center>
                    <IconAxisY size={20} />
                  </Center>
                ),
              },
            ]}
          />{" "}
        </Group>

        {/* <Group position="right" mt={"md"}>
          <Button disabled={false} onClick={() => {}}>
            {t("button.accept")}
          </Button>
        </Group> */}
      </Popover.Dropdown>
    </Popover>
  );
};

export default SettingsMenu;
