import React, { useEffect, useState } from "react";
import CrudFrame from "../../../Components/Crud/CrudFrame";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { CreatePage } from "./CreatePage";
import { UpdatePage } from "./UpdatePage";
import { DeletePage } from "./DeletePage";
import { AbmStateContext } from "./Context";
import { findAllComexRecaps } from "../../../DataAccess/ComexRecap";
import { ComexType } from "../../../Constants/ComexType";

const DynamicApp = ({ app }) => {
  const { user } = useSelector((state) => state.auth.value);

  const { t } = useTranslation();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [reload, setReload] = useState(null);

  const getData = async () => {
    const params = {
      token: user.token,
      type: ComexType.RECAP_CREATED
    };

    try {
      const list = await findAllComexRecaps(params);
      setRows(list);
    } catch (error) {

    }
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, [user, reload]);

  let col = 0;
  const cols = t("comex.recap.columns", { returnObjects: true });
  const columns = [
    { headerName: cols[col++], fieldName: "id", align: "right" },
    { headerName: cols[col++], fieldName: "creationDate", align: "center" },
    { headerName: cols[col++], fieldName: "description", align: "center" },
    { headerName: cols[col++], fieldName: "event", align: "left" },
    { headerName: cols[col++], fieldName: "supplier", align: "left" },
    { headerName: cols[col++], fieldName: "country", align: "left" },
  ];

  const ret = rows ? (
    <AbmStateContext.Provider value={{ reload, setReload, selectedRowId }}>
      <CrudFrame
        app={app}
        columns={columns}
        data={rows}
        rowSelected={selectedRowId}
        enableCreateButton={true}
        setRowSelected={(id) => {
          setSelectedRowId(id);
        }}
        createPage={<CreatePage />}
        updatePage={<UpdatePage />}
        deletePage={<DeletePage />}
      />
    </AbmStateContext.Provider>
  ) : null;

  return ret;
};

export default DynamicApp;
