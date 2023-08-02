import { Popover, Button, Select, Space, Group } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { findAllRetailers, findAllStoresByRetailer } from "../../../DataAccess/Shift";
import "dayjs/locale/es";
import "dayjs/locale/en";

function FilterControl({
  onFilter,
  retailId,
  setRetailId,
  storeId,
  setStoreId,
  selectedDate,
  setSelectedDate,
  opened,
  setOpened,
  loading,
  disabled,
}) {
  const { t, i18n } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const [retailers, setRetailers] = useState([]);
  const [stores, setStores] = useState([]);

  useEffect(() => {
    const params = {
      token: user.token,
    };
    findAllRetailers(params).then((ret) => {
      setRetailers(ret);
    });
  }, [user]);

  useEffect(() => {
    if (retailId) {
      const params = {
        token: user.token,
        retailId: retailId,
      };

      findAllStoresByRetailer(params).then((ret) => {
        setStores(ret);
      });
    }
  }, [retailId, user]);

  const onLoadData = () => {
    setOpened(false);
    const retailer = retailers.find((s) => s.id === retailId);
    const store = stores.find((f) => f.id === storeId);
    onFilter(retailer, store);
  };

  return (
    <Popover width={300} position="bottom-end" withArrow shadow="md" opened={opened}>
      <Popover.Target>
        <Button loading={loading} disabled={disabled} py={0} onClick={() => setOpened(true)}>
          {t("label.crud.filter")}
        </Button>
      </Popover.Target>
      <Popover.Dropdown
        sx={(theme) => ({ background: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white })}
      >
        <Select
          label={t("crud.shift.label.retailer")}
          description={t("crud.shift.label.retailerDesc")}
          placeholder={t("label.select")}
          searchable
          nothingFound={t("label.noData")}
          data={retailers?.map((s) => {
            return { value: s.id, label: s.name };
          })}
          value={retailId}
          onChange={(id) => {
            setRetailId(id);
            setStoreId(null);
          }}
        />
        <Space my={"md"} />
        <Select
          label={t("crud.shift.label.store")}
          description={t("crud.shift.label.storeDesc")}
          placeholder={t("label.select")}
          nothingFound={t("label.noData")}
          value={storeId}
          onChange={(event) => {
            setStoreId(event);
          }}
          data={stores?.map((s) => {
            return { value: s.id, label: s.name };
          })}
        />
        <Space my={"md"} />

        <DatePicker
          locale={i18n.language}
          inputFormat="YYYY/MM/DD"
          firstDayOfWeek="sunday"
          label={t("crud.shift.label.date")}
          value={selectedDate}
          onChange={setSelectedDate}
        />

        <Group position="right" mt={"md"}>
          <Button disabled={!(retailId && storeId && selectedDate)} onClick={onLoadData}>
            {t("button.accept")}
          </Button>
        </Group>
      </Popover.Dropdown>
    </Popover>
  );
}

export { FilterControl };
