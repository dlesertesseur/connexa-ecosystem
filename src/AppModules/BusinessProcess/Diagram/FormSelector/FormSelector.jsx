import React, { useState, useContext, useEffect } from "react";
import BusinessProcessHeader from "../BusinessProcessHeader";
import { findBusinessProcessModelById } from "../../../../DataAccess/BusinessProcessModel";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { AbmStateContext } from "../Context";
import { Group, Stack, Text } from "@mantine/core";
import { findAllEntityDefinition } from "../../../../DataAccess/EntityDefinition";
import {
  deleteBusinessProcessModelRelation,
  findAllBusinessProcessModelRelationsById,
  saveBusinessProcessModelRelation,
} from "../../../../DataAccess/BusinessProcessModelRelations";
import FormSelectorToolbar from "./FormSelectorToolbar";
import CheckTable from "../../../../Components/Crud/CheckTable";

const FormSelector = ({ back }) => {
  const { user } = useSelector((state) => state.auth.value);
  const { selectedRowId, setError } = useContext(AbmStateContext);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [businessProcessModel, setBusinessProcessModel] = useState(null);
  const [data, setData] = useState([]);
  const [processingRow, setProcessingRow] = useState(null);
  const [rowSelected, setRowSelected] = useState(null);

  const getData = async () => {
    const params = { token: user.token, id: selectedRowId };

    try {
      let ret = await findBusinessProcessModelById(params);
      setBusinessProcessModel(ret);
      const relations = await findAllBusinessProcessModelRelationsById(params);
      const formsId = relations.map(f => f.formModelId);

      const list = await findAllEntityDefinition(params);
      const data = list.map((r) => {
        const obj = {...r, checked : formsId.includes(r.id)}
        return obj;
      });

      setData(data);
    } catch (error) {
      setError(error.message);
    }

    
  };

  useEffect(() => {
    getData();
  }, [selectedRowId, processingRow]);

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

    setProcessingRow(rowId);

    if (check) {
      const ret = await saveBusinessProcessModelRelation(params);
      if (ret.error) {
        setError(ret.error);
      }
    } else {
      const ret = await deleteBusinessProcessModelRelation(params);
      if (ret !== 200) {
        setError("deleteBusinessProcessModelRelation ERROR");
      }
    }
    setProcessingRow(null);
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
          rowSelected={rowSelected}
          setRowSelected={setRowSelected}
          onCheckRow={onCheckRow}
          processingRow={processingRow}
          headerHeight={300}
        />
      </Group>
    </Stack>
  );
};

export default FormSelector;
