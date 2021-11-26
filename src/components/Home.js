import React, {useEffect, useState} from 'react';
import {Navigate} from "react-router-dom";
import SearchBar from "./SearchBar";
import {
    Backdrop,
    Box, Button, Card, CardActions, CardContent, CardMedia,
    CircularProgress,
    Container, Divider,
    Grid, IconButton,
    Tab,
    Tabs,
    Typography
} from "@mui/material";
import {BASE_URL, SEARCH_KEY, TOKEN_KEY} from "../constants";
import axios from "axios";
import ImageIcon from '@mui/icons-material/Image';
import MovieIcon from '@mui/icons-material/Movie';
import PhotoGallery from "./PhotoGallery";
import PropTypes from 'prop-types';
import UploadButton from "./UploadButton";
import DeleteIcon from '@mui/icons-material/Delete';

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
    const [searchOption, setSearchOption] = useState({
        type:SEARCH_KEY.all,
        keywords: ""
    }); // initial as an object.
    const [ isLoading, setIsLoading ] = useState(false);
    const [ posts, setPosts ] = useState([]);
    const [ value, setValue] = useState(0);
    const [ isEdited, setIsEdited] = useState(false);

    const handleSearch = (options) => {
        // get the data from search bar, then fetch data
        const {type, keywords} = options;
        console.log("received the changed data" + type + keywords);
        setSearchOption({ type: type, keywords: keywords });

    };

    const handleVideoDelete = (video) => {
        setIsEdited(true);
        if (window.confirm(`Are you sure you want to delete this video?`)){

            const opt = {
                method: 'DELETE',
                url: `${BASE_URL}/post/${video.id}`,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem(TOKEN_KEY)}`
                }
            };

            axios(opt)
                .then( res => {
                    // console.log('delete result -> ', res);
                    // case1: success
                    if(res.status === 200) {
                        // step1: set state
                        handleAlert('success','Delete posts successes!');
                        handleDeleted();
                    }
                })
                .catch( err => {
                    // case2: fail
                    handleAlert('error','Delete posts failed!');
                    console.log('fetch posts failed: ', err.message);
                })
        };
    };

    const handleDeleted = ()=>{
        // fetchPosts(searchOption);
        setIsEdited(true);
    }

    const handleUploaded = ()=>{
        // fetchPosts(searchOption);
        setIsEdited(true);
    }

    useEffect(()=>{
        if (!setIsEdited) {
            return
        };
        fetchPosts(searchOption);
        console.log("refresh the view after upload or delete.");
    },[isEdited]);

    useEffect((
    )=>{
        // do search
        // 1st, didMount <- type = all, keyword = "'
        // after that, didUpdate type = all/user/keyword, keyword = keyword
        console.log("Option changed!")
        fetchPosts(searchOption);
    },[searchOption]);


    const fetchPosts = (options) => {
        setIsLoading(true);
        const {type, keywords} = options;
        // fetch data
        // 1. url
        let url = "";
        if (type === SEARCH_KEY.all) {
            url = `${BASE_URL}/search`;
        } else if (type == SEARCH_KEY.user) {
            url = `${BASE_URL}/search?user=${keywords}`;
        } else {
            url = `${BASE_URL}/search?keywords=${keywords}`;
        }
        // console.log(type == SEARCH_KEY.user);
        // console.log(url);
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
            }).finally(()=>{
            setIsEdited(false);
            setIsLoading(false);
        });
    };

    // const renderPosts = (type) => {
    //     // case 1: no data
    //     if (!posts || posts.length === 0) {
    //         return <div>No data!</div>;
    //     }
    //     // console.log(posts);
    //     if (type === "image") {
    //         const imageArr = posts
    //             .filter((item) => item.type === "image") // filter() will return a new filtered array
    //             .map((image) => { // map = 遍历, iteration
    //                 return {
    //                     postId: image.id,
    //                     src: image.url, //required for PhotoGallery
    //                     user: image.user,
    //                     caption: image.message,
    //                     thumbnail: image.url, //required for PhotoGallery
    //                     thumbnailWidth: 300, //required for PhotoGallery
    //                     thumbnailHeight: 200 //required for PhotoGallery
    //                 };
    //             });
    //         return <PhotoGallery images={imageArr} handleAllert={handleAlert} />;
    //     } else if (type === "video") {
    //         // case 3: left the rest video post.
    //         // console.log("video -> ", posts);
    //         // return "videos";
    //         return (
    //         <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
    //             {posts
    //                 .filter((post) => post.type === "video").map((post) => (
    //                 <Grid item xs={2} sm={4} md={4} key={post.url}>
    //                     <video src={post.url} controls={true} className="video-block" />
    //                     <p>
    //                         {post.user}: {post.message}
    //                     </p>
    //                 </Grid>
    //             ))}
    //         </Grid>
    //         )
    //     }
    // }

    const renderImages = () => {
        // console.log("Render the tab content of Images.");
        if (posts == null) {
            return
        }
        // case 1: no data
        let images = posts.filter((post) => post.type === "image");
        // case 1: no data
        if (!images || images.length === 0) {
            return <div>No data!</div>;
        }
        // console.log(posts);
        const imageArr = images // filter() will return a new filtered array
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
        return <PhotoGallery images={imageArr} handleAlert={handleAlert} handleDeleted={handleDeleted} />;
    }

    const renderVideos = () => {
        // console.log("Render the tab content of Videos.");
        if (posts == null) {
            return
        }
        let videos = posts.filter((post) => post.type === "video");
        // case 1: no data
        if (!videos || videos.length === 0) {
            return <div>No data!</div>;
        }
        return (
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                {videos.map((video) => (
                        <Grid item xs={2} sm={4} md={4} key={video.url}>
                            <Card
                                variant="outlined"
                                sx={{ height: '100%', display: 'flex', flexDirection: 'column', maxWidth: 345 }}
                            >
                                <CardMedia
                                    component="video"
                                    sx={{
                                        // 16:9
                                        // pt: '56.25%',
                                    }}
                                    src={video.url}
                                    controls={true}
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h6" component="h2">
                                        {video.user}:
                                        <br/>
                                        {video.message}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button onClick={()=>handleVideoDelete(video)}> Delete </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
            </Grid>
        )
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
                    <UploadButton handleUploaded={handleUploaded} handleAlert={handleAlert}/>
                </Box>
                {/*<TabPanel value={value} index={0}>{renderPosts('image')}</TabPanel>*/}
                {/*<TabPanel value={value} index={1}>{renderPosts('video')}</TabPanel>*/}
                <TabPanel value={value} index={0}>{renderImages()}</TabPanel>
                <TabPanel value={value} index={1}>{renderVideos()}</TabPanel>
            </Container>
        </div>
    );
}

export default Home;