import DragTextinput from "./components/DragTextinput";
import DragTexarea from "./components/DragTexarea";
import DragSelect from "./components/DragSelect";
import DragCheckbox from "./components/DragCheckbox";
import DragButton from "./components/DragButton";
import { config } from "../../../../Constants/config";

const buildComponent = (field, index) => {
  let ret = null;
  switch (field.widget) {
    case 1:
      ret = <DragTextinput key={field.id} id={field.id} index={index} field={field} />;
      break;
    case 2:
      ret = <DragTexarea key={field.id} id={field.id} index={index} field={field} />;
      break;
    case 3:
      ret = <DragNumberinput key={field.id} id={field.id} index={index} field={field} />;
      break;
    case 4:
      ret = <DragSelect key={field.id} id={field.id} index={index} field={field} />;
      break;
    case 5:
      ret = <DragCheckbox key={field.id} id={field.id} index={index} field={field} />;
      break;
    case config.components.types.button:
      ret = <DragButton key={field.id} id={field.id} index={index} field={field} />;
      break;

    default:
      break;
  }
  // ret = <DragComponent key={item.id} id={item.id} index={index} value={item.value} />;
  return ret;
};

export { buildComponent };
