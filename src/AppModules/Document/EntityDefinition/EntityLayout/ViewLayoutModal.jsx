import React, { useEffect } from "react";
import { Modal } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { ViewLayoutModalPanel } from "./ViewLayoutModalPanel";

const ViewLayoutModal = ({ fullScreen = true, open, close, name, panels, widgetByPanel, size, height }) => {
  
  const { t } = useTranslation();
  const [formConfig, setFormConfig] = useState(null);

  const createInitialValues = () => {
    const ret = {};
    panels?.forEach((p) => {
      const group = widgetByPanel?.get(p.id);
      group?.forEach((f) => {
        ret[f.name] = f.widget === 1 || f.widget === 2 ? "" : null;
      });
    });

    return ret;
  };

  const createValidations = () => {
    const ret = {};

    panels?.forEach((p) => {
      const group = widgetByPanel?.get(p.id);
      group?.forEach((f) => {
        if (f.required) {
          ret[f.name] = (val) => (val ? null : t("validation.required"));
        }
      });
    });
    return ret;
  };

  useEffect(() => {
    if (open) {
      const config = {
        initialValues: createInitialValues(panels),
        validate: createValidations(panels),
      };
      setFormConfig(config);
    }
  }, [open]);

  return (
    <Modal fullScreen={fullScreen} opened={open} onClose={close} title={name} size={fullScreen ? null : size}>
      <ViewLayoutModalPanel
        formConfig={formConfig}
        panels={panels}
        widgetByPanel={widgetByPanel}
        size={size}
        close={close}
        height={height}
      />
    </Modal>
  );
};

export default ViewLayoutModal;