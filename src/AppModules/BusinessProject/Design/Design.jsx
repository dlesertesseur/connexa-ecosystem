import React from "react";
import DesignToolbar from "./DesignToolbar";
import DesignHeader from "./DesignHeader";
import { Stack } from "@mantine/core";
import { useEffect } from "react";
import { useContext } from "react";
import { AbmStateContext } from "./Context";
import { useState } from "react";
import { useSelector } from "react-redux";
import { findBusinessProjectsById } from "../../../DataAccess/BusinessProject";
import Designer from "./Designer";

const Design = () => {
  const { user } = useSelector((state) => state.auth.value);
  const { selectedRowId } = useContext(AbmStateContext);
  const [project, setProject] = useState(null);

  const getData = async () => {
    const params = { token: user.token, id: selectedRowId };
    const ret = await findBusinessProjectsById(params);
    setProject(ret);
  };

  useEffect(() => {
    getData();
  }, [selectedRowId]);

  return (
    <Stack spacing={"xs"}>
      <DesignHeader project={project} />
      <DesignToolbar />
      <Designer/>
    </Stack>
  );
};

export default Design;
