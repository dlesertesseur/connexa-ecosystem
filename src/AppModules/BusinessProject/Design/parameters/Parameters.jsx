import React, { useEffect, useState } from "react";
import ResponceNotification from "../../../../Modal/ResponceNotification";
import ProjectHeader from "./ProjectHeader";
import SortedTable from "../../../../Components/Crud/SortedTable";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { CreatePage } from "./CreatePage";
import { UpdatePage } from "./UpdatePage";
import { DeletePage } from "./DeletePage";
import { AbmParametersStateContext, AbmStateContext } from "../Context";
import { findBusinessProjectsById } from "../../../../DataAccess/BusinessProject";
import { Route, Routes, useNavigate } from "react-router-dom";
import { HEADER_HIGHT } from "../../../../Constants";
import { Stack } from "@mantine/core";
import { useContext } from "react";

const Parameters = () => {
  const { user } = useSelector((state) => state.auth.value);
  const { selectedRowId } = useContext(AbmStateContext);
  const { t } = useTranslation();
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedParameterId, setSelectedParameterId] = useState(null);
  const [reloadParameters, setReloadParameters] = useState(null);
  const [project, setProject] = useState(null);
  const navigate = useNavigate();

  const HEADER = 32;

  const getData = async () => {
    const params = { token: user.token, id: selectedRowId };
    const ret = await findBusinessProjectsById(params);
    setProject(ret);
    setRows(ret.parameters);
  };

  useEffect(() => {
    getData();
  }, [selectedRowId, reloadParameters]);

  let col = 0;
  const cols = t("businessProcess.parameters.columns", { returnObjects: true });
  const columns = [
    { headerName: cols[col++], fieldName: "name", align: "left" },
    { headerName: cols[col++], fieldName: "description", align: "left" },
    { headerName: cols[col++], fieldName: "type", align: "left" },
  ];

  const ret = rows ? (
    <AbmParametersStateContext.Provider
      value={{
        reloadParameters,
        setReloadParameters,
        selectedParameterId,
        setSelectedParameterId,
      }}
    >
      <Stack spacing={"xs"}>
        <Stack
          justify="flex-start"
          sx={(theme) => ({
            backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
          })}
        >
          <ProjectHeader project={project} h={HEADER} />

          <Routes>
            <Route
              path="/"
              element={
                <SortedTable
                  data={rows}
                  columns={columns}
                  loading={loading}
                  enableCreateButton={true}
                  rowSelected={selectedParameterId}
                  setRowSelected={setSelectedParameterId}
                  headerHeight={HEADER_HIGHT + HEADER + 32}
                  backButton={() => {
                    navigate("../");
                  }}
                />
              }
            ></Route>
            <Route path="create" element={<CreatePage projectId={project?.id} />} />
            <Route path="update" element={<UpdatePage projectId={project?.id}/>} />
            <Route path="delete" element={<DeletePage projectId={project?.id}/>} />
          </Routes>
        </Stack>
      </Stack>

      <ResponceNotification
        opened={error ? true : false}
        onClose={() => {
          setError(null);
        }}
        code={error}
        title={t("status.error")}
        text={error}
      />
    </AbmParametersStateContext.Provider>
  ) : null;

  return ret;
};

export default Parameters;
