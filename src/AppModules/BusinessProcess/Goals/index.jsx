import React, { useEffect, useState } from "react";
import CrudFrame from "../../../Components/Crud/CrudFrame";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { CreatePage } from "./CreatePage";
import { UpdatePage } from "./UpdatePage";
import { DeletePage } from "./DeletePage";
import { AbmStateContext } from "./Context";
import { findAllBusinessGoals } from "../../../DataAccess/BusinessGoal";
import ResponceNotification from "../../../Modal/ResponceNotification";

const DynamicApp = ({ app }) => {
  const { user } = useSelector((state) => state.auth.value);
  const { t } = useTranslation();
  const [rows, setRows] = useState([]);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [reload, setReload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const getData = async () => {
    const params = {
      token: user.token,
    };

    try {
      const rows = await findAllBusinessGoals(params);
      setRows(rows);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, [user, reload]);

  const cols = t("crud.businessGoal.columns", { returnObjects: true });
  const columns = [
    { headerName: cols[0], fieldName: "name", align: "left" },
    // { headerName: cols[1], fieldName: "description", align: "left" },
    { headerName: cols[2], fieldName: "startDate", align: "center", type:"date", width:150 },
    { headerName: cols[3], fieldName: "endDate", align: "center", type:"date", width:150 },
  ];

  const ret = (
    <AbmStateContext.Provider value={{ reload, setReload, selectedRowId }}>
      <ResponceNotification
        opened={errorMessage ? true : false}
        onClose={() => {
          setErrorMessage(null);
        }}
        code={errorMessage}
        title={t("status.error")}
        text={errorMessage}
      />

      <CrudFrame
        app={app}
        columns={columns}
        data={rows}
        rowSelected={selectedRowId}
        setRowSelected={setSelectedRowId}
        loading={loading}
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
