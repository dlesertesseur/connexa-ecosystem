import ResponceNotification from "../../../Modal/ResponceNotification";
import ImageCard from "../../../Components/ImageCard";
import { Title, Container, Button, Group, LoadingOverlay, useMantineTheme, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteImage, findAllImagesByFloorById, uploadImage } from "../../../DataAccess/Floors";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconUpload, IconX, IconPhoto } from "@tabler/icons";
import { Carousel } from "@mantine/carousel";
import { API } from "../../../Constants";

export function ImagesByFloorPage({ user, siteId, floorId, back, onFilter }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [response, setResponse] = useState(null);
  const [imageList, setImageList] = useState([]);
  const [reload, setReload] = useState(null);

  const theme = useMantineTheme();

  useEffect(() => {
    setWorking(true);

    const params = {
      token: user.token,
      siteId: siteId,
      floorId: floorId,
    };

    findAllImagesByFloorById(params).then((list) => {
      setImageList(list);
      setWorking(false);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [floorId, siteId, user, reload]);

  const [working, setWorking] = useState(false);

  const uploadFiles = (files) => {
    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      uploadFile(file);
    }
  };

  const uploadFile = (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", file.type);

    const params = {
      token: user.token,
      siteId: siteId,
      floorId: floorId,
      data: formData,
    };

    uploadImage(params)
      .then((ret) => {
        setWorking(false);

        if (ret.status) {
          setResponse({
            code: ret.status,
            title: ret.status ? t("status.error") : t("status.ok"),
            text: ret.status ? ret.message : t("message.update"),
          });
          setResponseModalOpen(true);
        } else {
          setReload(Date.now());
        }
      })
      .catch((error) => {
        setResponse({ code: error.status, title: t("status.error"), text: error.message });
        setResponseModalOpen(true);
      });
  };

  const onClose = () => {
    setResponseModalOpen(false);
    navigate(back);
    onFilter();
  };

  const onDelete = (id) => {
    const params = {
      token: user.token,
      siteId: siteId,
      floorId: floorId,
      id: id,
    };

    deleteImage(params)
      .then((ret) => {
        setWorking(false);

        if (ret.status) {
          setResponse({
            code: ret.status,
            title: ret.status ? t("status.error") : t("status.ok"),
            text: ret.status ? ret.message : t("message.update"),
          });
          setResponseModalOpen(true);
        } else {
          setReload(Date.now());
        }
      })
      .catch((error) => {
        setResponse({ code: error.status, title: t("status.error"), text: error.message });
        setResponseModalOpen(true);
      });
  };

  return (
    <Container size={"xl"} sx={{ width: "100%" }}>
      <ResponceNotification
        opened={responseModalOpen}
        onClose={onClose}
        code={response?.code}
        title={response?.title}
        text={response?.text}
      />

      <LoadingOverlay overlayOpacity={0.5} visible={working} />

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
          {t("crud.floor.title.images")}
        </Title>

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

        {imageList ? (
          <Group grow mb="lg">
            <Carousel slideSize="70%" height={300} slideGap="md">
              {imageList.map((img) => (
                <Carousel.Slide key={img.path}>
                  <ImageCard src={API.floor.urlBase + img.path} alt={img.name} name={img.name} imageId={img.id} onDelete={onDelete}/>
                </Carousel.Slide>
              ))}
            </Carousel>
          </Group>
        ) : null}

        <Group position="right" mt="xl" mb="xs">
          <Button
            onClick={(event) => {
              navigate(back);
            }}
          >
            {t("button.close")}
          </Button>
        </Group>
      </Container>
    </Container>
  );
}
