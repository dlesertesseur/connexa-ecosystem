import React, { useState } from "react";
import Toolbar from "./Toolbar";
import View2D from "../../../../Components/View2D";
import EditingLayout from "../Model/EditingLayout";
import useImage from "use-image";
import ViewHeader from "../../ViewHeader";
import uuid from "react-uuid";
import Measurement from "../../../../Components/View2D/Measurement";
import { useSelector } from "react-redux";
import { Stack } from "@mantine/core";
import { findLayoutByFloorId, saveLayout } from "../../../../DataAccess/Surfaces";
import { API, DIVIDER_HIGHT, TOOLBAR_HIGHT, VIEW_HEADER_HIGHT } from "../../../../Constants";
import { FilterControl } from "../Controls/FilterControl";
import { Group, Image, Layer, Line } from "react-konva";
import { createPartTemplate } from "../../../../Util";
import { useHotkeys } from "@mantine/hooks";
import { findAllImagesByFloorById } from "../../../../DataAccess/Floors";

const Editor = ({ inspectRack, drawCenter = true, app }) => {
  const { user } = useSelector((state) => state.auth.value);
  const { bodyContainerWidth, bodyContainerHeight } = useSelector((state) => state.app.value);

  const [parts, setParts] = useState([]);
  const [savingData, setSavingData] = useState(false);
  const [siteId, setSiteId] = useState(null);
  const [floorId, setFloorId] = useState(null);
  const [setFloor] = useState(null);
  const [layout, setLayout] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pixelmeterrelation, setPixelmeterrelation] = useState(null);
  const [editingPartId, setEditingPartId] = useState(null);
  const [selectedPartId, setSelectedPartId] = useState(null);
  const [repaint, setRepaint] = useState(null);
  const [backImageUrl, setBackImageUrl] = useState(null);
  const [adjustImage, setAdjustImage] = useState(false);
  const [editPointSelected, setEditPointSelected] = useState(null);
  const [showMeasurementPoints, setShowMeasurementPoints] = useState(false);
  const [distanceInMeters, setDistanceInMeters] = useState(1);
  const [distanceInPixels, setDistanceInPixels] = useState(1);
  const [imageList, setImageList] = useState([]);
  const [partType, setPartType] = useState(null);

  const [image] = useImage(backImageUrl);

  const saveData = () => {
    setSavingData(true);

    layout.parts = parts;
    layout.pixelmeterrelation = pixelmeterrelation;
    layout.image = backImageUrl;
    const params = {
      token: user.token,
      siteId: siteId,
      floorId: floorId,
      layoutId: layout.id,
      layout: layout,
    };
    saveLayout(params).then(() => {
      setSavingData(false);
    });
  };

  const onOption = (option, params) => {
    if (option === "save") {
      saveData();
    }

    if (option === "addPart") {
      setEditingPartId(uuid());
      setPartType(params);
    }

    if (option === "finishEditing") {
      setEditingPartId(null);
      setEditPointSelected(null);
    }

    if (option === "loadImage") {
      const url = API.floor.urlBase + params;
      setBackImageUrl(url);
    }

    if (option === "calculatePixelMeterRelation") {
      const relation = distanceInPixels / distanceInMeters;
      setPixelmeterrelation(relation);
    }
  };

  const loadData = (site, floor) => {
    const params = {
      token: user.token,
      siteId: site.id,
      floorId: floor.id,
    };

    setLoading(true);
    setEditingPartId(null);
    setSelectedPartId(null);
    setLayout(null);
    setParts(null);

    findLayoutByFloorId(params).then((ret) => {
      setLayout(ret[0]);
      setParts(ret[0]?.parts);
      setBackImageUrl(ret[0].image);

      setPixelmeterrelation(ret[0].pixelmeterrelation);

      findAllImagesByFloorById(params).then((list) => {
        setImageList(list);
        setLoading(false);
      });
    });
  };

  const onSelect = (e, clickPos) => {
    const parent = e.target.getParent();

    if (parent !== null && parent.attrs.id !== "imageBack-group") {
      setSelectedPartId(parent.id());
    } else {
      setSelectedPartId(null);
      if (editingPartId) {
        const part = parts?.find((p) => p.id === editingPartId);

        if (part) {
          const points = part?.geometries[0].points;
          const point = {
            id: uuid(),
            ordernumber: points.length + 1,
            positionx: clickPos.x - (part.positionx * pixelmeterrelation),
            positiony: clickPos.y - (part.positionz * pixelmeterrelation),
            positionz: null,
            texturated: null,
            timestamp: null,
          };

          points.push(point);
          setRepaint(Date.now());
        } else {
          /*CREA LA PARTE CON CENTRO EN LA POSICION DE CLICK Y AGREGA UN PUNTO EN EL (0,0)*/
          const part = createPartTemplate(editingPartId, clickPos.x / pixelmeterrelation, clickPos.y / pixelmeterrelation, partType);
          const points = part?.geometries[0].points;
          const point = {
            id: uuid(),
            ordernumber: 0,
            positionx: 0,
            positiony: 0,
            positionz: null,
            texturated: null,
            timestamp: null,
          };
          points.push(point);
          setParts([...parts, part]);
        }
      }
    }
  };

  const onDblClick = (e) => {
    const parent = e.target.getParent();
    if (parent !== null) {
      setEditingPartId(parent.id());
    }
  };

  const deleteObject = () => {
    if (editPointSelected !== null) {
      const part = parts.find((p) => p.id === editingPartId);
      if (part) {
        const geometry = part.geometries[0];
        const points = geometry.points;
        const fileredPoints = points.filter((p) => p.id !== editPointSelected);
        geometry.points = fileredPoints;
        setParts([...parts]);
      }
    } else {
      if (selectedPartId !== null) {
        const part = parts.find((p) => p.id === selectedPartId);
        if (part) {
          const fileredParts = parts.filter((p) => p.id !== selectedPartId);
          setParts([...fileredParts]);
        }
      }
    }
  };

  useHotkeys([["ctrl+d", () => deleteObject()]]);

  const BackImage = () => {
    return (
      <Group
        id={"imageBack-group"}
        x={layout.imagePositionx}
        y={layout.imagePositiony}
        draggable={adjustImage}
        onDragEnd={(e) => {
          layout.imagePositionx = e.target.x();
          layout.imagePositiony = e.target.y();
          console.log(layout);
        }}
      >
        <Image image={image} />
      </Group>
    );
  };

  return (
    <Stack>
      <ViewHeader app={app} />
      <Stack
        justify="flex-start"
        spacing="0"
        sx={(theme) => ({
          backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[2],
          height: "100%",
          border: "solid 1px" + theme.colors.gray[4],
        })}
      >
        <Toolbar
          onOption={onOption}
          editing={editingPartId ? true : false}
          disabled={loading || layout === null}
          imageSelected={backImageUrl ? true : false}
          adjustImage={adjustImage}
          setAdjustImage={setAdjustImage}
          showMeasurementPoints={showMeasurementPoints}
          setShowMeasurementPoints={setShowMeasurementPoints}
          distanceInMeters={distanceInMeters}
          setDistanceInMeters={setDistanceInMeters}
          defineRelationship={pixelmeterrelation ? false : true}
          imageList={imageList}
        >
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

        <View2D
          width={bodyContainerWidth}
          height={bodyContainerHeight - (TOOLBAR_HIGHT + 2 + VIEW_HEADER_HIGHT + DIVIDER_HIGHT)}
          working={savingData}
          onSelect={onSelect}
          onDblClick={onDblClick}
        >
          <Layer id="structure">
            {layout && backImageUrl ? <BackImage /> : null}

            {layout ? (
              <EditingLayout
                pixelMeterRelation={pixelmeterrelation ? pixelmeterrelation : 1}
                editingEnabled={true}
                layout={layout}
                setParts={setParts}
                parts={parts}
                selectedPartId={selectedPartId}
                editingPartId={editingPartId}
                editPointSelected={editPointSelected}
                setEditPointSelected={setEditPointSelected}
              />
            ) : null}

            {backImageUrl ? <Measurement visible={showMeasurementPoints} setDistance={setDistanceInPixels} /> : null}
          </Layer>

          {drawCenter ? (
            <Layer id="centerPoint">
              <Group x={0} y={0}>
                <Line x={0} y={0} points={[-20, 0, 20, 0]} stroke="#ff0000" strokeWidth={1} />
                <Line x={0} y={0} points={[0, -20, 0, 20]} stroke="#ff0000" strokeWidth={1} />
              </Group>
            </Layer>
          ) : null}
        </View2D>
      </Stack>
      {/* {console.log("REPAINT -> " + repaint)} */}
    </Stack>
  );
};

export default Editor;
