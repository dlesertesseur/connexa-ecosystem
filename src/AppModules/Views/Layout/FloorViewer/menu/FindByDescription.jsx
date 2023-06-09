import { Textarea } from "@mantine/core";
import React from "react";

const FindByDescription = () => {
  return (
    <Textarea
      description="Search items by similar description"
      placeholder="a description"
      label="Item description"
      withAsterisk
    />
  );
};

export default FindByDescription;
