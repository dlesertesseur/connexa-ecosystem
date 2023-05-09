import React from "react";
import { Group, Image} from "@mantine/core";
// import useImage from "use-image";
// import { useTranslation } from "react-i18next";

const Logo = () => {
  // const { t } = useTranslation();
  return (
    <Group position="center" mb={"xs"}>
      {/* <Title
        align="center"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900,
        })}
      >
        {t("main.title")}
      </Title> */}
      <Image src="/images/connexa_logo.png" alt="image" width={200}/>
    </Group>
  );
};

export default Logo;
