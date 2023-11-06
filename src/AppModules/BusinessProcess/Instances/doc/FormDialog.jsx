import React from "react";
import { Modal, Stack } from "@mantine/core";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import ResponceNotification from "../../../../Modal/ResponceNotification";
import FormPanel from "./FormPanel";
import { useLocation, useNavigate } from "react-router-dom";

const FormDialog = ({ open, close, businessProcessInstanceId }) => {
  const [error, setError] = useState(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Modal
      fullScreen
      opened={open}
      onClose={() => {
        const parts = location.pathname.split("/");
        const index = parts.indexOf("Instances");
        const pos = (parts.length-1) - index;
        navigate(-pos);
        close();
      }}
      title={t("businessProcessInstances.title.viewDocument")}
      centered
    >
      <Stack spacing={"xs"} justify="flex-start">
        <FormPanel businessProcessInstanceId={businessProcessInstanceId} />

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
    </Modal>
  );
};

export default FormDialog;
