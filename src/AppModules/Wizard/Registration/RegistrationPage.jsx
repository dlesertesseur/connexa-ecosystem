import React from "react";
import { Stack, Stepper } from "@mantine/core";
import {
  IconBriefcase,
  IconCircleCheck,
  IconDiscount,
  IconDiscountCheck,
  IconListCheck,
  IconUser,
  IconUserCheck,
  IconUserShield,
} from "@tabler/icons-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Step1 } from "./Step1";
import { Step2 } from "./Step2";
import { Step3 } from "./Step3";
import { Step4 } from "./Step4";
import { useContext } from "react";
import { AbmStateContext } from "./Context";
import { Step5 } from "./Step5";

const RegistrationPage = () => {
  const { wizardData, setWizardData } = useContext(AbmStateContext);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [active, setActive] = useState(0);

  const onCancel = () => {
    setWizardData(null);
    navigate(-1);
  };

  const steps = t("wizard.registration.steps", { returnObjects: true });

  return (
    <Stack
      justify="stretch"
      spacing={0}
      sx={(theme) => ({
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[8]
            : theme.colors.gray[0],
        width: "100%",
      })}
    >
      <Stepper
        active={active}
        completedIcon={<IconCircleCheck />}
      >
        <Stepper.Step
          icon={<IconBriefcase />}
          label={steps[0].name}
          description={steps[0].description}
        >
          <Step1 title={steps[0].name} active={active} setActive={setActive} onCancel={onCancel}/>
        </Stepper.Step>

        <Stepper.Step
          icon={<IconUser />}
          label={steps[1].name}
          description={steps[1].description}
        >
          <Step2 title={steps[1].name} active={active} setActive={setActive} onCancel={onCancel}/>
        </Stepper.Step>
        <Stepper.Step
          icon={<IconListCheck />}
          label={steps[2].name}
          description={steps[2].description}
        >
          <Step3 title={steps[2].name} active={active} setActive={setActive} onCancel={onCancel}/>
        </Stepper.Step>
        <Stepper.Step
          icon={<IconUserShield />}
          label={steps[3].name}
          description={steps[3].description}
        >
          <Step4 title={steps[3].name} active={active} setActive={setActive} onCancel={onCancel}/>
        </Stepper.Step>

        <Stepper.Step
          icon={<IconDiscountCheck />}
          label={steps[4].name}
          description={steps[4].description}
        >
          <Step5 title={steps[4].name} active={active} setActive={setActive} onCancel={onCancel}/>
        </Stepper.Step>
      </Stepper>
    </Stack>
  );
};

export default RegistrationPage;
