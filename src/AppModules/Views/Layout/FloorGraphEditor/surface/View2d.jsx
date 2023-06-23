import React from "react";
import Editor2d from "./Editor2d";
import Toolbar from "../Toolbar";
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
import { Center, Loader, Stack } from "@mantine/core";

const View2d = () => {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const [racks, setRacks] = useState(null);
  const [layouts, setLayouts] = useState(null);
  const [markers, setMarkers] = useState(null);
  const [loading, setLoading] = useState(false);
  const [staticNodes, setStaticNodes] = useState(null);
  const [nodes, setNodes] = useState(null);
  const [connectors, setConnectors] = useState(null);
  const [pixelMeterRelation, setPixelMeterRelation] = useState(null);

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

  const onLinkStructures = () => {
    console.log("onLinkStructures");
  }

  return (
    <Stack>
      <Toolbar disabled={loading} onLinkStructures={onLinkStructures}/>
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
          nodes={nodes}
          staticNodes={staticNodes}
          connectors={connectors}
          setStaticNodes={setStaticNodes}
          pixelMeterRelation={pixelMeterRelation}
        />
      )}
    </Stack>
  );
};

export default View2d;
