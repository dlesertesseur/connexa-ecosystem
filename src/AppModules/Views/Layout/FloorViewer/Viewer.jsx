import React, { useState } from "react";
import Toolbar from "./Toolbar";
import View2DRef from "../../../../Components/View2dRef";
import ViewHeader from "../../ViewHeader";
import { useSelector } from "react-redux";
import { DIVIDER_HIGHT, PIXEL_METER_RELATION, TOOLBAR_HIGHT, VIEW_HEADER_HIGHT } from "../../../../Constants";
import { Stack } from "@mantine/core";
import { findLayoutByFloorId, findRacksByZoneId } from "../../../../DataAccess/Surfaces";
import { FilterControl } from "../Controls/FilterControl";
import { findAllLayoutMarkersById } from "../../../../DataAccess/LayoutsMarkers";

const Viewer = ({ updateTime = 3000, editingEnabled = false, inspectRack, drawCenter = false, app}) => {
  const [actorId, setActorId] = useState(null);
  const [siteId, setSiteId] = useState(null);
  const [floorId, setFloorId] = useState(null);
  const [layouts, setLayouts] = useState(null);
  const [racks, setRacks] = useState(null);
  const [loading, setLoading] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [pixelmeterrelation, setPixelmeterrelation] = useState(null);

  const { user } = useSelector((state) => state.auth.value);
  const { bodyContainerWidth, bodyContainerHeight } = useSelector((state) => state.app.value);

  const onActorDblClick = (id) => {
    console.log("### Viewer ### onActorDblClick -> id:" + id);
    //inspectRack(actorId);
  };

  const onSelectActor = (id) => {
    console.log("### Viewer ### onSelectActor -> id:" + id);
    setActorId(id);
  };

  const onOption = (option) => {
    if (option === "operatorsStatus") {
      //   setOperatorsStatus(true);
      // } else {
      //   setOperatorsStatus(false);
    }
  };

  const loadData = (site, floor) => {
    const params = {
      token: user.token,
      siteId: site.id,
      floorId: floor.id,
    };

    setLoading(true);

    findLayoutByFloorId(params).then((ret) => {
      
      const n = (1.0 / ret[0].pixelmeterrelation) * PIXEL_METER_RELATION;
      setPixelmeterrelation(n);

      setLayouts(ret);
      findRacksByZoneId(params).then((ret) => {
        setRacks(ret);
        findAllLayoutMarkersById(params).then((ret) => {
          setMarkers(ret);
          setLoading(false);
        });
      });
    });
  };

  return (
    <Stack>
      <ViewHeader app={app}/>
      <Stack
        justify="flex-start"
        spacing="0"
        sx={(theme, bodyContainerWidth) => ({
          backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[2],
          height: "100%",
          border: "solid 1px" + theme.colors.gray[3],
        })}
      >
        <Toolbar onOption={onOption}>
          <FilterControl
            siteId={siteId}
            setSiteId={setSiteId}
            floorId={floorId}
            setFloorId={setFloorId}
            onFilter={loadData}
            loading={loading}
          />
        </Toolbar>

        <View2DRef
          width={bodyContainerWidth}
          height={bodyContainerHeight - (TOOLBAR_HIGHT + 2 + VIEW_HEADER_HIGHT + DIVIDER_HIGHT)}
          layouts={layouts}
          pixelMeterRelation={pixelmeterrelation}
          racks={racks}
          markers={markers}
          onSelect={onSelectActor}
          onDblClick={onActorDblClick}
        />

        {/* {console.log("REPAINT ----> Viewer " + Date.now())} */}
      </Stack>
    </Stack>
  );
};

export default Viewer;
