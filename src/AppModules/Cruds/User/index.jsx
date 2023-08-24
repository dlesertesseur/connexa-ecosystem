import React, { useEffect, useState } from "react";
import NewUserStack from "./NewUserStack";
import CrudFrame from "../../../Components/Crud/CrudFrame";
import { API } from "../../../Constants";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { UpdatePage } from "./UpdatePage";
import { DeletePage } from "./DeletePage";
import { RolePage } from "./RolePage";
import { UserPhotosPage } from "./UserPhotosPage";
import { findAllUsers } from "../../../DataAccess/User";
import { AbmStateContext } from "./Context";

const DynamicApp = ({ app }) => {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const [rows, setRows] = useState([]);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState(null);
  const [reload, setReload] = useState(null);
  const [loading, setLoading] = useState(true);

  const getAllUsers = async () => {
    const parameters = {
      token: user.token,
    };

    setLoading(true);
    const users = await findAllUsers(parameters);
    setRows(users);
    setLoading(false);
  };

  useEffect(() => {
    getAllUsers();
  }, [user, reload]);

  useEffect(() => {
    if(selectedRowId){
      const ret = rows.find(u => u.id === selectedRowId);
      if(ret){
        setSelectedUserName(ret.firstname + ", " + ret.lastname);
      }
    }
  }, [selectedRowId]);

  let col = 0;
  const cols = t("crud.user.columns", { returnObjects: true });
  const columns = [
    {
      headerName: null,
      fieldName: "image",
      align: "center",
      type: "avatar",
      urlBase: API.user.urlPhotoBase,
      extention: ".png",
      width:80
    },
    // { headerName: cols[col++], fieldName: "nid", align: "right" },
    { headerName: cols[2], fieldName: "lastname", align: "left"},
    { headerName: cols[3], fieldName: "firstname", align: "left" },
    // { headerName: cols[col++], fieldName: "birthDate", align: "center" },
    // { headerName: cols[col++], fieldName: "address", align: "left" },
    // { headerName: cols[col++], fieldName: "phone", align: "left" },
    { headerName: cols[7], fieldName: "email", align: "left" },
    // { headerName: cols[col++], fieldName: "country", align: "left" },
    // { headerName: cols[col++], fieldName: "city", align: "left" },
    // { headerName: cols[col++], fieldName: "status", align: "left" },
  ];

  const ret = rows ? (
    <AbmStateContext.Provider value={{ reload, setReload, selectedRowId, selectedUserName }}>
      <CrudFrame
        app={app}
        columns={columns}
        data={rows}
        rowSelected={selectedRowId}
        setRowSelected={setSelectedRowId}
        loading={loading}
        enableCreateButton={true}
        createPage={<NewUserStack />}
        updatePage={<UpdatePage />}
        deletePage={<DeletePage />}
        relationshipPages={[
          {
            path: "images",
            key: "button.photos",
            element: <UserPhotosPage user={user} back={"../"} />,
          },
          {
            path: "role",
            key: "button.roles",
            element: <RolePage back={"../"} />,
          },
        ]}
      />
    </AbmStateContext.Provider>
  ) : null;

  return ret;
};

export default DynamicApp;
