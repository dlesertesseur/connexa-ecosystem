import * as THREE from "three";
import { useEffect, useRef } from "react";
import { buildStructures } from "../../../../Components/Builder3d";
import { Stack } from "@mantine/core";
import { FloorView3dContext } from "./Context";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useWindowSize } from "../../../../Hook";
import { PIXEL_METER_RELATION } from "../../../../Constants";
import { findAllLayoutMarkersById } from "../../../../DataAccess/LayoutsMarkers";
import { findLayoutByFloorId, findRacksByZoneId } from "../../../../DataAccess/Surfaces";
import ViewHeader from "../../ViewHeader";
import ResponceNotification from "../../../../Modal/ResponceNotification";
import Toolbar from "./Toolbar";
import FloorPlanView3d from "./FloorPlanView3d";

const Viewer = ({ app }) => {
  const controlRef = useRef(null);
  const [model, setModel] = useState(null);
  const { user } = useSelector((state) => state.auth.value);
  const { t } = useTranslation();
  const [reload, setReload] = useState(null);
  const [loading, setLoading] = useState(false);
  const [site, setSite] = useState(null);
  const [floor, setFloor] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [Layouts, setLayouts] = useState(null);
  const [racks, setRacks] = useState(null);
  const [markers, setMarkers] = useState(null);
  const [selectedPart, setSelectedPart] = useState(null);
  const [pixelmeterrelation, setPixelmeterrelation] = useState(null);

  const wSize = useWindowSize();

  const initilizeContext = () => {
    console.log("initilizeContext -> ");
  };

  const getData = async () => {
    const params = {
      token: user.token,
      siteId: site,
      floorId: floor,
      types: "2,10",
    };

    initilizeContext();
    setLoading(true);
    try {
      const layouts = await findLayoutByFloorId(params);
      const n = (1.0 / layouts[0].pixelmeterrelation) * PIXEL_METER_RELATION;
      setPixelmeterrelation(n);
      setLayouts(layouts);

      const racks = await findRacksByZoneId(params);
      setRacks(racks);

      const markers = await findAllLayoutMarkersById(params);
      setMarkers(markers);

      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (site && floor) {
      getData();
    }
  }, [user, reload]);

  const refresh = () => {
    setReload(Date.now());
  };

  const showData = (e) => {
    console.log("showData ->", e);
  };

  const onSelect = (event) => {
    if (event.intersections && event.intersections.length > 0) {
      const obj = event.intersections[0].object;
      //setSelectedPart(obj);
    }
  };

  useEffect(() => {
    if (racks) {
      const ret = buildStructures(racks, false, onSelect);
      setSelectedPart(null);
      setModel(ret);
    }
  }, [racks]);

  const onUpdateData = (event) => {
    const userData = selectedPart.userData;
    const positions = selectedPart.position;
    const rotations = [
      THREE.MathUtils.radToDeg(selectedPart.rotation.x),
      THREE.MathUtils.radToDeg(selectedPart.rotation.y),
      THREE.MathUtils.radToDeg(selectedPart.rotation.z),
    ];
    const dimensions = [
      selectedPart.geometry.parameters.width * selectedPart.scale.x,
      selectedPart.geometry.parameters.height * selectedPart.scale.y,
      selectedPart.geometry.parameters.depth * selectedPart.scale.z,
    ];

    userData.positionx = positions.x;
    userData.positiony = -positions.y;
    userData.positionz = positions.z;

    userData.rotationx = rotations[0];
    userData.rotationy = rotations[1];
    userData.rotationz = rotations[2];

    userData.dimensionx = dimensions[0];
    userData.dimensiony = dimensions[1];
    userData.dimensionz = dimensions[2];
  };

  const onFind = (e) => {
    console.log("onFind ->", e);
  };

  return (
    <FloorView3dContext.Provider
      value={{
        refresh,
        site,
        setSite,
        floor,
        setFloor,
        initilizeContext,
        racks,
        Layouts,
        markers,
        selectedPart,
        setSelectedPart,
        showData,
      }}
    >
      <Stack>
        <ViewHeader app={app} />
        <Stack
          justify="flex-start"
          spacing="0"
          sx={(theme) => ({
            backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[2],
            height: "100%",
            border: "solid 1px" + theme.colors.gray[3],
          })}
        >
          <Toolbar onFind={onFind}></Toolbar>

          <FloorPlanView3d />

          <ResponceNotification
            opened={errorMessage ? true : false}
            onClose={() => {
              setErrorMessage(null);
            }}
            code={errorMessage}
            title={t("status.error")}
            text={errorMessage}
          />
        </Stack>
      </Stack>
    </FloorView3dContext.Provider>
  );
};

export default Viewer;
