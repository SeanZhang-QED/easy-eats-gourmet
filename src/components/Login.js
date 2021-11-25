import React, {useState} from 'react';
import {
    Avatar,
    Box,
    Button,
    Container,
    IconButton,
    InputAdornment,
    TextField,
    Typography
} from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {Link, Navigate} from "react-router-dom";
import axios from "axios";
import {BASE_URL} from "../constants";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

function Login(props) {
    // handleLoggedIn is a call back function passed by App, to store the received Token into localStorage
    const { isLoggedIn, handleLoggedIn, handleAlert } = props;
    const [ isPEmpty, setIsPEmpty ] = useState(false);
    const [ isUEmpty, setIsUEmpty ] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (event) =>{
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const username = data.get('username');
        const password = data.get('password');
        // console.log(username + '' + password );

        const opt = {
            method: "POST",
            url: `${BASE_URL}/signin`,
            data: {
                username: username,
                password: password
            },
            headers: { "Content-Type": "application/json" }
        };

        axios(opt)
            .then((res) => {
                if (res.status === 200) {
                    const { data } = res;
                    handleLoggedIn(data);
                    handleAlert('success','Login Succeed!');
                }
            })
            .catch((err) => {
                console.log("login failed: ", err.message);
                handleAlert('error','Login Failed!');
            });


    };
    return (
        <div>
            { isLoggedIn ? (
                // if the user is logged in, then redirect to home page
                <Navigate to="/home" />
            ) : (
                // otherwise, render the login component
                <Container component="main" maxWidth="xs">
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign:'center'
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign in
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="User Name"
                                name="username"
                                autoComplete="username"
                                autoFocus
                                error={isUEmpty}
                                helperText={isUEmpty ? 'Can not leave it empty':''}
                                onChange={(e)=>{
                                    if(!e.target.value){
                                        setIsUEmpty(true);
                                    } else {
                                        setIsUEmpty(false);
                                    }
                                }}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                id="password"
                                autoComplete="current-password"
                                error={isPEmpty}
                                helperText={isPEmpty ? 'Can not leave it empty':''}
                                onChange={(e)=>{
                                    if(!e.target.value){
                                        setIsPEmpty(true);
                                    } else {
                                        setIsPEmpty(false);
                                    }
                                }}
                                InputProps={{ // <-- This is where the toggle button is added.
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                onMouseDown={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign In
                            </Button>
                            <Link to="/signup">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Box>
                    </Box>
                </Container>
            )};
        </div>
    );
}

export default Login;