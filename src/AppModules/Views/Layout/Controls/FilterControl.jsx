import { Popover, Button, Select, Space, Group } from "@mantine/core";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { findAllFloorsBySiteId } from "../../../../DataAccess/Floors";
import { findAllSites } from "../../../../DataAccess/Sites";

function FilterControl({ onFilter, siteId, setSiteId, floorId, setFloorId, loading, disabled}) {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const [sites, setSites] = useState([]);
  const [floors, setFloors] = useState([]);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    const params = {
      token: user.token,
    };
    findAllSites(params).then((ret) => {
      setSites(ret);
    });
  }, [user]);

  useEffect(() => {
    if (siteId) {
      const params = {
        token: user.token,
        siteId: siteId,
      };

      findAllFloorsBySiteId(params).then((ret) => {
        setFloors(ret);
      });
    }
  }, [user, siteId, setFloorId]);

  const onLoadData = () => {
    setOpened(false);
    const rs = sites.find((s) => s.id === siteId);
    const rf = floors.find((f) => f.id === floorId);
    onFilter(rs, rf);
  };

  return (
    <Popover width={300} position="bottom-end" withArrow shadow="md" opened={opened}>
      <Popover.Target>
        <Button loading={loading} disabled={disabled} size={"xs"} py={0} onClick={() => setOpened((o) => !o)}>
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
          value={siteId}
          onChange={setSiteId}
        />
        <Space my={"md"} />
        <Select
          label={t("label.floor")}
          description={t("label.floorDesc")}
          placeholder={t("label.select")}
          nothingFound={t("label.noData")}
          value={floorId}
          onChange={(event) => {
            setFloorId(event);
          }}
          data={floors?.map((s) => {
            return { value: s.id, label: s.name };
          })}
        />
        <Group position="right" mt={"md"}>
          <Button disabled={!(siteId && floorId)} onClick={onLoadData}>
            {t("button.accept")}
          </Button>
        </Group>
      </Popover.Dropdown>
    </Popover>
  );
}

export { FilterControl };
