import React, { useState, useContext, useEffect } from "react";
import BusinessProcessHeader from "../BusinessProcessHeader";
import { findBusinessProcessModelById } from "../../../../DataAccess/BusinessProcessModel";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { AbmStateContext } from "../Context";
import { Group, Stack, TransferList } from "@mantine/core";
import FormSelectorToolbar from "./FormSelectorToolbar";
import { findAllEntityDefinition } from "../../../../DataAccess/EntityDefinition";

const FormSelector = ({ back }) => {
  const { user } = useSelector((state) => state.auth.value);
  const { selectedRowId } = useContext(AbmStateContext);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [businessProcessModel, setBusinessProcessModel] = useState(null);
  const [data, setData] = useState([[], []]);

  const getData = async () => {
    const params = { token: user.token, id: selectedRowId };

    try {
      let ret = await findBusinessProcessModelById(params);
      setBusinessProcessModel(ret);

      ret = null;
      const list = await findAllEntityDefinition(params);

      ret = list.map((r) => {
        return {
          value: r.id,
          label: `${r.label} - ${r.description}`,
        };
      });

      setData([ret, []])
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    getData();
  }, [selectedRowId]);

  return (
    <Stack spacing={"xs"}>
      <BusinessProcessHeader text={t("businessProcessModel.label.forms")} businessProcess={businessProcessModel} />
      <FormSelectorToolbar
        onBack={() => {
          navigate(back);
        }}
      />
      <Group grow>
        <TransferList
          value={data}
          onChange={setData}
          searchPlaceholder={t("businessProcessModel.label.search")}
          nothingFound={t("businessProcessModel.label.noData")}
          titles={[
            t("businessProcessModel.label.businessProcessList"),
            t("businessProcessModel.label.businessProcessesSeleted"),
          ]}
          breakpoint="sm"
        />
      </Group>
    </Stack>
  );
};

export default FormSelector;
