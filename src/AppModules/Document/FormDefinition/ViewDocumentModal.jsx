import React, { useEffect } from "react";
import DocumentEntityForm from "./DocumentEntityForm";
import { Button, Modal, Tabs, Group } from "@mantine/core";
import { useState } from "react";
import { findFormDefinitionById } from "../../../DataAccess/FormDefinition";
import { useSelector } from "react-redux";
import { useWindowSize } from "../../../Hook";
import { useTranslation } from "react-i18next";
import uuid from "react-uuid";

const ViewDocumentModal = ({ open, close, documentDefinitionId }) => {
  const wsize = useWindowSize();
  const { user } = useSelector((state) => state.auth.value);
  const { t } = useTranslation();
  const [document, setDocument] = useState(null);
  const headerHeight = 180;

  const getData = async () => {
    const params = {
      token: user.token,
      id: documentDefinitionId,
    };

    try {
      const document = await findFormDefinitionById(params);
      setDocument(document);
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    if (open) {
      getData();
    }
  }, [open]);

  const onSubmit = (e) => {
    console.log("onSubmit e ->", e);
  }

  return (
    <Modal fullScreen opened={open} onClose={close} title={document?.name}>
      <Tabs variant="outline" defaultValue={document?.sections[0].id} height={wsize.height - headerHeight}>
        <Tabs.List>
          {document?.sections.map((s) => (
            <Tabs.Tab key={uuid()} value={s.id}>
              {s.name}
            </Tabs.Tab>
          ))}
        </Tabs.List>

        {document?.sections.map((s) => (
          <Tabs.Panel key={uuid()} value={s.id} p={"xs"}>
            <DocumentEntityForm entityDef={s} height={wsize.height - headerHeight} onSubmitEntity={onSubmit}/>
          </Tabs.Panel>
        ))}
      </Tabs>

      <Group position="right" w={"100%"}>
        <Button type="submit" onClick={onSubmit}>{t("button.accept")}</Button>
        <Button
          onClick={() => {
            close();
          }}
        >
          {t("button.cancel")}
        </Button>
      </Group>
    </Modal>
  );
};

export default ViewDocumentModal;
