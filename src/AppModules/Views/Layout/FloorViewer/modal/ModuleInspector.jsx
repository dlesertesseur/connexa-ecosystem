import React, { useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Grid, OrbitControls, Select } from "@react-three/drei";
import { Drawer, Group, Stack, Title } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useWindowSize } from "../../../../../Hook";
import { SelectebleBox } from "../../../../../Components/Builder3d";
import { useSelector } from "react-redux";
import { findRackById } from "../../../../../DataAccess/Racks";

const ModuleInspector = ({ opened, close, actorId }) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState(null);
  const { user, siteId, floorId } = useSelector((state) => state.auth.value);
  const [rack, setRack] = useState(null);
  const [working, setWorking] = useState(false);
  const wSize = useWindowSize();

  const getData = async () => {
    const params = {
      token: user.token,
      siteId: siteId,
      floorId: floorId,
      rackId: actorId,
    };

    setWorking(true);

    const ret = await findRackById(params);
    console.log("ModuleInspector getData -> ", actorId);

    setWorking(false);
  };

  useEffect(() => {
    if (opened && actorId) {
      // getData();
    }
  }, [opened, actorId]);

  function Foo() {
    const { size, scene } = useThree();
    console.log("Foo scene -> ", scene);
    scene.visible = true;
    //setSize()
  }

  return (
    <Drawer
      size={600}
      position="right"
      opened={opened}
      onClose={close}
      withCloseButton={false}
      overlayProps={{ opacity: 0.5, blur: 4 }}
    >
      <Stack p={"xs"}>
        <Title order={5}>{t("editor.modelStructure.title.partInspector")}</Title>

        <Group h={wSize.height - 70}>
          <Canvas camera={{ position: [0, 15, 20], fov: 25 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} />

            <Select box multiple onChange={console.log}>
              <SelectebleBox
                position={[0, 0.5, 0]}
                dimension={[1, 1, 1]}
                rotations={[0, 0, 0]}
                userData={{ id: "cadorna" }}
              />
            </Select>

            <Grid infiniteGrid position={[0, 0, 0]} />
            <OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI / 2.1} makeDefault />
          </Canvas>
        </Group>

        {/* <Group position="right">
          <Button type="submit">{t("button.accept")}</Button>
          <Button
            onClick={() => {
              close();
            }}
          >
            {t("button.close")}
          </Button>
        </Group> */}
      </Stack>
    </Drawer>
  );
};

export default ModuleInspector;
