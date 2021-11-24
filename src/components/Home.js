import React, {useEffect, useState} from 'react';
import {Navigate} from "react-router-dom";
import SearchBar from "./SearchBar";
import {
    Backdrop,
    Box,
    CircularProgress,
    Container, Fab,
    Grid, IconButton,
    Tab,
    Tabs,
    Typography
} from "@mui/material";
import {BASE_URL, SEARCH_KEY, TOKEN_KEY} from "../constants";
import axios from "axios";
import ImageIcon from '@mui/icons-material/Image';
import MovieIcon from '@mui/icons-material/Movie';
import AddIcon from '@mui/icons-material/Add';
import PhotoGallery from "./PhotoGallery";
import PropTypes from 'prop-types';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

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
        // console.log(" <- fetch all the post when component mount.")
    },[]);


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
                    // console.log(res.data);
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
        // case 1: no data
        if (!posts || posts.length === 0) {
            return <div>No data!</div>;
        }
        // console.log(posts);
        if (type === "image") {
            const imageArr = posts
                .filter((item) => item.type === "image") // filter() will return a new filtered array
                .map((image) => { // map = 遍历, iteration
                    return {
                        postId: image.id,
                        src: image.url, //required for PhotoGallery
                        user: image.user,
                        caption: image.message,
                        thumbnail: image.url, //required for PhotoGallery
                        thumbnailWidth: 300, //required for PhotoGallery
                        thumbnailHeight: 200 //required for PhotoGallery
                    };
                });
            return <PhotoGallery images={imageArr} handleAllert={handleAlert} />;
        } else if (type === "video") {
            // case 3: left the rest video post.
            // console.log("video -> ", posts);
            // return "videos";
            return (
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                {posts
                    .filter((post) => post.type === "video").map((post) => (
                    <Grid item xs={2} sm={4} md={4} key={post.url}>
                        <video src={post.url} controls={true} className="video-block" />
                        <p>
                            {post.user}: {post.message}
                        </p>
                    </Grid>
                ))}
            </Grid>
            )
        }
    }

    return (
        <div style={{height:'calc(100vh - 64px - 56px - 101px)'}}>
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
            <Container sx={{ py: 2, margin: 0, width: '100%'}} >
                <Box sx={{
                    flexGrow: 1,
                    bgcolor: 'background.paper',
                    display: 'flex',
                    height: '100%vh' }}>
                    <Tabs value={value}
                          onChange={(event, newValue) => {
                              console.log(newValue);
                              setValue(newValue);
                          }}
                          // orientation="vertical"
                          sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tab icon={<ImageIcon />} label="Images" />
                        <Tab icon={<MovieIcon />} label="Videos" />
                    </Tabs>
                    <Fab color="primary"
                         size="medium"
                         sx={{ position: 'absolute', bottom: 100, right: 24}}
                         onClick={()=>{console.log("upload!")}}
                    >
                        <AddIcon />
                    </Fab>
                </Box>
                <TabPanel value={value} index={0}>{renderPosts('image')}</TabPanel>
                <TabPanel value={value} index={1}>{renderPosts('video')}</TabPanel>
            </Container>
        </div>
    );
}

export default Home;