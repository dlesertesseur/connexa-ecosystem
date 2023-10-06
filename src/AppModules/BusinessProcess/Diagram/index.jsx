import React, { useEffect, useState } from "react";
import ResponceNotification from "../../../Modal/ResponceNotification";
import CrudFrame from "../../../Components/Crud/CrudFrame";
import Editor from "./editor/Editor";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { CreatePage } from "./CreatePage";
import { UpdatePage } from "./UpdatePage";
import { DeletePage } from "./DeletePage";
import { AbmStateContext } from "./Context";
import { findAllBusinessProcessModel } from "../../../DataAccess/BusinessProcessModel";
import { IconEditCircle, IconPaperclip, IconVariable } from "@tabler/icons-react";
import { findAllSprints } from "../../../DataAccess/Sprints";
import { findAllByOrganizationId } from "../../../DataAccess/OrganizationRole";
import Parameters from "./parameters/Parameters";
import FormSelector from "./FormSelector/FormSelector";

const DynamicApp = ({ app }) => {
  const { user, organizationSelected } = useSelector((state) => state.auth.value);

  const { t } = useTranslation();
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [reload, setReload] = useState(null);
  const [sprints, setSprints] = useState([]);
  const [roles, setRoles] = useState([]);

  const getData = async () => {
    let params = {
      token: user.token,
      userId: user.id,
    };

    try {
      const list = await findAllBusinessProcessModel(params);
      setRows(list);

      const sprints = await findAllSprints(params);
      setSprints(
        sprints.map((s) => {
          const ret = { value: s.id, label: s.name };
          return ret;
        })
      );

      params = { token: user.token, id: organizationSelected.id };
      const roles = await findAllByOrganizationId(params);
      setRoles(roles);
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, [user, reload]);

  let col = 0;
  const cols = t("businessProcessModel.columns", { returnObjects: true });
  const columns = [
    { headerName: cols[col++], fieldName: "name", align: "left" },
    { headerName: cols[col++], fieldName: "description", align: "left" },
  ];

  const ret = rows ? (
    <AbmStateContext.Provider
      value={{
        reload,
        setReload,
        selectedRowId,
        setError,
        sprints,
        roles,
      }}
    >
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
        relationshipPages={[
          {
            path: "design",
            icon: <IconEditCircle size={20} />,
            key: "businessProcessModel.buttons.editor",
            element: <Editor back={"../"} />,
          },
          {
            path: "forms",
            icon: <IconPaperclip size={20} />,
            key: "businessProcessModel.buttons.forms",
            element: <FormSelector back={"../"} />,
          },
          {
            path: "parameters",
            icon: <IconVariable size={20} />,
            key: "businessProcessModel.buttons.parameters",
            element: <Parameters back={"../"} />,
          },
        ]}
      />

      <ResponceNotification
        opened={error ? true : false}
        onClose={() => {
          setError(null);
        }}
        code={error}
        title={t("status.error")}
        text={error}
      />
    </AbmStateContext.Provider>
  ) : null;

  return ret;
};

export default DynamicApp;
