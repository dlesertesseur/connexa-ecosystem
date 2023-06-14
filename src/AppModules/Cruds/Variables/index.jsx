import React, { useEffect, useState } from "react";
import CrudFrame from "../../../Components/Crud/CrudFrame";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { CreatePage } from "./CreatePage";
import { UpdatePage } from "./UpdatePage";
import { DeletePage } from "./DeletePage";
import { AbmStateContext } from "./Context";
import { findAllVariables } from "../../../DataAccess/Variables";

const DynamicApp = (param) => {
  const { app } = param;
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const [rows, setRows] = useState([]);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [reload, setReload] = useState(null);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    const params = {
      token: user.token,
    };
    
    try {
      const variables = await findAllVariables(params);
      const list = variables?.map((v) => {
        const row = { id: v.id, name: v.name, value: v.value };
        return row;
      });
      setRows(list);
    } catch (error) {

    }
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, [user, reload]);

  const cols = t("crud.variables.columns", { returnObjects: true });
  const columns = [
    { headerName: cols[0], fieldName: "name", align: "left"},
    { headerName: cols[1], fieldName: "value", align: "left" },
  ];

  const ret = (
    <AbmStateContext.Provider value={{ reload, setReload, selectedRowId }}>
      <CrudFrame
        app={app}
        columns={columns}
        data={rows}
        loading={loading}
        rowSelected={selectedRowId}
        setRowSelected={setSelectedRowId}
        enableCreateButton={true}
        createPage={<CreatePage />}
        updatePage={<UpdatePage />}
        deletePage={<DeletePage />}
      />
    </AbmStateContext.Provider>
  );

  return ret;
};

export default DynamicApp;
