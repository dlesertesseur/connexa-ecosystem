import React, { useCallback, useEffect, useState } from "react";
import CrudFrame from "../../../Components/Crud/CrudFrame";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { CreatePage } from "./CreatePage";
import { UpdatePage } from "./UpdatePage";
import { DeletePage } from "./DeletePage";
import { findAllRetailers } from "../../../DataAccess/Retailers";

const DynamicApp = ({ app }) => {
  const { user } = useSelector((state) => state.auth.value);
  const [entities, setEntities] = useState([]);
  const [entityId, setEntityId] = useState(null);
  const { t } = useTranslation();

  const onLoadGrid = useCallback(() => {
    const params = {
      token: user.token,
    };
    findAllRetailers(params).then((ret) => {
      if(ret){
        setEntities(ret);
      }
    });
  }, [user]);

  useEffect(() => {
    onLoadGrid();
  }, [onLoadGrid, user]);

  const cols = t("crud.retailer.columns", { returnObjects: true });
  const columns = [{ headerName: cols[0], fieldName: "name", align: "left" }];

  const ret = (
    <CrudFrame
      app={app}
      columns={columns}
      data={entities}
      rowSelected={entityId}
      setRowSelected={setEntityId}
      enableCreateButton={true}
      createPage={<CreatePage user={user} back={"../"} onLoadGrid={onLoadGrid} />}
      updatePage={<UpdatePage user={user} back={"../"} entityId={entityId} onLoadGrid={onLoadGrid} />}
      deletePage={<DeletePage user={user} back={"../"} entityId={entityId} onLoadGrid={onLoadGrid} />}
    />
  );

  return ret;
};

export default DynamicApp;
