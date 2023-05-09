import React, { useEffect, useState } from "react";
import CrudFrame from "../../../Components/Crud/CrudFrame";
import NewWorkerStack from "./NewWorkerStack";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { UpdatePage } from "./UpdatePage";
import { DeletePage } from "./DeletePage";
import { findAllWorkersByOrganization, setSelectedRowId } from "../../../Features/Worker";
import { useNavigate } from "react-router-dom";
import { actions, API } from "../../../Constants";
import { WorkerPhotosPage } from "./WorkerPhotosPage";

const DynamicApp = ({ app }) => {
  const { user, organizationSelected } = useSelector((state) => state.auth.value);
  const { workers, appState, selectedRowId } = useSelector((state) => state.worker.value);

  const { t } = useTranslation();
  const [rows, setRows] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (appState === actions.reload) {
      navigate(".");
    }
  }, [appState, navigate]);

  useEffect(() => {
    const parameters = {
      token: user.token,
      organizationId: organizationSelected.id,
    };
    dispatch(findAllWorkersByOrganization(parameters));

  }, [dispatch, organizationSelected, user, appState]);

  useEffect(() => {
    const ret = workers?.map((p) => {
      return p.worker;
    });
    setRows(ret);
  }, [workers]);

  let col = 0;
  const cols = t("crud.worker.columns", { returnObjects: true });
  const columns = [
    { headerName: cols[col++], fieldName: "image", align: "center", type:"image", urlBase:API.worker.urlPhotoBase, extention:".png"},
    { headerName: cols[col++], fieldName: "nid", align: "right" },
    { headerName: cols[col++], fieldName: "lastname", align: "left" },
    { headerName: cols[col++], fieldName: "firstname", align: "left" },
    { headerName: cols[col++], fieldName: "birthDate", align: "center" },
    { headerName: cols[col++], fieldName: "address", align: "left" },
    { headerName: cols[col++], fieldName: "phone", align: "left" },
    { headerName: cols[col++], fieldName: "email", align: "left" },
    { headerName: cols[col++], fieldName: "country", align: "left" },
    { headerName: cols[col++], fieldName: "city", align: "left" },
    { headerName: cols[col++], fieldName: "status", align: "left" },
  ];

  const ret = rows ? (
    <CrudFrame
      app={app}
      columns={columns}
      data={rows}
      rowSelected={selectedRowId}
      setRowSelected={(id) => {
        dispatch(setSelectedRowId(id));
      }}
      enableCreateButton={true}
      createPage={<NewWorkerStack />}
      updatePage={<UpdatePage />}
      deletePage={<DeletePage />}
      relationshipPages={[
        {
          path: "/images",
          key: "button.photos",
          element: <WorkerPhotosPage user={user} back={"../"}/>,
        },
      ]}
    />
  ) : null;

  return ret;
};

export default DynamicApp;
