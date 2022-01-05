//React
import { useEffect, useState } from "react";

//Components

//Redux

//Styles
import { Toast, ToastContainer } from "react-bootstrap";

//Other

const SavedToast = ({ toggle, ms, fileName }) => {
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

export default SavedToast;
