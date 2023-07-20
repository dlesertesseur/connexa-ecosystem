import React, { useState } from "react";
import { Button, Popover, Select, Stack } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useContext } from "react";
import { FloorViewerStateContext } from "../Context";
import FindByCode from "./FindByCode";
import FindByDescription from "./FindByDescription";
import FindByTrademark from "./FindByTrademark";
import FindByStatus from "./FindByStatus";
import FindByType from "./FindByType";
import FindByPosition from "./FindByPosition";

const OptionsMenu = ({ loading = false, disabled = false }) => {
  const { t } = useTranslation();
  const [option, setOption] = useState(null);
  const [content, setContent] = useState(null);
  const [optionList] = useState(
    t("view.floorViewer.menu.options", { returnObjects: true }).map((o, index) => {
      return { value: index + 1, label: o };
    })
  );

  const { optionsOpened, setOptionsOpened } = useContext(FloorViewerStateContext);

  useEffect(() => {
    if (option) {
      setContent(buildContent(option));
    }
  }, [option]);

  const buildContent = (opt) => {
    let ret = null;
    switch (opt) {
      case 1:
        ret = <FindByCode code={1} />;
        break;
      case 2:
        ret = <FindByDescription code={2} />;
        break;
      case 3:
        ret = <FindByTrademark code={3} />;
        break;
      case 4:
        ret = <FindByStatus code={4} />;
        break;
      case 5:
        ret = <FindByType code={5} />;
        break;
      case 6:
        ret = <FindByPosition code={6} />;
        break;
      default:
        break;
    }
    return ret;
  };

  return (
    <Popover width={300} position="bottom-start" withArrow shadow="md" opened={optionsOpened}>
      <Popover.Target>
        <Button loading={loading} disabled={disabled} size={"xs"} py={0} onClick={() => setOptionsOpened((o) => !o)}>
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
