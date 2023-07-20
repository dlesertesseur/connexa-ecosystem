import React, { useState } from "react";
import Toolbar from "./Toolbar";
import ViewHeader from "../../ViewHeader";
import FloorPlanView2d from "./FloorPlanView2d";
import ModuleInspector from "./modal/ModuleInspector";
import { useSelector } from "react-redux";
import { PIXEL_METER_RELATION } from "../../../Constants";
import { Stack } from "@mantine/core";
import { findLayoutByFloorId, findRacksByZoneId } from "../../../DataAccess/Surfaces";
import { FilterControl } from "../Controls/FilterControl";
import { findAllLayoutMarkersById } from "../../../DataAccess/LayoutsMarkers";
import { FloorViewerStateContext } from "./Context";
import { findAllGraphsHeaders, findGraphById } from "../../../DataAccess/Graph";
import { GraphRouter } from "../../../Helpers/graphRouter";
import { hideNotification, showNotification } from "@mantine/notifications";
import { useTranslation } from "react-i18next";
import {
  authenticate,
  getLocationStatus,
  getLocationTypes,
  getLocations,
  getTrademarks,
} from "../../../DataAccess/Wms";
import { findAllVariables } from "../../../DataAccess/Variables";
import ResponceNotification from "../../../Modal/ResponceNotification";
import { showParts } from "../../../Components/Builder2d";

const Viewer = ({ app }) => {
  const [actorId, setActorId] = useState(null);
  const [actorName, setActorName] = useState(null);
  const [siteId, setSiteId] = useState(null);
  const [floorId, setFloorId] = useState(null);
  const [layouts, setLayouts] = useState(null);
  const [racks, setRacks] = useState(null);
  const [loading, setLoading] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [route, setRoute] = useState(null);
  const [pixelmeterrelation, setPixelmeterrelation] = useState(null);
  const [partsMap, setPartsMap] = useState(null);
  const [stageRef, setStageRef] = useState(null);
  const [positionsFound, setPositionsFound] = useState(null);
  const [optionsOpened, setOptionsOpened] = useState(false);

  const [graphRoute, setGraphRoute] = useState(null);

  const [errorMessage, setErrorMessage] = useState(null);
  const [wmsApiToken, setWmsApiToken] = useState(null);

  const [locationStatus, setLocationStatus] = useState(null);
  const [locationTypes, setLocationTypes] = useState(null);
  const [trademarks, setTrademarks] = useState(null);
  const [positions, setPositions] = useState(null);

  const { user } = useSelector((state) => state.auth.value);

  const { t } = useTranslation();

  const setPartsDictionary = (stageRef, partsMap) => {
    setPartsMap(partsMap);
    setStageRef(stageRef);
  };

  const getPositionInformation = async (actorName) => {
    if (wmsApiToken) {
      const filterData = `code_like=${actorName}`;
      const positions = await getLocations({ token: wmsApiToken, filter: filterData });
      setPositions(positions);
    } else {
      setErrorMessage(t("errors.wmsApiTokenNotFound"));
    }
  };

  const onActorDblClick = (attrs) => {
    getPositionInformation(attrs.name);
  };

  const onSelectActor = (id, name) => {
    setActorId(id);
    setActorName(name);
    console.log("onSelectActor -> ", id, name);
  };

  const getPartsFromPositions = (positions) => {
    const parts = [];
    if (positions) {
      positions.forEach((pos) => {
        const part = partsMap.get(pos);
        if (part) {
          parts.push(part);
        }
      });
    }
    return parts;
  };

  const showData = async (filter, data, color) => {
    let parts = null;
    let positions = null;
    let filterData = null;

    const options = t("view.floorViewer.menu.options", { returnObjects: true });

    if (partsMap) {
      switch (filter) {
        case 1:
          filterData = "sku_equals=" + data;
          break;

        case 2:
          filterData = "product_name_like=" + data;
          break;

        case 3:
          filterData = "product_name_like=" + data;
          break;

        case 4:
          filterData = "status_equals=" + data;
          break;

        case 5:
          filterData = "type_equals=" + data;
          break;

        case 6:
          filterData = "code_like=" + data.toUpperCase();
          break;

        default:
          break;
      }

      setOptionsOpened(false);

      const subTitle = options[filter];
      showInfo(subTitle);

      positions = await getLocations({ token: wmsApiToken, filter: filterData });
      setPositionsFound(positions);

      const positionsNames = positions.map((p) => {
        const arr = p.code.split("-");
        const ret = `${arr[0]}-${arr[1]}`;
        return ret;
      });

      parts = getPartsFromPositions(positionsNames);
      if (parts) {
        showParts(stageRef, parts, color, onSelectActor, onActorDblClick);
      }

      hideInfo();
    }
  };

  const showInfo = (message) => {
    showNotification({
      id: "loadind-data-notification",
      disallowClose: true,
      title: t("message.loadingData"),
      message: message,
      loading: true,
    });
  };

  const hideInfo = () => {
    hideNotification("loadind-data-notification");
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

  const loadData = async (site, floor) => {
    const params = {
      token: user.token,
      siteId: site.id,
      floorId: floor.id,
      types: "2,10",
    };

    setLoading(true);

    showInfo(t("label.wmsApiAuth"));
    await authenticateWms();

    showInfo(t("label.layouts"));
    const layouts = await findLayoutByFloorId(params);

    if (layouts && layouts.length > 0) {
      const n = (1.0 / layouts[0].pixelmeterrelation) * PIXEL_METER_RELATION;
      setPixelmeterrelation(n);
      setLayouts(layouts);
    }

    showInfo(t("label.racks"));
    const racks = await findRacksByZoneId(params);
    setRacks(racks);

    showInfo(t("label.markers"));
    const markerts = await findAllLayoutMarkersById(params);
    setMarkers(markerts);

    showInfo(t("label.graph"));
    const graphs = await findAllGraphsHeaders(params);
    if (graphs && graphs.length > 0) {
      const graphHeader = graphs[0];

      const params = {
        token: user.token,
        siteId: site.id,
        floorId: floor.id,
        graphId: graphHeader.id,
      };

      const graph = await findGraphById(params);
      const gr = new GraphRouter(graph);
      gr.build();
      setGraphRoute(gr);
    }

    setLoading(false);
    hideInfo();
  };

  const onFind = (startPos, endPos) => {
    const route = graphRoute.getPath(startPos, endPos);
    const totalDistance = graphRoute.getDistance(route, PIXEL_METER_RELATION);
    setRoute({ route: route, distance: totalDistance });
  };

  return (
    <FloorViewerStateContext.Provider
      value={{
        siteId,
        floorId,
        layouts,
        racks,
        markers,
        actorId,
        pixelmeterrelation,
        actorName,
        route,
        wmsApiToken,
        locationStatus,
        locationTypes,
        trademarks,
        showData,
        setPartsDictionary,
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
              onFilter={loadData}
              loading={loading}
            />
          </Toolbar>

          <FloorPlanView2d
            layouts={layouts}
            pixelMeterRelation={pixelmeterrelation}
            racks={racks}
            markers={markers}
            onSelect={onSelectActor}
            onDblClick={onActorDblClick}
          />

          <ModuleInspector
            actorName={actorName}
            positions={positions}
            opened={positions && positions.length > 0 ? true : false}
            close={() => {
              setPositions(null);
            }}
          />

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
    </FloorViewerStateContext.Provider>
  );
};

export default Viewer;
