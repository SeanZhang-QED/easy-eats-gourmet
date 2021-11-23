import React, {useEffect, useState} from 'react';
import {Navigate} from "react-router-dom";
import SearchBar from "./SearchBar";
import {Backdrop, Box, CircularProgress, Container, Grid, Tab, Tabs} from "@mui/material";
import {BASE_URL, SEARCH_KEY, TOKEN_KEY} from "../constants";
import axios from "axios";
import ImageIcon from '@mui/icons-material/Image';
import MovieIcon from '@mui/icons-material/Movie';


function Home(props) {
    const { isLoggedIn, handleAlert } = props;
    const [ isLoading, setIsLoading ] = useState(false);
    const [ posts, setPosts ] = useState([]);
    const [ value, setValue] = useState(0);

    const handleSearch = (data) => {
        // get the data from search bar, then fetch data
        const {type, keywords} = data;
        // set loading
        setIsLoading(true);
        fetchPosts(data);
    };

    // didMount need to fetch the data from the backend for the first time
    useEffect(()=>{
        fetchPosts({
            type:SEARCH_KEY.all,
            keywords:'',
        })
    },[]);

    // didUpdate, render the view when a set of new posts fetched
    useEffect(()=>{
        renderPosts(posts);
    },[posts]);

    const fetchPosts = (data) => {
        const {type, keywords} = data;
        // fetch data
        // 1. url
        let url = "";
        if (type === SEARCH_KEY.all) {
            url = `${BASE_URL}/search`;
        } else if (type === SEARCH_KEY.user) {
            url = `${BASE_URL}/search?user=${keywords}`;
        } else {
            url = `${BASE_URL}/search?keywords=${keywords}`;
        }
        // 2. opt
        const opt = {
            method: "GET",
            url: url,
            headers: {
                Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
            }
        };
        // 3. axios
        axios(opt)
            .then((res) => {
                if (res.status === 200) {
                    console.log(res.data);
                    setPosts(res.data);
                }
            })
            .catch((err) => {
                handleAlert('error','Fetch posts failed!')
                console.log("fetch posts failed: ", err.message);
            })
            .finally(()=>{
                setIsLoading(false);
            });
    };

    const renderPosts = (type) => {
        if (type == 'image'){
            return(
                <div>
                    Images.
                </div>
            )
        }

        return(
            <div>
                Videos.
            </div>
        )
    }

    return (
        <div>
            <div>
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={isLoading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
                { !isLoggedIn ?
                    <Navigate to="/login" />
                    :
                    <SearchBar handleSearch={handleSearch}/>
                }
            </div>
            <Container sx={{ py: 2, margin: 0}} >
                <Grid container spacing={2}>
                    <Grid item xs={1} sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: 224 }}>
                        <Tabs value={value}
                              onChange={(event, newValue) => {setValue(newValue);console.log(newValue);}}
                              orientation="vertical"
                              sx={{ borderRight: 1, borderColor: 'divider' }}>
                            <Tab icon={<ImageIcon />} label="Images" />
                            <Tab icon={<MovieIcon />} label="Videos" />
                        </Tabs>
                    </Grid>
                    <Grid item xs={10}>
                        {value === 0 && renderPosts('image')}
                        {value === 1 && renderPosts('video')}
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
}

export default Home;