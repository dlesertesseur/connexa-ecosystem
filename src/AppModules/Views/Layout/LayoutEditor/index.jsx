import Editor from "./Editor";

const DynamicApp = ({app}) => {
  
  const inspectRack = (rack) => {
    // setRack(rack);
  };

  return (
    <Editor
      inspectRack={inspectRack}
      drawCenter={true}
      app={app}
    />
  );
};

export default DynamicApp;
