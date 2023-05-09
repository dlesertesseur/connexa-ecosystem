import React, { useEffect, useState } from "react";
import CrudFrame from "../../../Components/Crud/CrudFrame";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { CreatePage } from "./CreatePage";
import { UpdatePage } from "./UpdatePage";
import { DeletePage } from "./DeletePage";
import { getRootOfCategories, setSelectedRowId, getChildrenOfCategory } from "../../../Features/Category";
import { actions } from "../../../Constants";

const DynamicApp = ({ app }) => {
  const { user } = useSelector((state) => state.auth.value);
  const { categoriesChild, selectedRowId, categoriesRoot, appState } = useSelector((state) => state.category.value);

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [categoriesPath, setCategoriesPath] = useState([]);

  useEffect(() => {
    const parameters = {
      token: user.token,
    };
    dispatch(getRootOfCategories(parameters));
  }, [dispatch, user]);

  useEffect(() => {
    if (appState !== actions.readed || categoriesRoot) {
      if (categoriesRoot) {
        const parameters = {
          token: user.token,
          nodeId: categoriesRoot.id,
        };
        dispatch(getChildrenOfCategory(parameters));
      }
    }
  }, [appState, categoriesRoot, dispatch, user]);

  const cols = t("crud.category.columns", { returnObjects: true });
  const columns = [
    { headerName: cols[0], fieldName: "name", align: "left" },
    { headerName: cols[1], fieldName: "description", align: "left" },
  ];

  const changeRoot = () => {
    const parameters = {
      token: user.token,
      rootId: selectedRowId,
    };
    const ret = [...categoriesPath, categoriesRoot];
    setCategoriesPath(ret);
    dispatch(getRootOfCategories(parameters));
  };

  const toParent = () => {
    const ret = [...categoriesPath];
    const lastCategory = ret.pop();

    if (lastCategory) {
      const parameters = {
        token: user.token,
        rootId: lastCategory.id,
      };
      dispatch(getRootOfCategories(parameters));
    }

    setCategoriesPath(ret);
  };

  const createPath = () => {
    const ret = categoriesPath.map((c) => c.name);

    if (categoriesRoot && !ret?.includes(categoriesRoot.name)) {
      ret.push(categoriesRoot.name);
    }

    return ret;
  };

  const ret = categoriesChild ? (
    <CrudFrame
      app={app}
      columns={columns}
      data={categoriesChild}
      rowSelected={selectedRowId}
      setRowSelected={(id) => {
        dispatch(setSelectedRowId(id));
      }}
      enableCreateButton={true}
      createPage={<CreatePage />}
      updatePage={<UpdatePage />}
      deletePage={<DeletePage />}
      relationshipPages={[
        {
          path: "/inspect",
          key: "crud.category.label.toChildren",
          onPress: () => changeRoot(),
        },
        {
          path: "/back",
          key: "crud.category.label.toParent",
          onPress: () => toParent(),
          customState: () => {
            const ret = categoriesPath ? !(categoriesPath.length > 0) : true;
            return ret;
          },
        },
      ]}
      breadcrumbs={createPath()}
    />
  ) : null;

  return ret;
};

export default DynamicApp;
