import React, { useEffect } from "react";
import { Modal, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { ViewLayoutModalPanel } from "./ViewLayoutModalPanel";
import { Route, Routes } from "react-router-dom";

const ViewLayoutModal = ({
  fullScreen = true,
  open,
  close,
  name,
  panels,
  widgetByPanel,
  size,
  height,
  relatedEntities,
  entity,
}) => {
  const { t } = useTranslation();
  const [formConfig, setFormConfig] = useState(null);

  const createInitialValues = () => {
    const ret = {};
    panels?.forEach((p) => {
      const group = widgetByPanel?.get(p.id);
      group?.forEach((f) => {
        ret[f.name] = f.type === "TEXTINPUT" || f.widget === "TEXTAREA" ? "" : null;
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
      <Routes>
        <Route
          path="/"
          element={
            <ViewLayoutModalPanel
              formConfig={formConfig}
              panels={panels}
              widgetByPanel={widgetByPanel}
              relatedEntities={relatedEntities}
              size={size}
              close={close}
              height={height}
              entity={entity}
            />
          }
        ></Route>

        {relatedEntities.map((re, index) => {
          return(<Route key={re.id} path={re.options} element={<Text>{re.name}</Text>} />);
        })}
      </Routes>
    </Modal>
  );
};

export default ViewLayoutModal;
