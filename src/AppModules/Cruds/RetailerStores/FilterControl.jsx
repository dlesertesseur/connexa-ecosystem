import { Popover, Button, Select, Group } from "@mantine/core";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { findAllRetailers } from "../../../DataAccess/Retailers";

function FilterControl({onFilter, entity, setEntity}) {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const [entities, setEntities] = useState([]);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    const params = {
      token: user.token,
    };
    findAllRetailers(params).then((ret) => {
      setEntities(ret);
    });
  }, [user]);

  const onLoadData = () => {
    setOpened(false);
    onFilter(entity);
  };

  return (
    <Popover width={300} position="bottom-start" withArrow shadow="md" opened={opened}>
      <Popover.Target>
        <Button onClick={() => setOpened((o) => !o)}>{t("label.crud.filter")}</Button>
      </Popover.Target>
      <Popover.Dropdown
        sx={(theme) => ({ background: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white })}
      >
        <Select
          label={t("label.retailer")}
          placeholder={t("label.select")}
          description={t("label.retailerDesc")}
          searchable
          nothingFound={t("label.noData")}
          data={entities?.map((s) => { return({value: s.id, label: s.name })})}
          value={entity}
          onChange={setEntity}
        />

        <Group position="right" mt={"md"}>
          <Button disabled={!entity} onClick={onLoadData}>{t("button.accept")}</Button>
        </Group>
      </Popover.Dropdown>
    </Popover>
  );
}

export { FilterControl };
