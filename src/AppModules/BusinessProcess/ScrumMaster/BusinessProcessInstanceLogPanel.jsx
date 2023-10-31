import React from "react";
import HeaderPanel from "./HeaderPanel";
import { Avatar, ScrollArea, Stack, Text, Timeline } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconCheck } from "@tabler/icons-react";
import { useWindowSize } from "../../../Hook";
import { useState } from "react";
import { useEffect } from "react";
import { findAllBusinessProcessInstancesLog } from "../../../DataAccess/BusinessProcessInstance";
import { findUserById } from "../../../DataAccess/User";
import { convertMilisegToYYYYMMDDHHMISS } from "../../../Util";
import { useContext } from "react";
import { AbmStateContext } from "./Context";
import { useSelector } from "react-redux";
import { API } from "../../../Constants";

const BusinessProcessInstanceLogPanel = ({ businessProcessInstance, onBack }) => {
  const wsize = useWindowSize();
  const headerHeight = 250;
  const { user } = useSelector((state) => state.auth.value);
  const { t } = useTranslation();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const { rowSelected, setError } = useContext(AbmStateContext);

  const getBullet = (data) => {
    let ret = null;
    if (data.photo !== null) {
      ret = <Avatar size={32} radius="xl" src={data.photo} />;
    } else {
      ret = <IconCheck size={16} />;
    }

    return ret;
  };

  const getData = async () => {
    try {
      let params = { token: user.token, id: rowSelected };
      const logs = await findAllBusinessProcessInstancesLog(params);

      const userById = new Map();
      const userIds = [...new Set(logs.map((obj) => obj.userId))];
      for (let index = 0; index < userIds.length; index++) {
        const id = userIds[index];
        if (id) {
          try {
            const userData = await findUserById({ token: user.token, id: id });
            if (userData) {
              userById.set(id, userData);
            }
          } catch (error) {
            console.log("onViewLog error -> ", error);
          }
        }
      }

      const data = logs.map((l) => {
        const u = userById.get(l.userId);
        const ret = {
          text: l.message.replace(/\([^)]*\)/g, ""),
          date: convertMilisegToYYYYMMDDHHMISS(new Date(l.dateAndTime)),
          user: u !== undefined ? `${u.firstname}, ${u.lastname}` : l.source,
          photo: u !== undefined ? `${API.productImages.baseUrl}${u.image}` : null,
        };
        return ret;
      });

      setLogs(data);
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  useEffect(() => {
    if (businessProcessInstance && businessProcessInstance.id) {
      getData();
    }
  }, [businessProcessInstance]);

  return (
    <Stack spacing={"xs"}>
      <HeaderPanel
        businessProcessInstance={businessProcessInstance}
        onBack={onBack}
        title={t("businessProcessInstances.title.viewLog")}
      />
      <ScrollArea sx={{ height: wsize.height - headerHeight }}>
        <Stack spacing={"xs"} justify="flex-start">
          <Timeline bulletSize={32} lineWidth={2}>
            {logs?.map((l, index) => {
              const ret = (
                <Timeline.Item key={index} bullet={getBullet(l)} title={l.date}>
                  <Text size="sm">{l.text}</Text>
                  <Text c="dimmed" size="xs" mt={4}>
                    {l.user}
                  </Text>
                </Timeline.Item>
              );
              return ret;
            })}
          </Timeline>
        </Stack>
      </ScrollArea>
    </Stack>
  );
};

export default BusinessProcessInstanceLogPanel;
