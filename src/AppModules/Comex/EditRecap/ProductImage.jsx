import { useState } from "react";
import { Text, Image } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import uuid from "react-uuid";

const ProductImage = ({ imageUrl, setImageUrl }) => {
  const { t } = useTranslation();
  const [files, setFiles] = useState([]);
  const [image, setImage] = useState(imageUrl);

  useEffect(() => {
    if (files && files.length) {
      const url = URL.createObjectURL(files[0]);
      setImageUrl(files[0]);
      setImage(url);
    }
  }, [files]);

  const preview = () => {
    return <Image key={uuid()} src={image} imageProps={{ onLoad: () => URL.revokeObjectURL(image) }} />;
  };

  return (
    <div>
      <Dropzone accept={IMAGE_MIME_TYPE} onDrop={setFiles}>
        {image ? preview() : <Text align="center">{t("comex.recap.products.label.image")}</Text>}
      </Dropzone>
    </div>
  );
};

export default ProductImage;
