import React, { useEffect, useState } from "react";
import ResponceNotification from "../../../../Modal/ResponceNotification";
import SortedTable from "../../../../Components/Crud/SortedTable";
import BusinessProcessHeader from "../BusinessProcessHeader";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { CreatePage } from "./CreatePage";
import { UpdatePage } from "./UpdatePage";
import { DeletePage } from "./DeletePage";
import { AbmParametersStateContext, AbmStateContext } from "../Context";
import { Route, Routes, useNavigate } from "react-router-dom";
import { HEADER_HIGHT } from "../../../../Constants";
import { Stack } from "@mantine/core";
import { useContext } from "react";
import { findAllBusinessProcessModelParameters, findBusinessProcessModelById } from "../../../../DataAccess/BusinessProcessModel";

const Parameters = () => {
  const { user } = useSelector((state) => state.auth.value);
  const { selectedRowId } = useContext(AbmStateContext);
  const { t } = useTranslation();
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedParameterId, setSelectedParameterId] = useState(null);
  const [reloadParameters, setReloadParameters] = useState(null);
  const [businessProcessModel, setBusinessProcessModel] = useState(null);
  const navigate = useNavigate();

  const HEADER = 32;

  const getData = async () => {
    const params = { token: user.token, id: selectedRowId };

    try {
      const bm = await findBusinessProcessModelById(params);
      setBusinessProcessModel(bm);
      const ret = await findAllBusinessProcessModelParameters(params);
      setRows(ret ? ret : []);
    } catch (error) {
      setError(error); 
    }
  };

  useEffect(() => {
    getData();
  }, [selectedRowId, reloadParameters]);

  let col = 0;
  const cols = t("businessProcessModel.parameters.columns", { returnObjects: true });
  const columns = [
    { headerName: cols[col++], fieldName: "name", align: "left" },
    { headerName: cols[col++], fieldName: "value", align: "left" },
    { headerName: cols[col++], fieldName: "defaultValue", align: "left" },
    { headerName: cols[col++], fieldName: "required", align: "center", format:"bool" },
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
          <BusinessProcessHeader text={t("businessProcessModel.label.parameters")} businessProcess={businessProcessModel}/>

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
            <Route path="create" element={<CreatePage businessProcessId={businessProcessModel?.id} />} />
            <Route path="update" element={<UpdatePage businessProcessId={businessProcessModel?.id}/>} />
            <Route path="delete" element={<DeletePage businessProcessId={businessProcessModel?.id}/>} />
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
