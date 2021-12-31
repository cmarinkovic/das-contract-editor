//React
import React, {useState} from 'react';

//Components

//Redux

//Styles
import {Container} from "react-bootstrap";
import {Resizable} from 'react-resizable';

//Other
import ReactFlow from 'react-flow-renderer';


const EntityDiagram = () => {
    const elements = [
        {id: '1', type: 'input', data: {label: 'Node 1'}, position: {x: 250, y: 5}},
        // you can also pass a React Node as a label
        {id: '2', data: {label: <div>Node 2</div>}, position: {x: 100, y: 100}},
        {id: 'e1-2', source: '1', target: '2', animated: true},
    ];

    const [entityDiagramHeight, setEntityDiagramHeight] = useState(300);
    const handleResize = (event, {element, size, handle}) => {
        setEntityDiagramHeight(size.height);
    }

    return (
        <Resizable height={entityDiagramHeight}
                   onResize={handleResize}>
            <Container style={{height: entityDiagramHeight + 'px'}}>
                <ReactFlow elements={elements}/>
            </Container>
        </Resizable>
    )
};

export default EntityDiagram;



