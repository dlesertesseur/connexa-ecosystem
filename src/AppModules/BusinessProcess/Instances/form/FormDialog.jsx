import React from "react";
import { LoadingOverlay, Modal, Stack } from "@mantine/core";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import InstanceFormPanel from "./InstanceFormPanel";
import ResponceNotification from "../../../../Modal/ResponceNotification";

const FormDialog = ({  open, close, formId, parentId }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
 
  return (
    <Modal
      fullScreen
      opened={open}
      onClose={() => {
        close();
      }}
      title={t("businessProcessInstances.title.viewDocument")}
      centered
    >
      <Stack
        spacing={"xs"}
        justify="flex-start"
      >
        <InstanceFormPanel formId={formId} type={"FORM"} parentId={parentId} />

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
    </Modal>
  );
};

export default FormDialog;
