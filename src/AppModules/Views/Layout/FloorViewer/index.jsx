import Viewer from "./Viewer";
import { useState } from "react";

const DynamicApp = ({app}) => {
  const [ setRack] = useState(null);

  const inspectRack = (rack) => {
    setRack(rack);
  };

  return <Viewer inspectRack={inspectRack} drawCenter={true} app={app}/>;
};

export default DynamicApp;
