import UserPhotoCard from "../../../Components/UserPhotoCard";
import { Title, Container, Button, Group, LoadingOverlay, Paper, useMantineTheme, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Carousel } from "@mantine/carousel";
import { AbmStateContext } from "./Context";
import { useContext } from "react";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { deleteUserImage, getAllImages, uploadImage } from "../../../DataAccess/User";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react";
import { useSelector } from "react-redux";
import { config } from "../../../Constants/config";

export function UserPhotosPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth.value);
  const { setReload, selectedRowId, selectedUserName } = useContext(AbmStateContext);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const [imageList, setImageList] = useState([]);
  const [localReload, setLocalReload] = useState(null);

  const theme = useMantineTheme();

  const getImages = async () => {
    const params = {
      token: user.token,
      userId: selectedRowId,
    };
    setLoading(true);
    try {
      const images = await getAllImages(params);
      setImageList(images);
    } catch (error) {
      setErrorMessage(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getImages();
  }, [localReload]);

  const uploadFiles = async (files) => {
    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      await uploadFile(file);
    }
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", file.type);

    const params = {
      token: user.token,
      userId: selectedRowId,
      data: formData,
    };

    try {
      await uploadImage(params);
      setLocalReload(Date.now());
    } catch (error) {
      setErrorMessage(error);
    }
  };

  const onDelete = async (imageId) => {
    const params = {
      token: user.token,
      id: imageId,
    };

    setLoading(true);

    try {
      await deleteUserImage(params);
      setLocalReload(Date.now());

    } catch (error) {
      setErrorMessage(error);
    }
    setLoading(false);
  };

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

        {imageList?.length > 0 ? (
          <Paper p={"xl"} withBorder mb={"xs"}>
            <Carousel slideGap="md">
              {imageList.map((img) => (
                <Carousel.Slide key={img}>
                  <UserPhotoCard
                    src={config.SERVER + ":" + config.PORT + img.path}
                    height={250}
                    name={img.name}
                    onDelete={onDelete}
                    imageId={img.id}
                  />
                </Carousel.Slide>
              ))}
            </Carousel>
          </Paper>
        ) : null}

        <Group grow mb="lg">
          <Dropzone
            onDrop={(files) => uploadFiles(files)}
            onReject={(files) => console.log("rejected files", files)}
            maxSize={3 * 1024 ** 2}
            accept={IMAGE_MIME_TYPE}
          >
            <Group position="center" spacing="xl" style={{ minHeight: 220, pointerEvents: "none" }}>
              <Dropzone.Accept>
                <IconUpload
                  size={50}
                  stroke={1.5}
                  color={theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 4 : 6]}
                />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <IconX size={50} stroke={1.5} color={theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]} />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <IconPhoto size={50} stroke={1.5} />
              </Dropzone.Idle>

              <div>
                <Text size="xl" inline>
                  {t("label.dropZone")}
                </Text>
                <Text size="sm" color="dimmed" inline mt={7}>
                  {t("label.dropZoneSub")}
                </Text>
              </div>
            </Group>
          </Dropzone>
        </Group>
        <Group position="right" mt="xl" mb="xs">
          <Button
            onClick={(event) => {
              navigate("../");
              setReload(Date.now())
            }}
          >
            {t("button.close")}
          </Button>
        </Group>
      </Container>
    </Container>
  );
}
