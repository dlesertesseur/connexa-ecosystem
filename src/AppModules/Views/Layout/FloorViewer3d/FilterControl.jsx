import { Popover, Button, Select, Space, Group } from "@mantine/core";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { findAllFloorsBySiteId } from "../../../../DataAccess/Floors";
import { findAllSites } from "../../../../DataAccess/Sites";
import { useContext } from "react";
import { FloorView3dContext } from "./Context";

function FilterControl() {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const [sites, setSites] = useState([]);
  const [floors, setFloors] = useState([]);
  const [opened, setOpened] = useState(false);
  const { site, setSite, floor, setFloor, refresh } = useContext(FloorView3dContext);

  const getData = async () => {
    const params = {
      token: user.token,
    };

    const sites = await findAllSites(params);
    setSites(sites);
  };

  const getSite = async () => {
    if (site) {
      const params = {
        token: user.token,
        siteId: site,
      };

      const floor = await findAllFloorsBySiteId(params);
      setFloors(floor);
    }
  };

  useEffect(() => {
    getData();
  }, [user]);

  useEffect(() => {
    getSite();
  }, [user, site]);

  const onLoadData = () => {
    setOpened(false);
    refresh();
  };

  return (
    <Popover width={300} position="bottom-start" withArrow shadow="md" opened={opened}>
      <Popover.Target>
        <Button onClick={() => setOpened((o) => !o)} size="xs">
          {t("label.crud.filter")}
        </Button>
      </Popover.Target>
      <Popover.Dropdown
        sx={(theme) => ({ background: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white })}
      >
        <Select
          label={t("label.site")}
          placeholder={t("label.select")}
          description={t("label.siteDesc")}
          searchable
          nothingFound={t("label.noData")}
          data={sites?.map((s) => {
            return { value: s.id, label: s.name };
          })}
          value={site}
          onChange={(e) => {
            setFloor(null);
            setSite(e);
          }}
        />
        <Space my={"md"} />
        <Select
          label={t("label.floor")}
          description={t("label.floorDesc")}
          placeholder={t("label.select")}
          nothingFound={t("label.noData")}
          value={floor}
          onChange={setFloor}
          data={floors?.map((s) => {
            return { value: s.id, label: s.name };
          })}
        />
        <Group position="right" mt={"md"}>
          <Button disabled={!(site && floor)} onClick={onLoadData}>
            {t("button.accept")}
          </Button>
        </Group>
      </Popover.Dropdown>
    </Popover>
  );
}

export { FilterControl };
