import React, { useState, useContext, useEffect } from "react";
import BusinessProcessHeader from "../BusinessProcessHeader";
import { findBusinessProcessModelById } from "../../../../DataAccess/BusinessProcessModel";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { AbmStateContext } from "../Context";
import { Group, Stack, Text, TransferList } from "@mantine/core";
import FormSelectorToolbar from "./FormSelectorToolbar";
import { findAllEntityDefinition } from "../../../../DataAccess/EntityDefinition";
import CheckTable from "../../../../Components/Crud/CheckTable";
import {
  deleteBusinessProcessModelRelation,
  findAllBusinessProcessModelRelationsById,
  saveBusinessProcessModelRelation,
} from "../../../../DataAccess/BusinessProcessModelRelations";

const FormSelector = ({ back }) => {
  const { user } = useSelector((state) => state.auth.value);
  const { selectedRowId, setError } = useContext(AbmStateContext);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [businessProcessModel, setBusinessProcessModel] = useState(null);
  const [data, setData] = useState([]);
  const [relations, setRelations] = useState([]);
  const [rowSelected, setRowSelected] = useState(null);

  const getData = async () => {
    const params = { token: user.token, id: selectedRowId };

    try {
      let ret = await findBusinessProcessModelById(params);
      setBusinessProcessModel(ret);
      const relations = await findAllBusinessProcessModelRelationsById(params);
      const formsId = relations.map(f => f.formModelId);
      setRelations(relations);

      const list = await findAllEntityDefinition(params);
      const data = list.map((r) => {
        const obj = {...r, checked : formsId.include(r.formModelId)}
        return obj;
      });

      setData(data);
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    getData();
  }, [selectedRowId]);

  let col = 0;
  const cols = t("businessProcessModel.relation.columns", { returnObjects: true });
  const columns = [
    { headerName: cols[col++], fieldName: "name", align: "left" },
    { headerName: cols[col++], fieldName: "description", align: "left" },
  ];

  const onCheckRow = async (rowId, check) => {
    const params = {
      token: user.token,
      processModelId: businessProcessModel.id,
      formModelId: rowId,
    };

    if (check) {
      const ret = await saveBusinessProcessModelRelation(params);
      if (ret.error) {
        setError(ret.error);
      }
    } else {
      const ret = await deleteBusinessProcessModelRelation(params);
      if (ret.error) {
        setError(ret.error);
      }
    }
  };

  return (
    <Stack spacing={"xs"}>
      <BusinessProcessHeader text={t("businessProcessModel.label.forms")} businessProcess={businessProcessModel} />
      <FormSelectorToolbar
        onBack={() => {
          navigate(back);
        }}
      />
      <Group grow>
        <Text weight={500} size={"md"}>
          {t("businessProcessModel.relation.title")}
        </Text>
      </Group>
      <Group grow>
        <CheckTable
          data={data}
          columns={columns}
          //loading={loading}
          rowSelected={rowSelected}
          setRowSelected={setRowSelected}
          onCheckRow={onCheckRow}
          headerHeight={300}
        />
      </Group>
    </Stack>
  );
};

export default FormSelector;
