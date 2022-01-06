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
import { propTypes } from "react-bootstrap/esm/Image";

//Other
import PropTypes from "prop-types";

/**
 * A user activity ArrayFieldTemplate for react-jsonschema-form.
 *
 * @component
 */
const UserActivityArrayFieldTemplate = (props) => {
  /**
   * Form data from FormDataStateContext.Provider.
   * @constant
   *
   * @type {[string, function]}
   */
  const [formData, setFormData] = useContext(FormDataStateContext);

  /**
   * Updates "formDate" on item add.
   */
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

  /**
   * Finds the highest among all objects inside an array of objects.
   *
   * @returns {number} Highest id found.
   */
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
    <>
      {formData && (
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
                <Button
                  variant="outline-primary"
                  size="m"
                  onClick={handleAddItem}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </Button>
              </p>
            </Row>
          )}
        </div>
      )}
    </>
  );
};

UserActivityArrayFieldTemplate.propTypes = {
  /**
   * Props coming form "SchemaForm" component.
   */
  props: propTypes.object.isRequired,
};

export default UserActivityArrayFieldTemplate;
