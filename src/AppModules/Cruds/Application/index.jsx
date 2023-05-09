import React, { useEffect, useState } from "react";
import CrudFrame from "../../../Components/Crud/CrudFrame";
import { findAllApplications } from "../../../DataAccess/Applications";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { CreateApplicationPage } from "./CreateApplicationPage";
import { UpdateApplicationPage } from "./UpdateApplicationPage";
import { DeleteApplicationPage } from "./DeleteApplicationPage";

const DynamicApp = ({ app }) => {
  const { user } = useSelector((state) => state.auth.value);
  const { projectSelected } = useSelector((state) => state.auth.value);
  const { t } = useTranslation();
  const [applications, setApplications] = useState([]);
  const [applicationId, setApplicationId] = useState(null);
  const [loadGrid, setLoadGrid] = useState(null);

  useEffect(() => {
    const params = {
      token: user.token,
    };
    findAllApplications(params).then((ret) => {
      setApplications(ret);
    });
  }, [user, loadGrid]);

  const onLoadGrid = () => {
    setLoadGrid(Date.now())
  }

  const cols = t("crud.application.columns", { returnObjects: true });
  const columns = [
    { headerName: cols[1], fieldName: "name", align: "left" },
    { headerName: cols[2], fieldName: "description", align: "left" },
    { headerName: cols[3], fieldName: "path", align: "left" },
    { headerName: cols[0], fieldName: "icon", align: "left" },
  ];

  const ret =
    applications.length > 0 ? (
      <CrudFrame
        app={app}
        columns={columns}
        data={applications}
        rowSelected={applicationId}
        setRowSelected={setApplicationId}
        enableCreateButton={true}
        createPage={<CreateApplicationPage user={user} back={"../"} onLoadGrid={onLoadGrid}/>}
        updatePage={
          <UpdateApplicationPage user={user}  back={"../"} applicationId={applicationId} onLoadGrid={onLoadGrid}/>
        }
        deletePage={
          <DeleteApplicationPage user={user} projectId={projectSelected.id} back={"../"} applicationId={applicationId} onLoadGrid={onLoadGrid}/>
        }
      />
    ) : null;

  return ret;
};

export default DynamicApp;
