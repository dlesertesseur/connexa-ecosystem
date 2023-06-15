import React, { useState } from "react";
import Toolbar from "./Toolbar";
import ViewHeader from "../../ViewHeader";
import FloorPlanView2d from "./FloorPlanView2d";
import { useSelector } from "react-redux";
import { PIXEL_METER_RELATION } from "../../../../Constants";
import { Stack } from "@mantine/core";
import { findLayoutByFloorId, findRacksByZoneId } from "../../../../DataAccess/Surfaces";
import { FilterControl } from "../Controls/FilterControl";
import { findAllLayoutMarkersById } from "../../../../DataAccess/LayoutsMarkers";
import { FloorViewerStateContext } from "./Context";
import { showParts } from "../../../../Components/Builder2d";
import ModuleInspector from "./modal/ModuleInspector";

const Viewer = ({ app }) => {
  const [actorId, setActorId] = useState(null);
  const [siteId, setSiteId] = useState(null);
  const [floorId, setFloorId] = useState(null);
  const [layouts, setLayouts] = useState(null);
  const [racks, setRacks] = useState(null);
  const [loading, setLoading] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [pixelmeterrelation, setPixelmeterrelation] = useState(null);
  const [partsMap, setPartsMap] = useState(null);
  const [stageRef, setStageRef] = useState(null);
  const [moduleInspectorOpen, setModuleInspectorOpen] = useState(false);

  const { user } = useSelector((state) => state.auth.value);
  // const wSize = useWindowSize();

  const setPartsDictionary = (stageRef, partsMap) => {
    setPartsMap(partsMap);
    setStageRef(stageRef);
  };

  const onActorDblClick = (attrs) => {
    console.log("### Viewer ### onActorDblClick -> attrs:", attrs);
    setModuleInspectorOpen(true);
  };

  const onSelectActor = (id) => {
    console.log("### Viewer ### onSelectActor -> id:" + id);
    setActorId(id);
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

  const getDummyPositions = (items, amount = 1) => {
    const ret = [];

    for (let index = 0; index < amount; index++) {
      const item = items[Math.floor(Math.random() * items.length)];
      ret.push(item);
    }
    return ret;
  };

  const showData = async (filter, data, color) => {
    let parts = null;
    let positions = null;

    let keys = Array.from(partsMap.keys());

    if (partsMap) {
      switch (filter) {
        case 1:
          positions = getDummyPositions(keys);
          break;

        case 2:
          positions = getDummyPositions(keys, 10);
          break;

        case 3:
          positions = getDummyPositions(keys, 100);
          break;

        case 4:
          positions = getDummyPositions(keys, 200);
          break;

        default:
          break;
      }

      parts = getPartsFromPositions(positions);
      if (parts) {
        showParts(stageRef, parts, color, onSelectActor, onActorDblClick);
      }
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

    const layouts = await findLayoutByFloorId(params);

    const n = (1.0 / layouts[0].pixelmeterrelation) * PIXEL_METER_RELATION;
    setPixelmeterrelation(n);
    setLayouts(layouts);

    const racks = await findRacksByZoneId(params);
    setRacks(racks);

    const markerts = await findAllLayoutMarkersById(params);
    setMarkers(markerts);
    setLoading(false);
  };

  return (
    <FloorViewerStateContext.Provider
      value={{ siteId, floorId, layouts, racks, markers, actorId, pixelmeterrelation, showData, setPartsDictionary }}
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
          <Toolbar>
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
            opened={moduleInspectorOpen}
            close={() => {
              setModuleInspectorOpen(false);
            }}
            actorId={actorId}
          />
        </Stack>
      </Stack>
    </FloorViewerStateContext.Provider>
  );
};

export default Viewer;
