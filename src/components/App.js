import logo from '../assets/images/logo.svg';
import '../styles/App.css';
import TopBar from "./TopBar";
import Main from "./Main";
import { TOKEN_KEY } from "../constants";
import {useEffect, useState} from "react";
import {Alert, IconButton, Link, Snackbar, Typography} from "@mui/material";
import CopyRight from "./CopyRight";
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(
        localStorage.getItem(TOKEN_KEY) ? true : false
    );

    const [alertType, setAlertType] = useState();

    const [alertInfo, setAlertInfo] = useState();

    const [openAlert, setOpenAlert] = useState(false);

    const onAlert = (type, info) =>{
        setAlertType(type);
        setAlertInfo(info);
        setOpenAlert(true);
    };

    const onLogout = () => {
        console.log("log out");
        localStorage.removeItem(TOKEN_KEY);
        setIsLoggedIn(false);
    };

    const onLoggedIn = (token) => {
        if (token) {
            localStorage.setItem(TOKEN_KEY, token);
            setIsLoggedIn(true);
        }
    };

    return (
    <div className="App">
        <Snackbar open={openAlert} autoHideDuration={6000} onClose={()=>{setOpenAlert(false)}}>
            <Alert
                severity={alertType}
                action={
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                            setOpenAlert(false);
                        }}
                    >
                        <CloseIcon fontSize="inherit" />
                    </IconButton>
                }
                sx={{ mb: 2 }}
            >
                {alertInfo}
            </Alert>
        </Snackbar>
        <TopBar isLoggedIn={isLoggedIn} handleLogeout={onLogout} handleAlert = {onAlert}/>
        {/*  <TopBar />*/}
        <Main isLoggedIn={isLoggedIn} handleLoggedIn={onLoggedIn} handleAlert = {onAlert}/>
        <CopyRight sx={{ mt: 8, mb: 4 }}/>
    </div>
  );
}

export default App;
