import React, { useEffect, useState } from "react";
import ResponceNotification from "../../../../Modal/ResponceNotification";
import SortedTable from "../../../../Components/Crud/SortedTable";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { CreatePage } from "./CreatePage";
import { UpdatePage } from "./UpdatePage";
import { DeletePage } from "./DeletePage";
import { AbmStateContext, AbmValuesStateContext } from "../Context";
import { Route, Routes, useNavigate } from "react-router-dom";
import { HEADER_HIGHT } from "../../../../Constants";
import { Stack } from "@mantine/core";
import { useContext } from "react";
import { findDataSourceById } from "../../../../DataAccess/DataSource";
import DataSourceHeader from "../DataSourceHeader";

const Values = () => {
  const { user } = useSelector((state) => state.auth.value);
  const { selectedRowId } = useContext(AbmStateContext);
  const { t } = useTranslation();
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedValueId, setSelectedValueId] = useState(null);
  const [reloadValues, setReloadValues] = useState(null);
  const [dataSource, setDataSource] = useState(null);
  const navigate = useNavigate();

  const HEADER = 32;

  const getData = async () => {
    const params = { token: user.token, id: selectedRowId };

    try {
      const ret = await findDataSourceById(params);
      setDataSource(ret);
      setRows(ret.children ? ret.children : []);
    } catch (error) {
      setError(error); 
    }
  };

  useEffect(() => {
    getData();
  }, [selectedRowId, reloadValues]);

  let col = 0;
  const cols = t("dataSourceValues.columns", { returnObjects: true });
  const columns = [
    { headerName: cols[col++], fieldName: "code", align: "left" },
    { headerName: cols[col++], fieldName: "name", align: "left" },
    { headerName: cols[col++], fieldName: "description", align: "left" },
  ];

  const ret = rows ? (
    <AbmValuesStateContext.Provider
      value={{
        reloadValues,
        setReloadValues,
        selectedValueId,
        setSelectedValueId,
        rows
      }}
    >
      <Stack spacing={"xs"}>
        <Stack
          justify="flex-start"
          sx={(theme) => ({
            backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
          })}
        >
          <DataSourceHeader text={t("dataSourceValues.label.values")} dataSource={dataSource}/>

          <Routes>
            <Route
              path="/"
              element={
                <SortedTable
                  data={rows}
                  columns={columns}
                  loading={loading}
                  enableCreateButton={true}
                  rowSelected={selectedValueId}
                  setRowSelected={setSelectedValueId}
                  headerHeight={HEADER_HIGHT + HEADER + 32}
                  backButton={() => {
                    navigate("../");
                  }}
                />
              }
            ></Route>
            <Route path="create" element={<CreatePage/>} />
            <Route path="update" element={<UpdatePage/>} />
            <Route path="delete" element={<DeletePage/>} />
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
    </AbmValuesStateContext.Provider>
  ) : null;

  return ret;
};

export default Values;
