import * as THREE from "three";
import React, { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Grid, OrbitControls } from "@react-three/drei";
import { Button, Center, Group, Modal, Stack, Title } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useWindowSize } from "../../../../../Hook";

const ModuleInspector = ({ opened, close, part }) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState(null);
  const wSize = useWindowSize();
  useEffect(() => {}, []);

  return (
    <Modal opened={opened} size={"xl"} onClose={close} title={t("editor.modelStructure.title.partInspector")}>
      <Stack>
        <Title order={4}>{title}</Title>

        <Group grow>
          <Canvas camera={{ position: [5, 5, 5], fov: 25 }} style={{height:600}}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} />

            <Grid infiniteGrid position={[0, 0, 0]} />
            <OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI / 2.1} makeDefault />
          </Canvas>
        </Group>

        <Group position="right">
          <Button type="submit">{t("button.accept")}</Button>
          <Button
            onClick={() => {
              close();
            }}
          >
            {t("button.close")}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default ModuleInspector;
