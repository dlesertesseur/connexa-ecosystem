import React, { useEffect, useState } from "react";
import LabelProperty from "./LabelProperty";
import PalletCard from "./PalletCard";
import { Carousel } from "@mantine/carousel";
import { Group, Select, Stack } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { convertMilisegToYYYYMMDDHHMISS } from "../Util";

const CardsProperty = ({ title, p = 6, pallets, h = 200 }) => {
  const [data, setData] = useState([]);
  const [palletIdx, setPalletIdx] = useState(null);
  const [pallet, setPallet] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const data = pallets?.map((p, index) => {
      return { value: index, label: p.code ? p.code : p.creationDate };
    });

    setData(data);
    setPalletIdx(0);

  }, [pallets]);

  return (
    <Stack spacing={"xs"} mt={"xs"}>
      <Select label={title} data={data} value={palletIdx} onChange={setPalletIdx} />

      {pallets && palletIdx !== null ? (
        <>
          <Group key={palletIdx} grow spacing={"xs"}>
            <LabelProperty
              label={t("view.floorViewer.moduleInspector.label.width")}
              value={`${pallets[palletIdx].width}`}
            />
            <LabelProperty
              label={t("view.floorViewer.moduleInspector.label.height")}
              value={`${pallets[palletIdx].height}`}
            />
            <LabelProperty
              label={t("view.floorViewer.moduleInspector.label.depth")}
              value={`${pallets[palletIdx].depth}`}
            />
          </Group>

          <Group grow spacing={"xs"}>
            <LabelProperty
              label={t("view.floorViewer.moduleInspector.label.palletType")}
              value={pallets[palletIdx].type}
            />
            <LabelProperty
              label={t("view.floorViewer.moduleInspector.label.palletStatus")}
              value={pallets[palletIdx].status}
            />
          </Group>
          <LabelProperty
            label={t("view.floorViewer.moduleInspector.label.palletCreationDate")}
            value={convertMilisegToYYYYMMDDHHMISS(pallets[palletIdx].creationDate)}
          />
          <Carousel slideGap="xs" withControls={false} withIndicators={true}>
            {pallets[palletIdx].details?.map((a,index) => {
              return (
                <Carousel.Slide key={index}>
                  <PalletCard detail={a} />
                </Carousel.Slide>
              );
            })}
          </Carousel>
        </>
      ) : null}
    </Stack>
  );
};

export default CardsProperty;
