import React from "react";
import Editor2d from "./Editor2d";
import { findLayoutByFloorId, findRacksByZoneId } from "../../../../../DataAccess/Surfaces";
import { findAllLayoutMarkersById } from "../../../../../DataAccess/LayoutsMarkers";
import { AbmStateContext } from "../Context";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { HEADER_HIGHT, PIXEL_METER_RELATION } from "../../../../../Constants";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect } from "react";
import { useState } from "react";
import { useWindowSize } from "../../../../../Hook";
import { Center, Loader, Stack } from "@mantine/core";


const View2d = ({onSave}) => {
  
  const { user } = useSelector((state) => state.auth.value);
  const { site, floor, setDisabledActionButtons } = useContext(AbmStateContext);

  const [racks, setRacks] = useState(null);
  const [layouts, setLayouts] = useState(null);
  const [markers, setMarkers] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pixelMeterRelation, setPixelMeterRelation] = useState(null);

  const matches = useMediaQuery("(min-width: 768px)");
  const wSize = useWindowSize();

  const getData = async () => {
    const params = {
      token: user.token,
      siteId: site,
      floorId: floor,
      types: "2,10",
    };

    setLoading(true);
    setDisabledActionButtons(true);

    const layouts = await findLayoutByFloorId(params);

    const n = (1.0 / layouts[0].pixelmeterrelation) * PIXEL_METER_RELATION;
    setPixelMeterRelation(n);
    setLayouts(layouts);

    const racks = await findRacksByZoneId(params);
    setRacks(racks);

    const markerts = await findAllLayoutMarkersById(params);
    setMarkers(markerts);

    setLoading(false);
    setDisabledActionButtons(false);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Stack>
      {loading ? (
        <Center w={wSize.width - (matches ? 316 : 32)} h={wSize.height - HEADER_HIGHT + 56}>
          <Loader />
        </Center>
      ) : (
        <Editor2d
          width={wSize.width - (matches ? 316 : 32)}
          height={wSize.height - HEADER_HIGHT + 40}
          layouts={layouts}
          racks={racks}
          markers={markers}
          pixelMeterRelation={pixelMeterRelation}
          onSave={onSave}
        />
      )}

      {/* <Group position="right" mt="xs" mb="xs" width="100%">
        <Button disabled={disabledActionButtons}
          onClick={() => {
            //onSave();
          }}
        >
          {t("button.accept")}
        </Button>
        <Button
          onClick={(event) => {
            initilizeContext();
            navigate(-1);
          }}
        >
          {t("button.cancel")}
        </Button>
      </Group> */}
    </Stack>
  );
};

export default View2d;
