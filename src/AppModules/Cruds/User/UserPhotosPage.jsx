import PhotoCard from "../../../Components/PhotoCard";
import { Title, Container, Button, Group, LoadingOverlay, Paper } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Carousel } from "@mantine/carousel";
import { API } from "../../../Constants";
import { useDispatch, useSelector } from "react-redux";
import { AbmStateContext } from "./Context";
import { useContext } from "react";

export function UserPhotosPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const { setReload, selectedRowId, selectedUserName } = useContext(AbmStateContext);
  const [loading, setLoading] = useState(false);
  const [userFound, setUserFound] = useState(null);
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [errorCode, setErrorCode] = useState(null);

  const [imageList, setImageList] = useState([]);

  const dispatch = useDispatch();

  const findUser = async (params) => {
    setLoading(true);
    try {
      //Cambiar por findById
      const found = await findUserById(params);

      if (found.error) {
        setErrorMessage(found.error);
        setErrorCode(found.status);
        setUserFound(null);
      } else {
        setErrorMessage(null);
        setErrorCode(null);
        setUserFound(found);
      }
    } catch (error) {
      setErrorMessage(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    findUser();
  }, [user]);

  return (
    <Container size={"xl"} sx={{ width: "100%" }}>
      <LoadingOverlay overlayOpacity={0.5} visible={loading} />

      <Container sx={{ width: "60%" }}>
        <Title
          mb={"lg"}
          order={3}
          align="left"
          sx={(theme) => ({
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            fontWeight: 700,
          })}
        >
          {t("crud.user.title.photos") + " " + selectedUserName}
        </Title>

        {imageList ? (
          <Paper p={"xl"} withBorder>
            <Carousel slideGap="md">
              {imageList.map((img) => (
                <Carousel.Slide key={img}>
                  <PhotoCard src={img} height={300} />
                </Carousel.Slide>
              ))}
            </Carousel>
          </Paper>
        ) : null}

        <Group position="right" mt="xl" mb="xs">
          <Button
            onClick={(event) => {
              navigate("../");
            }}
          >
            {t("button.close")}
          </Button>
        </Group>
      </Container>
    </Container>
  );
}
