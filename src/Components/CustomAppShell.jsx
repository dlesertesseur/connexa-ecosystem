import { useEffect, useState } from "react";
import { AppShell, useMantineTheme } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { byUserId, logOut } from "../Features/Auth";
import "react-modern-drawer/dist/index.css";
import Drawer from "react-modern-drawer";
import CustomHeader from "./CustomHeader";
import CustomMenu from "./CustomMenu";
import CustomNavbar from "./CustomNavbar";
import CustomBody from "./CustomBody";
import ResponceNotification from "../Modal/ResponceNotification";
import { useTranslation } from "react-i18next";

export default function CustomAppShell() {
  const { user, error } = useSelector((state) => state.auth.value);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?.id) {
      const obj = {
        id: user.id,
        token: user.token,
      };

      dispatch(byUserId(obj));
    }
  }, [dispatch, user]);

  const theme = useMantineTheme();

  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  return (
    <AppShell
      styles={{
        main: {
          background: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      }}
      navbar={<CustomNavbar />}
      header={<CustomHeader isOpen={isOpen} setIsOpen={setIsOpen} user={user} />}
      aside={null}
      footer={null}
    >
      <CustomBody />

      <Drawer size={280} open={isOpen} onClose={toggleDrawer} direction="left">
        <CustomMenu />
      </Drawer>

      <ResponceNotification
        opened={error ? true : false}
        onClose={() => {
          dispatch(logOut());
        }}
        code={error}
        title={t("status.error")}
        text={error}
      />
    </AppShell>
  );
}
