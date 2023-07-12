function getModulePartColor(obj) {
    let color;
  
    if (obj.color) {
      color = obj.color;
    } else {
      switch (obj.type) {
        case 1:
          color = "#468faf";
          break;
        case 2:
          color = "#d3d3d3";
          break;
        case 3:
          color = "#468faf";
          break;
        case 4:
          color = "#468faf";
          break;
        case 5:
          color = "#F8F9D7";
          break;
        case 10:
          color = "#C0B99D";
          break;
        case 11:
          color = "#F8F9D7";
          break;
        case 12:
          color = "#0000FF";
          break;
  
        default:
          color = "#ff00ff";
          break;
      }
    }
  
    return color;
  }
  
  function getModulePartStrokeColor(type) {
    let color;
  
    switch (type) {
      case 1:
        color = "#468faf";
        break;
      case 2:
      case 10:
        color = "#d3d3d3";
        break;
      case 3:
        color = "#468faf";
        break;
      case 4:
        color = "#468faf";
        break;
      case 5:
        color = "#F8F9D7";
        break;
      case 11:
        color = "#FFA500";
        break;
      case 12:
        color = "#0000ff";
        break;
  
      default:
        color = "#ff00ff";
        break;
    }
  
    return color;
  }

  export {getModulePartColor, getModulePartStrokeColor}