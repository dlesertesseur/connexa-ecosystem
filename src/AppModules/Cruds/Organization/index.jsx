import React, { useEffect, useState } from "react";
import CrudFrame from "../../../Components/Crud/CrudFrame";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { CreatePage } from "./CreatePage";
import { UpdatePage } from "./UpdatePage";
import { DeletePage } from "./DeletePage";
import { findAllOrganizations } from "../../../DataAccess/Organization";

const DynamicApp = ({ app }) => {
  const { user } = useSelector((state) => state.auth.value);
  const { t } = useTranslation();
  const [rows, setRows] = useState([]);
  const [rowId, setRowId] = useState(null);
  const [loadGrid, setLoadGrid] = useState(null);

  useEffect(() => {
    const params = {
      token: user.token,
    };
    findAllOrganizations(params).then((ret) => {
      setRows(ret);
    });
  }, [user, loadGrid]);

  const onLoadGrid = () => {
    setLoadGrid(Date.now())
  }

  const cols = t("crud.organization.columns", { returnObjects: true });
  const columns = [
    { headerName: cols[0], fieldName: "name", align: "left" },
    { headerName: cols[1], fieldName: "description", align: "left" },
  ];

  const ret =
    rows.length > 0 ? (
      <CrudFrame
        app={app}
        columns={columns}
        data={rows}
        rowSelected={rowId}
        setRowSelected={setRowId}
        enableCreateButton={true}
        createPage={<CreatePage user={user} back={"../"} onLoadGrid={onLoadGrid}/>}
        updatePage={
          <UpdatePage user={user} back={"../"} rowId={rowId} onLoadGrid={onLoadGrid}/>
        }
        deletePage={
          <DeletePage user={user} back={"../"} rowId={rowId} onLoadGrid={onLoadGrid}/>
        }
      />
    ) : null;

  return ret;
};

export default DynamicApp;
