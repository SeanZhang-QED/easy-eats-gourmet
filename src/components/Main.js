import React from 'react';
import Login from "./Login";
import Signup from "./Signup";
import Home from "./Home";
import { Route, Routes} from "react-router-dom";
import Box from "@mui/material/Box";


function Main(props) {
    const { isLoggedIn, handleLoggedIn, handleAlert } = props;

    return (
        <Box className="main" >
            <Routes>
                <Route path="/" exact element={<Login isLoggedIn={isLoggedIn} handleLoggedIn={handleLoggedIn} handleAlert={handleAlert}/>} />
                <Route path="/login" element={<Login isLoggedIn={isLoggedIn} handleLoggedIn={handleLoggedIn} handleAlert={handleAlert}/>} />
                <Route path="/signup" element={<Signup handleAlert={handleAlert}/>} />
                <Route path="/home" element={<Home isLoggedIn={isLoggedIn} handleAlert={handleAlert}/>} />
            </Routes>
        </Box>
    );
}

export default Main;