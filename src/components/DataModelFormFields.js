//React
import React, { useEffect, useState } from "react";

//Components
import DataModelArrayFieldTemplate from "./DataModelArrayFieldTemplate";
import FormDataStateContext from "./FormDataStateContext";

//Redux

//Styles
import { Accordion, Button, Col, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faUser } from "@fortawesome/free-solid-svg-icons";
import { Resizable } from "react-resizable";

//Code editor
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";

//Other
import SchemaForm from "@rjsf/bootstrap-4";
import PropTypes from "prop-types";

/**
 * Enables to edit the DasContract data model by form fields provided through react-jsonschema-form.
 *
 * @component
 */
const DataModelFormFields = ({ process, updateProcess }) => {
  /**
   * Form schema state hook.
   * @constant
   *
   * @type {[Object, function]}
   */
  const [schema, setSchema] = useState({});

  /**
   * Form UI schema state hook.
   * @constant
   *
   * @type {[Object, function]}
   */
  const [uiSchema, setUiSchema] = useState({});

  /**
   * Form data state hook.
   * @constant
   *
   * @type {[Array, function]}
   */
  const [formData, setFormData] = useState([]);

  useEffect(() => {
    process.attributes["dascontract:data-model"] &&
      setFormData(JSON.parse(process.attributes["dascontract:data-model"]));

    setSchema({
      type: "array",
      title: "Entities",
      items: {
        type: "object",
        properties: {
          id: {
            type: "number",
            title: "ID",
            minLength: 1,
            readOnly: true,
          },
          name: {
            type: "string",
            title: "Name",
            minLength: 1,
          },
          primitiveProperties: {
            type: "array",
            title: "Primitive properties",
            items: {
              type: "object",
              properties: {
                id: {
                  type: "number",
                  title: "ID",
                  minLength: 1,
                },
                name: {
                  type: "string",
                  title: "Name",
                  minLength: 1,
                },
                dataType: {
                  type: "string",
                  title: "Data type",
                  enum: [
                    "Number",
                    "Collection of numbers",
                    "UnsignedNumber",
                    "Positive number",
                    "Collection of positive numbers",
                    "Boolean",
                    "Collection of booleans",
                    "Text",
                    "Collection of texts",
                    "Date and time",
                    "Address",
                    "Collection of addresses",
                    "Billable address",
                    "Collection of billable adresses",
                    "Binary array (file, ...)",
                    "Collection of binary arrays (files, ...)",
                  ],
                },
              },
            },
            required: ["id", "name", "dataType"],
          },
          referenceProperties: {
            type: "array",
            title: "Reference properties",
            items: {
              type: "object",
              properties: {
                id: {
                  type: "number",
                  title: "ID",
                  minLength: 1,
                },
                name: {
                  type: "string",
                  title: "Name",
                  minLength: 1,
                },
                targetEntityType: {
                  type: "string",
                  title: "Target entity type",
                },
                propertyRefenceType: {
                  type: "string",
                  title: "Property reference type",
                  enum: ["Single reference", "Collection of references"],
                },
                isMandatory: {
                  type: "boolean",
                  title: "Mandatory?",
                },
              },
              required: [
                "id",
                "name",
                "propertyRefenceType",
                "targetEntityType",
              ],
            },
          },
        },
        required: ["id", "name"],
      },
    });

    setUiSchema({
      "ui:order": ["id", "name", "primitiveProperties", "referenceProperties"],
    });
  }, []);

  /**
   * Resizable component height state hook.
   * @constant
   *
   * @type {[number, function]}
   */
  const [viewerHeight, setViewerHeight] = useState(400);

  /**
   * Updates the value of "viewerHeight" when user drags the corner of Resizable component.
   *
   * @param {{Object}} size Updated size of Resizable component.
   */
  const handleResize = ({ size }) => {
    setViewerHeight(size.height);
  };

  return (
    <Col sm="6">
      <Accordion className="accordion-inline">
        <Accordion.Item
          eventKey={`${process.attributes && process.attributes.id}`}
        >
          <Accordion.Header>
            <FontAwesomeIcon className="mx-2" icon={faUser} />
            {process.attributes && process.attributes.name} (
            {process.attributes && process.attributes.id})
          </Accordion.Header>
          <Accordion.Body>
            <Resizable height={viewerHeight} onResize={handleResize}>
              <Container
                className="m-2"
                fluid={true}
                style={{ height: viewerHeight * 0.5 + "px" }}
              >
                <CodeMirror
                  value={JSON.stringify(formData, null, 4)}
                  options={{ lint: true }}
                  height={viewerHeight * 0.5 + "px"}
                  extensions={[javascript()]}
                  editable={false}
                />
              </Container>
            </Resizable>

            <FormDataStateContext.Provider value={[formData, setFormData]}>
              <SchemaForm
                schema={schema}
                uiSchema={uiSchema}
                formData={formData}
                onChange={({ formData }) => setFormData(formData)}
                ArrayFieldTemplate={DataModelArrayFieldTemplate}
              >
                <Button
                  type="submit"
                  variant="outline-primary"
                  size="m"
                  onClick={() =>
                    updateProcess(process, JSON.stringify(formData))
                  }
                >
                  <FontAwesomeIcon icon={faSave} />
                </Button>
              </SchemaForm>
            </FormDataStateContext.Provider>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Col>
  );
};

DataModelFormFields.propTypes = {
  /**
   * Process data.
   */
  process: PropTypes.object.isRequired,

  /**
   * Callback to update the value of process in the parent component.
   */
  updateProcess: PropTypes.func.isRequired,
};

export default DataModelFormFields;
