//React
import { useEffect, useState } from "react";

//Components

//Redux

//Styles
import { Toast, ToastContainer } from "react-bootstrap";

//Other
import PropTypes from "prop-types";

/**
 * Toast to display when user saves model.
 *
 * @component
 */
const SavedToast = ({ toggle, ms, fileName }) => {
  /**
   * Show modal state hook.
   * @constant
   *
   * @type {[boolean, function]}
   */
  const [show, setShow] = useState(false);

  /**
   * Toggles the state of "show"
   *
   */
  const toggleShow = () => setShow(!show);

  useEffect(() => {
    toggle.current = showToast;
  }, []);

  /**
   * Shows the toast for the seconds specified by "ms" prop.
   */
  const showToast = () => {
    setShow(true);

    setTimeout(() => {
      try {
        setShow(false);
      } catch (err) {
        console.log(err);
      }
    }, ms);
  };

  return (
    <ToastContainer className="saved-toast mb-4 mx-4 position-fixed bottom-0 end-0">
      <Toast show={show} onClose={toggleShow}>
        {fileName && (
          <Toast.Header>
            <strong className="me-auto">{fileName}</strong>
          </Toast.Header>
        )}
        <Toast.Body>Saved.</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

SavedToast.propTypes = {
  /**
   * Toggle modal useRef hook to be called by parent component.
   */
  toggle: PropTypes.object.isRequired,

  /**
   * ms to show the toast.
   */
  ms: PropTypes.number.isRequired,

  /**
   * Filename of the model.
   */
  fileName: PropTypes.string,
};

export default SavedToast;
