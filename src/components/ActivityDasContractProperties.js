//React
import React, {useEffect, useRef, useState} from "react";
import {Link, useNavigate} from "@reach/router";

//Components
import ProcessViewer from "./ProcessViewer";
import NoTypeActivity from "./NoTypeActivity";
import UserActivityFormFields from "./UserActivityFormFields";
import ScriptActivity from "./ScriptActivity";
import BusinessRuleActivity from "./BusinessRuleActivity";
import SavedToast from "./SavedToast";

//Redux
import {connect} from "react-redux";
import {loadContract} from "../redux/Contracts/contracts-actions";

//Styles
import {Container, Row} from "react-bootstrap";

//Others
import convert from "xml-js";


const ActivityDasContractProperties = ({appStarted, loadedContract, loadContract, loadContractError}) => {
    //Data load
    const [loadedContractJSON, setLoadedContractJSON] = useState();

    useEffect(() => {
        if (loadedContract && !loadContractError) {
            setLoadedContractJSON(JSON.parse(convert.xml2json(loadedContract.xml, {
                compact: false,
                spaces: 4
            })));
        }

        redirectIfNotReady();
    }, []);

    const navigate = useNavigate();

    const redirectIfNotReady = () => {
        if (!appStarted) {
            navigate("/");
        } else if (!loadedContract || loadContractError) {
            navigate("/process-editor");
        }
    };

    //Data manipulation
    const [modelElements, setModelElements] = useState();
    const [thereAreActivities, setThereAreActivities] = useState(false);

    useEffect(
        () => {
            loadedContractJSON && filterTasks();
        }, [loadedContractJSON]);

    const filterTasks = () => {
        const superElementsArr = loadedContractJSON.elements[0].elements;

        const processArray = superElementsArr.filter(element => {
            return element.name === "bpmn2:process";
        });

        const elementsArr = processArray[0].elements;

        if (elementsArr) {

            const tasksWithoutType = elementsArr.filter(element => {
                return element.name === "bpmn2:task";
            });

            const userTasks = elementsArr.filter(element => {
                return element.name === "bpmn2:userTask";
            });

            const businessRuleTasks = elementsArr.filter(element => {
                return element.name === "bpmn2:businessRuleTask";
            });

            const scriptTasks = elementsArr.filter(element => {
                return element.name === "bpmn2:scriptTask";
            });

            const otherElements = elementsArr.filter(element => {
                return element.name !== "bpmn2:task" &&
                    element.name !== "bpmn2:userTask" &&
                    element.name !== "bpmn2:businessRuleTask" &&
                    element.name !== "bpmn2:scriptTask" &&
                    element.name !== "bpmn2:subProcess";
            });

            setModelElements([tasksWithoutType, userTasks, businessRuleTasks, scriptTasks, otherElements]);

            if (tasksWithoutType.length || userTasks.length || businessRuleTasks.length || scriptTasks.length) {
                setThereAreActivities(true);
            }
        } else {
            setThereAreActivities(false);
        }
    };

    const updateTask = (modelElementToUpdate, newData) => {
        let newModelElements;

        newModelElements = [...modelElements];

        newModelElements.forEach(newModelElementType => {
            newModelElementType.forEach(newModelElement => {
                if (newModelElement.attributes.id === modelElementToUpdate.attributes.id) {
                    newModelElement.attributes["dascontract:activity-properties"] = newData;
                }
            });
        });

        setModelElements(newModelElements);

        if (loadedContractJSON) {
            const jointModelElementTypes = joinArray(modelElements);

            const newLoadedContractJSON = loadedContractJSON;

            const superElementsArray = newLoadedContractJSON.elements[0].elements;
            const elementsArrayIndex = superElementsArray.findIndex(element => {
                    return element.name === "bpmn2:process";
                }
            );

            newLoadedContractJSON.elements[0].elements[elementsArrayIndex].elements = jointModelElementTypes;

            setLoadedContractJSON(newLoadedContractJSON);

            updateLoadedContract();
        }
    };

    const joinArray = arr => {
        const jointArray = [];

        arr.forEach(arrElement => {
                jointArray.push(...arrElement);
            }
        );

        return jointArray;
    }

    const toggleSavedToastRef = useRef(() => {
    });

    const updateLoadedContract = () => {
        const newXML = convert.json2xml(loadedContractJSON, {compact: false, spaces: 4});

        loadContract({
            ...loadedContract,
            "xml": newXML
        });

        toggleSavedToastRef.current();
    };

    //TODO: Markup can be modified for react-bootstrap.
    return (
        <Container className={`${loadContractError && "d-none"}`} fluid={true}>
            {appStarted && <SavedToast toggle={toggleSavedToastRef} ms={5000}/>}
            <Row>
                <ProcessViewer/>
            </Row>
            <Row className={`${thereAreActivities && "d-none"} mt-2`}>
                <div className="px-4 py-5 my-2 text-center">
                    <div className="col-lg-6 mx-auto">
                        <p className="lead mb-4 note">
                            Add some activities at the <Link to={"/process-editor"}>process editor</Link> to begin.
                        </p>
                    </div>
                </div>
            </Row>
            <Row className="mt-2">
                {modelElements && modelElements[0].map(task => {
                    return <NoTypeActivity key={task.attributes.id} task={task}/>
                })}
            </Row>
            <Row className="mt-2">
                {modelElements && modelElements[1].map(task => {
                    return <UserActivityFormFields key={task.attributes.id} task={task} updateTask={updateTask}
                                                   loadedContractJSON={loadedContractJSON}/>
                })}
            </Row>
            <Row className="mt-2">
                {modelElements && modelElements[3].map(task => {
                    return <ScriptActivity key={task.attributes.id} task={task} updateTask={updateTask}/>
                })}
            </Row>

            <Row className="mt-2">
                {modelElements && modelElements[2].map(task => {
                    return <BusinessRuleActivity key={task.attributes.id} task={task} updateTask={updateTask}/>
                })}
            </Row>
        </Container>
    )
};

const mapStateToProps = state => {
        return {
            appStarted: state.ui.appStarted,
            loadedContract: state.contracts.loadedContract,
            loadContractError: state.contracts.loadContractError,
        };
    }
;

const mapDispatchToProps = dispatch => {
    return {
        loadContract: contract => dispatch(loadContract(contract)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ActivityDasContractProperties);
