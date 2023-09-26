import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { CreatePage } from "./CreatePage";
import { UpdatePage } from "./UpdatePage";
import { DeletePage } from "./DeletePage";
import { AbmStateContext } from "./Context";
import { findAllEntityDefinition } from "../../../DataAccess/EntityDefinition";
import { IconLayout, IconTestPipe } from "@tabler/icons-react";
import ResponceNotification from "../../../Modal/ResponceNotification";
import CrudFrame from "../../../Components/Crud/CrudFrame";
import EntityLayout from "./EntityLayout/EntityLayout";
import FormTest from "./FormTest/FormTest";

const DynamicApp = ({ app }) => {
  const { user } = useSelector((state) => state.auth.value);

  const { t } = useTranslation();
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [reload, setReload] = useState(null);
  const [openTestForm, setOpenTestForm] = useState(false);

  const getData = async () => {
    const params = {
      token: user.token,
    };

    try {
      let ret = null;
      const list = await findAllEntityDefinition(params);

      ret = list.map((r) => {
        return {
          id: r.id,
          name: r.name,
          label: r.label,
          description: r.description,
        };
      });
      setRows(ret);
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, [user, reload]);

  let col = 0;
  const cols = t("document.entityDefinition.columns", { returnObjects: true });
  const columns = [
    { headerName: cols[col++], fieldName: "name", align: "left" },
    { headerName: cols[col++], fieldName: "label", align: "left" },
    { headerName: cols[col++], fieldName: "description", align: "left" },
  ];

  const ret = rows ? (
    <AbmStateContext.Provider
      value={{
        reload,
        setReload,
        selectedRowId,
        setError,
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
            path: "formLayout",
            icon: <IconLayout size={20} />,
            key: "document.entityDefinition.label.formLayout",
            element: <EntityLayout back={"../"} />,
          },
          {
            path: "formTest",
            icon: <IconTestPipe size={20} />,
            key: "document.entityDefinition.label.formTest",
            element: <FormTest back={"../"} />,
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
