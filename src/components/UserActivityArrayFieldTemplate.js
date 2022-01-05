//React
import React, { useContext } from "react";

//Components
import FormDataStateContext from "./FormDataStateContext";

//Redux

//Styles
import { Button, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faArrowDown,
  faPlus,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";

//Other

const UserActivityArrayFieldTemplate = (props) => {
  const [formData, setFormData] = useContext(FormDataStateContext);

  const handleAddItem = () => {
    setFormData([
      ...formData,
      {
        id: findHighestId() + 1,
        name: "",
        label: "",
        description: "",
        readonly: false,
        binding: "",
      },
    ]);
  };

  const findHighestId = () => {
    let highest = 0;

    for (let i = 0; i < formData.length; i++) {
      if (formData[i].id > highest) {
        highest = formData[i].id;
      }
    }

    return highest;
  };

  //TODO: Markup can be modified for react-bootstrap.
  return (
    <div className={props.className}>
      {props.items &&
        props.items.map((element) => (
          <div key={element.key} className={element.className}>
            <div>{element.children}</div>
            {element.hasMoveDown && (
              <Button
                variant="outline-secondary"
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
                variant="outline-secondary"
                onClick={element.onReorderClick(
                  element.index,
                  element.index - 1
                )}
              >
                <FontAwesomeIcon icon={faArrowUp} />
              </Button>
            )}
            <Button
              variant="outline-secondary"
              onClick={element.onDropIndexClick(element.index)}
            >
              <FontAwesomeIcon icon={faTrashAlt} />
            </Button>
            <hr />
          </div>
        ))}

      {props.canAdd && (
        <Row>
          <p className="col-xs-3 col-xs-offset-9 array-item-add text-right">
            <Button variant="outline-primary" size="m" onClick={handleAddItem}>
              <FontAwesomeIcon icon={faPlus} />
            </Button>
          </p>
        </Row>
      )}
    </div>
  );
};

export default UserActivityArrayFieldTemplate;
