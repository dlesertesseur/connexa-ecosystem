import React from "react";
import { Container } from "@mantine/core";
import Iframe from "react-iframe";

const index = () => {
  return (
    <Container
      p={0}
      sx={(theme) => ({
        width: "100%",
        height: "100%",
        background: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[1],
      })}
    >
      <Iframe
        url="https://lookerstudio.google.com/embed/reporting/314242ea-b15c-4b93-80f3-3c5c600c00c3/page/p_dcm3wd602c"
        width="100%"
        height="100%"
        frameBorder="0"
        id=""
        className=""
        display="block"
        position="relative"
      />
    </Container>
  );
};

export default index;
