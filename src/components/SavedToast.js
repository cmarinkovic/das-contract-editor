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
 * @property {boolean} show
 * @property {function} setShow Setter for "show".
 * @property {function} useEffect
 */

const SavedToast = ({ toggle, ms, fileName }) => {
  /**
   * Toggle modal button reference hook.
   * @constant
   *
   * @type {Object}
   */
  const [show, setShow] = useState(false);
  const toggleShow = () => setShow(!show);

  useEffect(() => {
    toggle.current = showToast;
  }, []);

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
    <ToastContainer className="mb-4 mx-4" position="bottom-end">
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
