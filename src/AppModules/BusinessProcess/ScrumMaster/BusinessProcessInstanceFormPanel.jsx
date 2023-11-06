import React from "react";
import { LoadingOverlay, Stack } from "@mantine/core";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import ResponceNotification from "../../../Modal/ResponceNotification";
import HeaderPanel from "./HeaderPanel";
import FormDialog from "../Instances/doc/FormDialog";

const BusinessProcessInstanceFormPanel = ({ businessProcessInstanceId, businessProcessInstanceName, onBack }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  return (
    <Stack spacing={"xs"} justify="flex-start">
      <HeaderPanel
        businessProcessInstanceName={businessProcessInstanceName}
        onBack={onBack}
        title={t("businessProcessInstances.title.viewDocument")}
      />

      <FormDialog businessProcessInstanceId={businessProcessInstanceId} />
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
