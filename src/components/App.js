import '../styles/App.css';
import TopBar from "./TopBar";
import Main from "./Main";
import { TOKEN_KEY } from "../constants";
import {useEffect, useState} from "react";
import {Alert, Box, IconButton, Snackbar} from "@mui/material";
import CopyRight from "./CopyRight";
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
        <TopBar isLoggedIn={isLoggedIn} handleLogout={onLogout} handleAlert = {onAlert}/>
        {/*  <TopBar />*/}
        <Main
            isLoggedIn={isLoggedIn} handleLoggedIn={onLoggedIn} handleAlert = {onAlert}/>
        <Box sx = {{ bgcolor: 'background.paper', p: 6, pb: 2, pt: 2, }}
             component="footer">
            <CopyRight sx={{ mt: 4, mb: 2 }}/>
        </Box>
    </div>
  );
}

export default App;
