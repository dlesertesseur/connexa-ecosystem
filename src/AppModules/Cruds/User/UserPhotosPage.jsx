import PhotoCard from "../../../Components/PhotoCard";
import { Title, Container, Button, Group, LoadingOverlay, Paper } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Carousel } from "@mantine/carousel";
import { API } from "../../../Constants";
import { useDispatch, useSelector } from "react-redux";
import { findWorkerById } from "../../../Features/Worker";

export function UserPhotosPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const { selectedRowId, loading, worker } = useSelector((state) => state.worker.value);

  const [imageList, setImageList] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    const params = { token: user.token, id: selectedRowId };
    dispatch(findWorkerById(params));
  }, [dispatch, selectedRowId, user]);

  useEffect(() => {
    if(worker){
      if(worker.image){
        setImageList([API.worker.urlPhotoBase + worker.image]);
      }
    }
  }, [worker]);


  return (
    <Container size={"xl"} sx={{ width: "100%" }}>
      <LoadingOverlay overlayOpacity={0.5} visible={loading} />

      <Container sx={{ width: "60%" }}>
        <Title
          mb={"lg"}
          order={2}
          align="center"
          sx={(theme) => ({
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            fontWeight: 700,
          })}
        >
          {t("crud.worker.title.photos")}
        </Title>

        {imageList ? (
          <Paper p={"xl"} withBorder>
            <Carousel slideGap="md">
              {imageList.map((img) => (
                <Carousel.Slide key={img}>
                  <PhotoCard src={img} height={300}/>
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
