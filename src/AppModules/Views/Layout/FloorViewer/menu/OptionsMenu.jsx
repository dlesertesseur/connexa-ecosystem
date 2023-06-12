import React, { useState } from "react";
import { Button, Popover, Select, Stack } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import FindByCode from "./FindByCode";
import FindByDescription from "./FindByDescription";
import FindByDepartment from "./FindByDepartment";
import FindByStatus from "./FindByStatus";

const OptionsMenu = ({ loading = false, disabled = false }) => {
  const { t } = useTranslation();
  const [opened, setOpened] = useState(false);
  const [option, setOption] = useState(null);
  const [content, setContent] = useState(null);
  const [optionList] = useState(
    t("view.floorViewer.menu.options", { returnObjects: true }).map((o, index) => {
      return { value: index + 1, label: o };
    })
  );

  useEffect(() => {
    if (option) {
      setContent(bluildContent(option));
    }
  }, [option]);

  const bluildContent = (opt) => {
    let ret = null;
    switch (opt) {
      case 1:
        ret = <FindByCode/>;
        break;
      case 2:
        ret = <FindByDescription/>;
        break;
      case 3:
        ret = <FindByDepartment/>
        break;
      case 4:
        ret = <FindByStatus/>
        break;
      default:
        break;
    }
    return ret;
  };

  return (
    <Popover width={300} position="bottom-start" withArrow shadow="md" opened={opened}>
      <Popover.Target>
        <Button loading={loading} disabled={disabled} size={"xs"} py={0} onClick={() => setOpened((o) => !o)}>
          {t("view.floorViewer.menu.label")}
        </Button>
      </Popover.Target>

      <Popover.Dropdown>
        <Stack>
          <Select
            label={t("view.floorViewer.menu.title")}
            placeholder={t("label.select")}
            description={t("view.floorViewer.menu.subTitle")}
            nothingFound={t("label.noData")}
            data={optionList}
            value={option}
            onChange={setOption}
          />
          {content}
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
};

export default OptionsMenu;
