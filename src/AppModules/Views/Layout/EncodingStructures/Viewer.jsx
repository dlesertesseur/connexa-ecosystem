import React, { useState } from "react";
import Toolbar from "./Toolbar";
import ViewHeader from "../../ViewHeader";
import FloorPlanView2d from "./FloorPlanView2d";
import AssignNames from "./modal/AssignNames";
import { useSelector } from "react-redux";
import { PIXEL_METER_RELATION } from "../../../../Constants";
import { Stack } from "@mantine/core";
import { findLayoutByFloorId, findRacksByZoneId } from "../../../../DataAccess/Surfaces";
import { FilterControl } from "../Controls/FilterControl";
import { findAllLayoutMarkersById } from "../../../../DataAccess/LayoutsMarkers";
import { useWindowSize } from "../../../../Hook";
import { FloorViewerStateContext } from "./Context";

const Viewer = ({ app }) => {
  const [actorId, setActorId] = useState(null);
  const [siteId, setSiteId] = useState(null);
  const [floorId, setFloorId] = useState(null);
  const [layouts, setLayouts] = useState(null);
  const [racks, setRacks] = useState(null);
  const [loading, setLoading] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [structureDetail, setStructureDetail] = useState(false);
  const [pixelmeterrelation, setPixelmeterrelation] = useState(null);
  const [openAssignNames, setOpenAssignNames] = useState(false);
  const [selectedRack, setSelectedRack] = useState(null);

  const { user } = useSelector((state) => state.auth.value);
  const wSize = useWindowSize();

  const onActorDblClick = (userData) => {
    console.log("### Viewer ### onActorDblClick -> modules:" + userData);
    setSelectedRack(userData);
    setOpenAssignNames(true);
  };

  const onSelectActor = (id) => {
    console.log("### Viewer ### onSelectActor -> id:" + id);
    setActorId(id);
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
      value={{
        siteId,
        floorId,
        layouts,
        racks,
        markers,
        actorId,
        pixelmeterrelation,
        structureDetail,
        setStructureDetail,
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
            structureDetail={structureDetail}
          />
        </Stack>
      </Stack>
      <AssignNames
        opened={openAssignNames}
        close={() => {
          setOpenAssignNames(false);
        }}
        structure={selectedRack}
      />
    </FloorViewerStateContext.Provider>
  );
};

export default Viewer;
