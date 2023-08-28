import { Flex, Text, TextInput } from "@mantine/core";
import { useClickOutside, useFocusTrap, useMergedRef } from "@mantine/hooks";
import { useRef } from "react";
import React, { useState } from "react";

const EditTextField = ({ value, onEnter }) => {

  const getData = () => {
    const value = text.toUpperCase();
    setEditing(false);
    setText(value);
    onEnter(value);
  }

  const myRef = useRef();
  const useClickOutsideRef = useClickOutside(getData);
  const focusTrapRef = useFocusTrap();
  const mergedRef = useMergedRef(myRef, useClickOutsideRef, focusTrapRef);

  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(value);
  
  const onDoubleClick = (evt) => {
    setEditing(true);
  };

  const onKeyDown = (evt) => {
    if (evt.code === "Enter") {
      getData();
    }
  };

  return (
    <Flex w={"100%"} onDoubleClick={onDoubleClick} onKeyDown={onKeyDown} h={30} align={"center"}>
      {editing ? (
          <TextInput
            ref={mergedRef}
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
