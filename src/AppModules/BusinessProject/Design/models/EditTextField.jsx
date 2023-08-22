import { Flex, Text, TextInput } from "@mantine/core";
import React, { useState } from "react";

const EditTextField = ({ value, onEnter }) => {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(value);

  const onDoubleClick = (evt) => {
    setEditing(true);
  };

  const onKeyDown = (evt) => {
    if (evt.code === "Enter") {
      const value = text.toUpperCase();
      setEditing(false);
      setText(value);
      onEnter(value);
    }
  };

  return (
    <Flex w={"100%"} onDoubleClick={onDoubleClick} onKeyDown={onKeyDown} h={30} align={"center"}>
      {editing ? (
          <TextInput
            w={"100%"}
            size="xs"
            value={text}
            onChange={(evt) => {
              setText(evt.currentTarget.value);
            }}
          />
      ) : (
        <Text size={"sm"} weight={600}>
          {text}
        </Text>
      )}
    </Flex>
  );
};

export default EditTextField;
