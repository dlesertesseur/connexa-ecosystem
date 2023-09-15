import React, { useEffect, useState } from "react";
import ResponceNotification from "../../../../Modal/ResponceNotification";
import SortedTable from "../../../../Components/Crud/SortedTable";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { CreatePage } from "./CreatePage";
import { UpdatePage } from "./UpdatePage";
import { DeletePage } from "./DeletePage";
import { FieldStateContext, AbmStateContext } from "../Context";
import { Route, Routes, useNavigate } from "react-router-dom";
import { HEADER_HIGHT } from "../../../../Constants";
import { Stack } from "@mantine/core";
import { useContext } from "react";
import { findEntityDefinitionById } from "../../../../DataAccess/EntityDefinition";
import EntityDefinitionHeader from "../EntityDefinitionHeader";

const Fields = () => {
  const { user } = useSelector((state) => state.auth.value);
  const { selectedRowId } = useContext(AbmStateContext);
  const { t } = useTranslation();
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedFieldId, setSelectedFieldId] = useState(null);
  const [reloadFields, setReloadFields] = useState(null);
  const [entityDefinition, setEntityDefinition] = useState(null);
  const navigate = useNavigate();

  const HEADER = 32;

  const getData = async () => {
    const params = { token: user.token, id: selectedRowId };
    const ret = await findEntityDefinitionById(params);
    setEntityDefinition(ret);
    setRows(ret?.fields);
    console.log("Fields ->", ret);
  };

  useEffect(() => {
    getData();
  }, [selectedRowId, reloadFields]);

  let col = 0;
  const cols = t("document.field.columns", { returnObjects: true });
  const columns = [
    { headerName: cols[col++], fieldName: "name", align: "left" },
    { headerName: cols[col++], fieldName: "description", align: "left" },
    { headerName: cols[col++], fieldName: "type", align: "left" },
    { headerName: cols[col++], fieldName: "required", align: "left", type:"boolean" },
    { headerName: cols[col++], fieldName: "widget", align: "left" },
  ];

  const ret = rows ? (
    <FieldStateContext.Provider
      value={{
        reloadFields,
        setReloadFields,
        selectedFieldId,
        setSelectedFieldId,
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
          <EntityDefinitionHeader text={t("document.entityDefinition.label.fields")} entityDefinition={entityDefinition}/>

          <Routes>
            <Route
              path="/"
              element={
                <SortedTable
                  data={rows}
                  columns={columns}
                  loading={loading}
                  enableCreateButton={true}
                  rowSelected={selectedFieldId}
                  setRowSelected={setSelectedFieldId}
                  headerHeight={HEADER_HIGHT + HEADER + 32}
                  backButton={() => {
                    navigate("../");
                  }}
                />
              }
            ></Route>
            <Route path="create" element={<CreatePage entityDefinitionId={entityDefinition?.id} />} />
            <Route path="update" element={<UpdatePage entityDefinitionId={entityDefinition?.id}/>} />
            <Route path="delete" element={<DeletePage entityDefinitionId={entityDefinition?.id}/>} />
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
    </FieldStateContext.Provider>
  ) : null;

  return ret;
};

export default Fields;
