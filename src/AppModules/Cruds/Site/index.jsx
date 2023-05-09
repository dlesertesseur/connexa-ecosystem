import React, { useCallback, useEffect, useState } from "react";
import CrudFrame from "../../../Components/Crud/CrudFrame";
import { useSelector } from "react-redux";
import { findAllSites } from "../../../DataAccess/Sites";
import { findAllContext } from "../../../DataAccess/Context";
import { useTranslation } from "react-i18next";
import { CreateSitePage } from "./CreateSitePage";
import { UpdateSitePage } from "./UpdateSitePage";
import { DeleteSitePage } from "./DeleteSitePage";

const DynamicApp = ({ app }) => {
  const { user } = useSelector((state) => state.auth.value);
  const [sites, setSites] = useState([]);
  const [contexts, setContexts] = useState(null);
  const [siteId, setSiteId] = useState(null);
  const { t } = useTranslation();

  const onLoadGrid = useCallback(() => {
    const params = {
      token: user.token,
    };
    findAllSites(params).then((ret) => {
      setSites(ret);
    });
  },[user]);

  useEffect(() => {
    onLoadGrid();
  }, [onLoadGrid, user]);

  useEffect(() => {
    const params = {
      token: user.token,
    };
    findAllContext(params).then((ret) => {
      setContexts(ret);
    });
  }, [user]);

  const cols = t("crud.site.columns", { returnObjects: true });
  const columns = [
    { headerName: cols[0], fieldName: "name", align: "left" },
    { headerName: cols[1], fieldName: "address", align: "left" },
    { headerName: cols[2], fieldName: "phone", align: "left" },
    { headerName: cols[3], fieldName: "contextName", align: "left" },
  ];

  const ret =
    sites.length > 0 ? (
      <CrudFrame
        app={app}
        columns={columns}
        data={sites}
        rowSelected={siteId}
        setRowSelected={setSiteId}
        enableCreateButton={true}
        createPage={<CreateSitePage user={user} back={"../"} onLoadGrid={onLoadGrid} contexts={contexts} />}
        updatePage={<UpdateSitePage user={user} back={"../"} siteId={siteId} onLoadGrid={onLoadGrid} contexts={contexts} />}
        deletePage={<DeleteSitePage user={user} back={"../"} siteId={siteId} onLoadGrid={onLoadGrid} contexts={contexts} />}
      />
    ) : null;

  return ret;
};

export default DynamicApp;
