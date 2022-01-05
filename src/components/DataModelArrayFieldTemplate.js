//React
import React, { useContext } from "react";

//Components
import FormDataStateContext from "./FormDataStateContext";

//Redux

//Styles
import { Accordion, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faPlus,
  faTrashAlt,
  faArrowDown,
} from "@fortawesome/free-solid-svg-icons";

//Other

const DataModelArrayFieldTemplate = (props) => {
  const [formData, setFormData] = useContext(FormDataStateContext);

  const addEntity = () => {
    setFormData([
      ...formData,
      {
        id: findHighestId(formData) + 1,
      },
    ]);
  };

  const findHighestId = (arr) => {
    let highest = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id > highest) {
        highest = arr[i].id;
      }
    }
    return highest;
  };

  const getTitle = (types) => {
    if (types === "Primitive properties") {
      return "Primitive property";
    } else if (types === "Reference properties") {
      return "Reference property";
    } else if (types === "Entities") {
      return "Entity";
    }
  };

  return (
    <div className={props.className}>
      <Accordion>
        <p className="h4">{props.title}</p>
        {props.items &&
          props.items.map((element) => (
            <Accordion.Item
              className={element.className}
              eventKey={element.key}
            >
              <Accordion.Header>{getTitle(props.title)}</Accordion.Header>
              <Accordion.Body>{element.children}</Accordion.Body>
              {element.hasMoveDown && (
                <Button
                  variant="outline-primary"
                  onClick={element.onReorderClick(
                    element.index,
                    element.index + 1
                  )}
                >
                  <FontAwesomeIcon icon={faArrowDown} />
                </Button>
              )}

              {element.hasMoveUp && (
                <Button
                  variant="outline-primary"
                  onClick={element.onReorderClick(
                    element.index,
                    element.index - 1
                  )}
                >
                  <FontAwesomeIcon icon={faArrowUp} />
                </Button>
              )}

              <Button
                variant="outline-primary"
                onClick={element.onDropIndexClick(element.index)}
              >
                <FontAwesomeIcon icon={faTrashAlt} />
              </Button>
              <hr />
            </Accordion.Item>
          ))}

        {props.canAdd && (
          <Button
            variant="outline-primary"
            onClick={() => {
              if (props.title === "Entities") {
                addEntity();
              } else if (props.title === "Primitive properties") {
                props.onAddClick();
              } else if (props.title === "Reference properties") {
                props.onAddClick();
              }
            }}
          >
            <FontAwesomeIcon icon={faPlus} />
          </Button>
        )}
      </Accordion>
    </div>
  );
};

export default DataModelArrayFieldTemplate;
