//React
import {useNavigate} from "@reach/router"

//Components

//Redux
import {connect} from "react-redux";
import {startApp} from "../redux/UI/ui-actions";

//Styles
import {Button} from "react-bootstrap";

//Other


const Home = ({loadedContract, appStarted, startApp}) => {
        const Introduction = ({startApp}) => {
                return (
                    <div className="px-4 py-5 my-5 text-center">
                        <div className="col-lg-6 mx-auto">
                            <p className="lead mb-4">
                                A visual editor to design and generate model-driven smart contracts
                                via the Das Contract v2.0 visual domain specific language. Currently
                                supports the Solidity programming language.
                            </p>
                            <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
                                <Button
                                    onClick={() => startApp()}
                                    className="px-4"
                                    variant="outline-primary"
                                    size="lg"
                                >
                                    Start
                                </Button>
                            </div>
                        </div>
                    </div>
                )
            }
        ;

        const Instructions = () => {
                const navigate = useNavigate();

                return (
                    <div className="px-4 py-5 my-5 text-center">
                        <div className="col-lg-6 mx-auto">
                            <p className="lead mb-4">
                                Instructions
                            </p>
                            <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
                                <Button
                                    onClick={() => navigate("process-editor")}
                                    className="px-4"
                                    variant="outline-primary"
                                    size="lg"
                                >
                                    Edit contract
                                </Button>
                            </div>
                        </div>
                    </div>
                )
            }
        ;

        return (
            <div>
                {appStarted || loadedContract ? <Instructions/> : <Introduction startApp={startApp}/>}
            </div>
        );
    }
;

const mapStateToProps = state => {
        return {
            appStarted: state.ui.appStarted,
            loadedContract: state.contracts.loadedContract,
        }
    }
;

const mapDispatchToProps = dispatch => {
    return {
        startApp: () => dispatch(startApp())
    }
};

export default connect(mapStateToProps)(Home);