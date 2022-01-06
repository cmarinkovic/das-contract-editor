//React
import { Router } from "@reach/router";

//Components
import NavbarImpl from "./components/NavbarImpl";
import Home from "./components/Home";
import ProcessEditor from "./components/ProcessEditor";
import ActivityDasContractProperties from "./components/ActivityDasContractProperties";
import DataModel from "./components/DataModel";
import NotFound from "./components/NotFound";

//Redux

//Styles
import "./css/App.css";

//Other

/**
 * Main component of the application.
 *
 * @component
 */
function App() {
  return (
    <div className="App">
      <NavbarImpl />
      <Router>
        <Home path="/" />
        <ProcessEditor path="/process-editor" />
        <ActivityDasContractProperties path="/activity-properties" />
        <DataModel path="/data-model" />
        <NotFound default />
      </Router>
    </div>
  );
}

export default App;
