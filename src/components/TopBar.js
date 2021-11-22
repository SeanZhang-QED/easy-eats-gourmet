import React, {useState} from 'react';
import ShareIcon from '@mui/icons-material/Share';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {useNavigate} from "react-router-dom";

function TopBar(props) {
    const navigate  = useNavigate();
    const {isLoggedIn, handleLogout} = props;

    return (
        <Box className="App-header" sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{display:"flex", justifyContent:"start"}}>
                <Toolbar>
                    <ShareIcon edge={"start"} className="App-logo" />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, pl: 1 }}>
                        Easy Eats - Gourmet
                    </Typography>
                    {
                        isLoggedIn ?
                            // <LogoutOutlined className='logout' onClick={handleLogout}/>
                            "log out"
                            :
                            <Button color="inherit" onClick={() => {
                                navigate(`/login`);
                            }}>Login</Button>
                    }
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default TopBar;