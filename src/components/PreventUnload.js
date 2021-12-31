//React
import {useEffect} from "react";

//Components

//Redux

//Styles

//Other


const PreventUnload = () => {
    useEffect(() => {
        window.addEventListener('beforeunload', promptUser)

        return () => {
            window.removeEventListener('beforeunload', promptUser)
        }
    }, []);

    const promptUser = e => {
        e.preventDefault()
        e.returnValue = ''
    };

    return (
        <>
        </>
    )
};

export default PreventUnload;
