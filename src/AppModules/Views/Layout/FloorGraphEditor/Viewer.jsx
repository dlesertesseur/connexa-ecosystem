import React from "react";
import View2d from "./surface/View2d";
import { LoadingOverlay, Stack } from "@mantine/core";
import { useContext } from "react";
import { AbmStateContext } from "./Context";
import { useSelector } from "react-redux";
import { useState } from "react";
import { updateGraph } from "../../../../DataAccess/Graph";

const Viewer = ({action}) => {
  const [working, setWorking] = useState(false);
  const { user } = useSelector((state) => state.auth.value);
  const { site, floor, selectedRowId, setErrorMessage } = useContext(AbmStateContext);

  const onSave = async (graph) => {

    if(selectedRowId){
      graph["id"] = selectedRowId;
    }
    
    const params = {
      token: user.token,
      siteId: site,
      floorId: floor,
      data:graph
    };

    setWorking(true);

    try {
      const ret = await updateGraph(params);
      if (ret.error) {
        setWorking(false);
        setErrorMessage(ret.message);
      } else {
        setErrorMessage(null);
        setWorking(false);
      }
    } catch (error) {
      setErrorMessage(error);
    }
    setWorking(false);
  };

  return (
    <Stack>
      <Stack
        justify="flex-start"
        spacing="0"
        sx={(theme) => ({
          backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[2],
          height: "100%",
          border: "solid 1px" + theme.colors.gray[3],
        })}
      >
        <LoadingOverlay overlayOpacity={0.5} visible={working} />

        <View2d onSave={onSave} action={action}/>
      </Stack>
    </Stack>
  );
};

export default Viewer;
