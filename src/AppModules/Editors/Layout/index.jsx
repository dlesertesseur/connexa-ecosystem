import React, { useEffect, useState } from "react";
import ResponceNotification from "../../../Modal/ResponceNotification";
import Editor from "./Editor";
import EditorHeader from "./EditorHeader";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { EditorStateContext } from "./Context";
import { Button, Group, LoadingOverlay, Stack } from "@mantine/core";
import { useWindowSize } from "../../../Hook";
import { HEADER_HIGHT, PIXEL_METER_RELATION } from "../../../Constants";
import { findAllLayoutMarkersById } from "../../../DataAccess/LayoutsMarkers";
import { findLayoutByFloorId, findRacksByZoneId } from "../../../DataAccess/Surfaces";
import { useNavigate } from "react-router-dom";

const DynamicApp = ({ app }) => {
  const { user } = useSelector((state) => state.auth.value);
  const { t } = useTranslation();
  const [reload, setReload] = useState(null);
  const [loading, setLoading] = useState(false);
  const [site, setSite] = useState(null);
  const [floor, setFloor] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [structureName, setStructureName] = useState(null);
  const [modelStructure, setModelStructure] = useState(null);
  const [pixelmeterrelation, setPixelmeterrelation] = useState(null);
  const [Layouts, setLayouts] = useState(null);
  const [racks, setRacks] = useState(null);
  const [markers, setMarkers] = useState(null);
  const [selectedPart, setSelectedPart] = useState(null);
  const navigate = useNavigate();
  const wSize = useWindowSize();

  const initilizeContext = () => {
    setModelStructure(null);
    setStructureName(null);
    console.log("initilizeContext -> ");
  };

  const getData = async () => {
    const params = {
      token: user.token,
      siteId: site,
      floorId: floor,
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
    setStructureName(null);
    if (site && floor) {
      getData();
    }
  }, [user, reload]);

  const refresh = () => {
    setReload(Date.now());
  };

  const ret = (
    <EditorStateContext.Provider
      value={{
        refresh,
        site,
        setSite,
        floor,
        setFloor,
        structureName,
        setStructureName,
        modelStructure,
        setModelStructure,
        initilizeContext,
        racks,
        Layouts,
        markers,
        selectedPart, 
        setSelectedPart
      }}
    >
      <Stack
        justify="stretch"
        spacing="xs"
        sx={(theme) => ({
          backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
          height: "100%",
          width: "100%",
        })}
      >
        <ResponceNotification
          opened={errorMessage ? true : false}
          onClose={() => setErrorMessage(null)}
          code={errorMessage}
          title={t("status.error")}
          text={errorMessage}
        />

        <LoadingOverlay overlayOpacity={0.5} visible={loading} />

        <EditorHeader app={app} />
        <Group position="center" spacing={0} h={wSize.height - (HEADER_HIGHT -50)}>
          <Editor />
        </Group>

        {/* <Group position="right" mt="xs" mb="xs" width="100%">
          <Button
            onClick={() => {
              onSave();
            }}
          >
            {t("button.accept")}
          </Button>
          <Button
            onClick={(event) => {
              initilizeContext();
              navigate(-1);
            }}
          >
            {t("button.cancel")}
          </Button>
        </Group> */}
      </Stack>
    </EditorStateContext.Provider>
  );

  return ret;
};

export default DynamicApp;
