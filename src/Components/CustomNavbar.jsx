import { MediaQuery, Navbar } from "@mantine/core";

import CustomMenu from "./CustomMenu";

export default function CustomNavbar() {
  return (
    <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
      <Navbar width={{ sm: 280, lg: 280 }} hiddenBreakpoint="sm">
        <CustomMenu />
      </Navbar>
    </MediaQuery>
  );
}
