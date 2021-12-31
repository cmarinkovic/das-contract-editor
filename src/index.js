//React
import React from 'react';
import ReactDOM from 'react-dom';

//Components
import App from './App';

//Redux
import {Provider} from "react-redux";
import store from "./redux/store";

//Styles
/// Basic
import './css/index.css';

/// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

/// bpmn-js
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import "bpmn-js/dist/assets/diagram-js.css";
import "diagram-js-minimap/assets/diagram-js-minimap.css";
import "./css/bpmn-js-properties-panel.css";
import './css/bpmn-js-bpmnlint.css';

/// dmn-js
import "dmn-js/dist/assets/diagram-js.css";
import "dmn-js/dist/assets/dmn-js-shared.css";
import "dmn-js/dist/assets/dmn-js-drd.css";
import "dmn-js/dist/assets/dmn-js-decision-table.css";
import "dmn-js/dist/assets/dmn-js-decision-table-controls.css";
import "dmn-js/dist/assets/dmn-js-literal-expression.css";
import "dmn-js/dist/assets/dmn-font/css/dmn.css";

/// Other
import 'react-resizable/css/styles.css';


ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <App/>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);
