//React
import React, {useEffect, useState} from "react";

//Components
import UserActivityArrayFieldTemplate from "./UserActivityArrayFieldTemplate";
import FormDataStateContext from "./FormDataStateContext";

//Redux

//Styles
import {Accordion, Button, Col, Container} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSave, faUser} from "@fortawesome/free-solid-svg-icons";
import {Resizable} from 'react-resizable';

//Code editor
import CodeMirror from "@uiw/react-codemirror";
import {javascript} from "@codemirror/lang-javascript";

//Other
import SchemaForm from "@rjsf/bootstrap-4";


const UserActivityFormFields = ({task, updateTask, loadedContractJSON}) => {
        const [schema, setSchema] = useState({});
        const [uiSchema, setUiSchema] = useState({});
        const [formData, setFormData] = useState([]);

        useEffect(() => {
                task.attributes["dascontract:activity-properties"] && setFormData(JSON.parse(task.attributes["dascontract:activity-properties"]));

                setupSchema();

                setUiSchema({
                        "items": {
                            "description": {
                                "ui:widget": "textarea",
                            },
                        },
                        "ui:order": ["id", "name", "label", "description", "readonly", "binding"],
                    }
                );
            }, []
        );

        const [viewerHeight, setViewerHeight] = useState(400);
        const handleResize = (event, {element, size, handle}) => {
            setViewerHeight(size.height);
        }

        const setupSchema = () => {
            const getEntities = () => {
                const superElementsArray = loadedContractJSON.elements[0].elements;
                const elementsArrayIndex = superElementsArray.findIndex(element => {
                        return element.name === "bpmn2:process";
                    }
                );

                const entities = [];

                if (loadedContractJSON.elements[0].elements[elementsArrayIndex].attributes["dascontract:data-model"]) {
                    const dataModel = JSON.parse(loadedContractJSON.elements[0].elements[elementsArrayIndex].attributes["dascontract:data-model"]);
                    dataModel.forEach(entity => {
                        entities.push(`${entity.name ? entity.name : "Untitled"} (${entity.id && entity.id})`);
                    });
                }

                return entities;
            }

            const entities = getEntities();

            setSchema({
                    type: "array",
                    items: {
                        type: "object",
                        "properties": {
                            "id": {
                                "type": "number",
                                "title": "Number",
                                "minLength": 1,
                                "readOnly": true
                            },
                            "name": {
                                "type": "string",
                                "title": "Name",
                                "minLength": 1
                            },
                            "label": {
                                "type": "string",
                                "title": "Label",
                                "minLength": 1
                            },
                            "description": {
                                "type": "string",
                                "title": "Description",
                            },
                            "readonly": {
                                "type": "boolean",
                                "title": "Readonly?",
                            },
                            "binding": {
                                "type": "string",
                                "title": "Entity binding",
                                "enum": entities
                            }
                        },
                        "required": ["id", "name", "label"]
                    }
                }
            );
        }

        return (
            <Col sm="4">
                <Accordion className="accordion-inline">
                    <Accordion.Item eventKey={`${task.attributes && task.attributes.id}`}>
                        <Accordion.Header><FontAwesomeIcon className="mx-2"
                                                           icon={faUser}/>{task.attributes && task.attributes.name} ({task.attributes && task.attributes.id})
                        </Accordion.Header>
                        <Accordion.Body>
                            <Resizable height={viewerHeight}
                                       onResize={handleResize}>
                                <Container className="m-2" fluid={true} style={{height: viewerHeight * 0.5 + 'px'}}>
                                    <CodeMirror
                                        value={JSON.stringify(formData, null, 4)}
                                        options={{lint: true}}
                                        height={viewerHeight * 0.5 + "px"}
                                        extensions={[javascript()]}
                                        editable={false}
                                    />
                                </Container>
                            </Resizable>

                            <FormDataStateContext.Provider value={[formData, setFormData]}>
                                <SchemaForm schema={schema} uiSchema={uiSchema}
                                            formData={formData}
                                            onChange={({formData}) => setFormData(formData)}
                                            ArrayFieldTemplate={UserActivityArrayFieldTemplate}>
                                    <Button
                                        type="submit"
                                        variant="outline-primary"
                                        size="m" onClick={() => updateTask(task, JSON.stringify(formData))}>
                                        <FontAwesomeIcon icon={faSave}/>
                                    </Button>
                                </SchemaForm>
                            </FormDataStateContext.Provider>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Col>
        )
    }
;

export default UserActivityFormFields;
