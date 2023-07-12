import React, { useState } from "react";
import Toolbar from "./Toolbar";
import View2DRef from "../../../Components/View2dRef";
import { useRef } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { PIXEL_METER_RELATION, TOOLBAR_HIGHT, DIVIDER_HIGHT } from "../../../Constants";
import { Stack } from "@mantine/core";
import { findOperator } from "../../../DataAccess/Operators";
import { findLayoutByFloorId, findRacksByZoneId } from "../../../DataAccess/Surfaces";
import { FilterControl } from "../Controls/FilterControl";

const SurfaceMap = ({ updateTime = 3000, editingEnabled = false, inspectRack, drawCenter = false }) => {
  const [anchorPointIndex, setAnchorPointIndex] = useState(0);
  const [operatorsStatus, setOperatorsStatus] = useState(false);
  const [selectedRack, setSelectedRack] = useState(null);
  const [momentum, setMomentum] = useState(1);
  const [operatorList, setOperatorList] = useState([]);
  const [maxAnchorPoints, setMaxAnchorPoints] = useState(0);
  const [rendering, setRedering] = useState(false);
  const [siteId, setSiteId] = useState(null);
  const [floorId, setFloorId] = useState(null);
  const [floor, setFloor] = useState(null);
  const [layouts, setLayouts] = useState(null);
  const [racks, setRacks] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pixelmeterrelation, setPixelmeterrelation] = useState(null);

  const { user } = useSelector((state) => state.auth.value);
  const { bodyContainerWidth, bodyContainerHeight } = useSelector((state) => state.app.value);

  //DRAW OPERATORS STATUS
  useEffect(() => {
    if (operatorsStatus) {
      const timeToRefresh = 250;
      const timer = setTimeout(() => {
        if (anchorPointIndex < maxAnchorPoints) {
          setAnchorPointIndex(anchorPointIndex + 1);
          console.log("###     DRAW OPERATORS STATUS index: " + anchorPointIndex);
        } else {
          setRedering(false);
        }
      }, timeToRefresh);
      return () => clearTimeout(timer);
    }
  }, [anchorPointIndex, maxAnchorPoints, operatorsStatus]);

  //GET OPERARTOR STATUS
  useEffect(() => {
    if (!rendering && operatorsStatus) {
      const timer = setTimeout(() => {
        const params = {
          token: user.token,
          site: 999,
          momentum: momentum,
          operators: operatorList,
        };

        findOperator(params).then((response) => {
          let ret = 0;
          response.forEach((e) => {
            if (ret < e.anchorPoints?.length) {
              ret = e.anchorPoints?.length;
            }
          });

          console.log("### GET OPERARTOR STATUS steps: " + ret, response);

          setOperatorList(response);
          setMomentum(momentum + 1);
          setMaxAnchorPoints(ret);
          setAnchorPointIndex(0);
          if (ret > 0) {
            setRedering(true);
          }
        });
      }, updateTime);
      return () => clearTimeout(timer);
    }
  }, [momentum, operatorList, updateTime, user, rendering, operatorsStatus]);

  const onRackDblClick = (ref, rack) => {
    inspectRack(selectedRack);
  };

  const onRackClick = (ref, rack) => {

    setSelectedRack(rack);
    if (editingEnabled) {
      const transformNode = trRef.current;
      transformNode.nodes([ref.current]);
    }
  };

  const onOption = (option) => {
    if (option === "operatorsStatus") {
      setOperatorsStatus(true);
    } else {
      setOperatorsStatus(false);
    }
  };

  const loadData = (site, floor) => {
    const params = {
      token: user.token,
      siteId: site.id,
      floorId: floor.id,
    };

    const n = (1.0 / floor.pixelmeterrelation) * PIXEL_METER_RELATION;
    setPixelmeterrelation(n);

    setLoading(true);

    findLayoutByFloorId(params).then((ret) => {
      setLayouts(ret);
      findRacksByZoneId(params).then((ret) => {
        setRacks(ret);
        setLoading(false);
      });
    });
  };

  const trRef = useRef();

  return (
    <Stack
      justify="flex-start"
      spacing="0"
      sx={(theme) => ({
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
          setFloor={setFloor}
        />
      </Toolbar>
      
      <View2DRef
        width={bodyContainerWidth}
        height={bodyContainerHeight - (TOOLBAR_HIGHT + DIVIDER_HIGHT)}
        layouts={layouts}
        pixelMeterRelation={pixelmeterrelation}
        racks={racks}
        //markers={markers}
        onSelect={onRackClick}
        onDblClick={onRackDblClick}
      />
      {console.log("REPAINT ----> SurfaceMap " + Date.now())}
    </Stack>
  );
};

export default SurfaceMap;
