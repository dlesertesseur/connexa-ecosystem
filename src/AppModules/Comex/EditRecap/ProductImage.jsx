import { useState } from "react";
import { Text, Image, Stack, Button } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import uuid from "react-uuid";

const ProductImage = ({ imageUrl, setImageUrl, setFileImage }) => {
  const { t } = useTranslation();
  const [files, setFiles] = useState([]);
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (imageUrl) {
      setImage(imageUrl);
    }
  }, [imageUrl]);

  useEffect(() => {
    if (files && files.length) {
      const url = URL.createObjectURL(files[0]);
      setFileImage(files[0]);
      setImage(url);
    }
  }, [files]);

  const preview = () => {
    return <Image key={uuid()} src={image} />
  };

  const onClick = () => {
    setImageUrl(null);
    setFileImage(null);
    setImage(null);
  }

  return (
    <Stack>
      <Dropzone accept={IMAGE_MIME_TYPE} onDrop={setFiles}>
        {image ? preview() : <Text align="center">{t("comex.recap.products.label.image")}</Text>}
      </Dropzone>
      {imageUrl ? <Button size="xs" onClick={onClick}><Text>{t("button.deleteImage")}</Text></Button> : null}
    </Stack>
  );
};

export default ProductImage;
