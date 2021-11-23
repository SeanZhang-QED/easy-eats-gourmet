import React, {useState} from 'react';
import {
    Avatar,
    Box,
    Button,
    Container,
    Grid, IconButton, InputAdornment,
    TextField,
    Typography
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {Link, useNavigate} from "react-router-dom";
import {BASE_URL} from "../constants";
import axios from "axios";

function Signup(props) {

    const { handleAlert } = props;
    const navigate = useNavigate();
    const [ errorText, setErrorText ] = useState("");
    const [ isMatch, setIsMatch ] = useState(true);
    const [ isEmpty, setIsEmpty ] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const signupData = {
            "username":data.get("email"),
            "password":data.get("password"),
            "validator":data.get("match_password")
        }

        // console.log(signupData);

        if (signupData.password !== signupData.validator ) {
            setErrorText("Password doesn't match");
            setIsMatch(false);
            return;
        }

        const opt = {
            method: "POST",
            url: `${BASE_URL}/signup`,
            data: signupData,
            headers: {"Content-Type": "application/json"}
        };

        axios(opt)
            .then( response => {
                // console.log(response)
                // case1: registered success
                if(response.status === 200) {
                    handleAlert('success','Registration Succeed!');
                    navigate('/login');
                }
            })
            .catch( error => {
                console.log('register failed: ', error.message);
                handleAlert('error','Registration Failed!');
            })

    }

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up and start the journey!
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="given-name"
                                name="firstName"
                                fullWidth
                                id="firstName"
                                label="First Name"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                id="lastName"
                                label="Last Name"
                                name="lastName"
                                autoComplete="family-name"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                error={isEmpty}
                                helperText={isEmpty ? 'Can not leave it empty':''}
                                onChange={(e)=>{
                                    if(!e.target.value){
                                        setIsEmpty(true);
                                    } else {
                                        setIsEmpty(false);
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                error={!isMatch}
                                helperText={isMatch ? "" : errorText}
                                onChange={()=>{setIsMatch(true)}}
                                name="password"
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                id="password"
                                autoComplete="new-password"
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
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="match_password"
                                label="Password"
                                error={!isMatch}
                                helperText={isMatch ? "" : errorText}
                                placeholder="Please enter above password again."
                                type={"password"}
                                id="match_password"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                disabled={true}
                                            >
                                                <VisibilityOff />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign Up
                    </Button>
                    <Grid container justifyContent="center">
                        <Grid item>
                            <Link to="/login">
                                {'Already have an account? Sign in'}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}

export default Signup;