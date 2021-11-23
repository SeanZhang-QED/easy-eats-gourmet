import React from 'react';
import {Navigate} from "react-router-dom";

function Home(props) {
    const { isLoggedIn, handleAlert } = props;
    return (
        <div>
            { !isLoggedIn ?
                <Navigate to="/login" />
                :
                <>
                    this is home
                </>
            }
        </div>
    );
}

export default Home;