import React from "react";
import Editor2d from "./Editor2d";
import { findLayoutByFloorId, findRacksByZoneId } from "../../../../../DataAccess/Surfaces";
import { findAllLayoutMarkersById } from "../../../../../DataAccess/LayoutsMarkers";
import { AbmStateContext } from "../Context";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { HEADER_HIGHT, PIXEL_METER_RELATION, TOOLBAR_HIGHT } from "../../../../../Constants";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect } from "react";
import { useState } from "react";
import { useWindowSize } from "../../../../../Hook";
import { Box, Button, Center, Loader, LoadingOverlay, Stack, Switch, Text } from "@mantine/core";
import Toolbar from "../Toolbar";

const View2d = () => {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const [racks, setRacks] = useState(null);
  const [layouts, setLayouts] = useState(null);
  const [markers, setMarkers] = useState(null);
  const [pixelMeterRelation, setPixelMeterRelation] = useState(null);
  const [loading, setLoading] = useState(false);

  const [checked, setChecked] = useState(true);

  const { site, floor } = useContext(AbmStateContext);

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

    const layouts = await findLayoutByFloorId(params);

    const n = (1.0 / layouts[0].pixelmeterrelation) * PIXEL_METER_RELATION;
    setPixelMeterRelation(n);
    setLayouts(layouts);

    const racks = await findRacksByZoneId(params);
    setRacks(racks);

    const markerts = await findAllLayoutMarkersById(params);
    setMarkers(markerts);

    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Stack>
      <Toolbar disable={loading}>
        {/* <Switch
          label="Multiple seleccion"
          checked={checked}
          onChange={(event) => setChecked(event.currentTarget.checked)}
        /> */}
        <Button size="xs">
          <Text>{t("crud.floorGrapthEditor.label.linkStructures")}</Text>
        </Button>
      </Toolbar>
      {loading ? (
        <Center w={wSize.width - (matches ? 316 : 32)} h={wSize.height - HEADER_HIGHT - TOOLBAR_HIGHT - 16}>
          <Loader />
        </Center>
      ) : (
        <Editor2d
          width={wSize.width - (matches ? 316 : 32)}
          height={wSize.height - HEADER_HIGHT - TOOLBAR_HIGHT - 16}
          layouts={layouts}
          racks={racks}
          markers={markers}
          pixelMeterRelation={pixelMeterRelation}
          nodes={null}
          multiSelect={checked}
        />
      )}
    </Stack>
  );
};

export default View2d;
