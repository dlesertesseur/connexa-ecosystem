import * as THREE from "three";
import ViewHeader from "../../ViewHeader";
import ResponceNotification from "../../../../Modal/ResponceNotification";
import Toolbar from "./Toolbar";
import FloorPlanView3d from "./FloorPlanView3d";
import { useRef } from "react";
import { Stack } from "@mantine/core";
import { FloorView3dContext } from "./Context";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useWindowSize } from "../../../../Hook";
import { PIXEL_METER_RELATION } from "../../../../Constants";
import { findAllLayoutMarkersById } from "../../../../DataAccess/LayoutsMarkers";
import { findLayoutByFloorId, findRacksByZoneId } from "../../../../DataAccess/Surfaces";
import { FilterControl } from "../Controls/FilterControl";
import { hideNotification, showNotification } from "@mantine/notifications";
import { getLocationStatus, getLocationTypes, getLocations, getTrademarks } from "../../../../DataAccess/Wms";
import { findAllVariables } from "../../../../DataAccess/Variables";

const Viewer = ({ app }) => {
  const { user } = useSelector((state) => state.auth.value);
  const { t } = useTranslation();
  const [reload, setReload] = useState(null);
  const [loading, setLoading] = useState(false);
  const [siteId, setSiteId] = useState(null);
  const [floorId, setFloorId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [Layouts, setLayouts] = useState(null);
  const [racks, setRacks] = useState(null);
  const [markers, setMarkers] = useState(null);
  const [selectedPart, setSelectedPart] = useState(null);
  const [pixelmeterrelation, setPixelmeterrelation] = useState(null);
  const [wmsApiToken, setWmsApiToken] = useState(null);

  const [positionsFound, setPositionsFound] = useState(null);
  const [optionsOpened, setOptionsOpened] = useState(false);

  const [graphRoute, setGraphRoute] = useState(null);
  const [locationStatus, setLocationStatus] = useState(null);
  const [locationTypes, setLocationTypes] = useState(null);
  const [trademarks, setTrademarks] = useState(null);
  const [positions, setPositions] = useState(null);
  const [action, setAction] = useState(null);

  const wSize = useWindowSize();

  const initilizeContext = () => {
    //console.log("initilizeContext -> ");
  };

  const getData = async (site, floor) => {
    const params = {
      token: user.token,
      siteId: site.id,
      floorId: floor.id,
      types: "2,10",
    };

    initilizeContext();
    setLoading(true);

    showInfo(t("label.wmsApiAuth"));
    await authenticateWms();

    try {
      showInfo(t("label.layouts"));
      const layouts = await findLayoutByFloorId(params);
      const n = (1.0 / layouts[0].pixelmeterrelation) * PIXEL_METER_RELATION;
      setPixelmeterrelation(n);
      setLayouts(layouts);

      showInfo(t("label.racks"));
      const racks = await findRacksByZoneId(params);
      setRacks(racks);

      showInfo(t("label.markers"));
      const markers = await findAllLayoutMarkersById(params);
      setMarkers(markers);

      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(error.message);
    }
    setLoading(false);
    hideInfo();
  };

  const authenticateWms = async () => {
    const params = {
      token: user.token,
    };
    try {
      const variables = await findAllVariables(params);
      if (variables) {
        // const wmsApiUser = variables.find((v) => v.name === "WMS_API_USER");
        // const wmsApiPass = variables.find((v) => v.name === "WMS_API_PASS");

        // const ret = await authenticate({
        //   email: wmsApiUser.value,
        //   password: wmsApiPass.value,
        // });

        // setWmsApiToken(ret.token);

        const locationStatus = await getLocationStatus(params);
        const locationTypes = await getLocationTypes(params);
        const trademarks = await getTrademarks(params);

        setLocationStatus(locationStatus);
        setLocationTypes(locationTypes);
        setTrademarks(trademarks);

        setWmsApiToken(user.token);
      }
    } catch (error) {
      setErrorMessage(error);
      console.log("authenticate ERROR -> ", error);
    }
  };

  const refresh = () => {
    setReload(Date.now());
  };

  const showData = async (filter, data, color) => {
    let positions = null;
    let filterData = null;

    const options = t("view.floorViewer.menu.options", { returnObjects: true });

    switch (filter) {
      case 1:
        filterData = "sku_equals=" + data;
        break;

      case 2:
        filterData = "code_like=" + data;
        break;

      case 3:
        filterData = "trademark_equals=" + data;
        break;

      case 4:
        filterData = "status_equals=" + data;
        break;

      case 5:
        filterData = "type_equals=" + data;
        break;

      default:
        break;
    }

    setOptionsOpened(false);

    const subTitle = options[filter];
    showInfo(subTitle);

    positions = await getLocations({ token: wmsApiToken, filter: filterData });
    setPositionsFound(positions);

    // const positionsNames = positions.map((p) => {
    //   const arr = p.code.split("-");
    //   const ret = `${arr[0]}-${arr[1]}`;
    //   return ret;
    // });

    const action = { positionsNames: positions, color: color, dimension: {x:1, y:1, z:1} };
    setAction(action);

    hideInfo();
  };

  const onSelect = (event) => {
    if (event.intersections && event.intersections.length > 0) {
      const obj = event.intersections[0].object;
      //setSelectedPart(obj);
    }
  };

  const onFind = (e) => {
    console.log("onFind ->", e);
  };

  const showInfo = (message) => {
    showNotification({
      id: "loadind-data3d-notification",
      disallowClose: true,
      title: t("message.loadingData"),
      message: message,
      loading: true,
    });
  };

  const hideInfo = () => {
    hideNotification("loadind-data3d-notification");
  };

  return (
    <FloorView3dContext.Provider
      value={{
        refresh,
        siteId,
        setSiteId,
        floorId,
        setFloorId,
        initilizeContext,
        racks,
        Layouts,
        markers,
        selectedPart,
        setSelectedPart,
        showData,
        wmsApiToken,
        locationStatus,
        locationTypes,
        trademarks,
        optionsOpened,
        setOptionsOpened,
        positionsFound,
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
          <Toolbar onFind={onFind}>
            <FilterControl
              siteId={siteId}
              setSiteId={setSiteId}
              floorId={floorId}
              setFloorId={setFloorId}
              onFilter={getData}
              loading={loading}
            />
          </Toolbar>

          <FloorPlanView3d racks={racks} action={action} />

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
