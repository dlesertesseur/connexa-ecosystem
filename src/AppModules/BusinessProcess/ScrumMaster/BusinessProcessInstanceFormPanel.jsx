import React from "react";
import { LoadingOverlay, Stack } from "@mantine/core";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { findFormInstanceById } from "../../../DataAccess/FormInstance";
import { findAllBusinessProcessInstanceRelationsById } from "../../../DataAccess/BusinessProcessInstanceRelations";
import ResponceNotification from "../../../Modal/ResponceNotification";
import HeaderPanel from "./HeaderPanel";
import InstanceFormPanel from "../Instances/form/InstanceFormPanel";

const BusinessProcessInstanceFormPanel = ({ businessProcessInstanceId, businessProcessInstanceName, onBack }) => {
  const { user } = useSelector((state) => state.auth.value);
  const [formId, setFormId] = useState(null);
  const [parentId, setParentId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const getData = async () => {
    setLoading(true);
    try {
      let params = { token: user.token, id: businessProcessInstanceId };
      const relation = await findAllBusinessProcessInstanceRelationsById(params);

      if (relation && relation.length > 0) {
        const id = relation[0].formInstanceId;
        params = { token: user.token, id: id };
        const instanceNode = await findFormInstanceById(params);

        if (instanceNode.error) {
          throw new Error(instanceNode.error);
        } else {
          setFormId(instanceNode.options);
          setParentId(instanceNode.id);
        }
      } else {
        throw new Error(t("status.error"));
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error.message);
      setFormId(null);
      setParentId(null);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Stack spacing={"xs"} justify="flex-start">
      <HeaderPanel
        businessProcessInstanceName={businessProcessInstanceName}
        onBack={onBack}
        title={t("businessProcessInstances.title.viewDocument")}
      />

      <InstanceFormPanel formId={formId} type={"FORM"} parentId={parentId} deltaY={100}/>

      <LoadingOverlay visible={loading} />

      <ResponceNotification
        opened={error ? true : false}
        code={error}
        onClose={() => {
          setError(null);
        }}
        title={t("status.error")}
        text={error}
      />
    </Stack>
  );
};

export default BusinessProcessInstanceFormPanel;
