import React from "react";
import { Breadcrumbs, Group, Skeleton, Text } from "@mantine/core";

const DataSourceHeader = ({ dataSource, text }) => {
  const items = [
    { title: dataSource?.name, href: null },
    { title: text, href: null },
  ].map((item, index) => <Text key={index}>{item.title}</Text>);

  return (
    <Group p={0}>
      {dataSource ? (
        <Group position="left">
          <Breadcrumbs>{items}</Breadcrumbs>
        </Group>
      ) : (
        <Skeleton visible={true} h={"100%"}></Skeleton>
      )}
    </Group>
  );
};

export default DataSourceHeader;
