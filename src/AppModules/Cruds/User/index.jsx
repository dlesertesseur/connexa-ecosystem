import React, { useEffect, useState } from "react";
import NewUserStack from "./NewUserStack";
import CrudFrame from "../../../Components/Crud/CrudFrame";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { UpdatePage } from "./UpdatePage";
import { DeletePage } from "./DeletePage";
import { API } from "../../../Constants";
import { UserPhotosPage } from "./UserPhotosPage";
import { findAllUsers } from "../../../DataAccess/User";
import { AbmStateContext } from "./Context";

const DynamicApp = ({ app }) => {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const [rows, setRows] = useState([]);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [reload, setReload] = useState(null);

  const getAllUsers = async () => {
    const parameters = {
      token: user.token
    };

    const users = await findAllUsers(parameters);
    setRows(users);
  };

  useEffect(() => {
      getAllUsers();
  }, [user, reload]);

  let col = 0;
  const cols = t("crud.worker.columns", { returnObjects: true });
  const columns = [
    {
      headerName: cols[col++],
      fieldName: "image",
      align: "center",
      type: "image",
      urlBase: API.worker.urlPhotoBase,
      extention: ".png",
    },
    // { headerName: cols[col++], fieldName: "nid", align: "right" },
    { headerName: cols[col++], fieldName: "lastname", align: "left" },
    { headerName: cols[col++], fieldName: "firstname", align: "left" },
    // { headerName: cols[col++], fieldName: "birthDate", align: "center" },
    // { headerName: cols[col++], fieldName: "address", align: "left" },
    // { headerName: cols[col++], fieldName: "phone", align: "left" },
    { headerName: cols[col++], fieldName: "email", align: "left" },
    // { headerName: cols[col++], fieldName: "country", align: "left" },
    // { headerName: cols[col++], fieldName: "city", align: "left" },
    // { headerName: cols[col++], fieldName: "status", align: "left" },
  ];

  const ret = rows ? (
    <AbmStateContext.Provider value={{ reload, setReload, selectedRowId }}>
      <CrudFrame
        app={app}
        columns={columns}
        data={rows}
        rowSelected={selectedRowId}
        setRowSelected={setSelectedRowId}
        enableCreateButton={true}
        createPage={<NewUserStack />}
        updatePage={<UpdatePage/>}
        deletePage={<DeletePage/>}
        relationshipPages={[
          {
            path: "/images",
            key: "button.photos",
            element: <UserPhotosPage user={user} back={"../"} />,
          },
        ]}
      />
    </AbmStateContext.Provider>
  ) : null;

  return ret;
};

export default DynamicApp;
