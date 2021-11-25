import React, {useEffect, useState} from 'react';
import {Navigate} from "react-router-dom";
import SearchBar from "./SearchBar";
import {
    Backdrop,
    Box,
    CircularProgress,
    Container,
    Grid,
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

    const handleSearch = (options) => {
        // get the data from search bar, then fetch data
        const {type, keywords} = options;
        console.log("received the changed data" + type + keywords);
        setSearchOption({ type: type, keywords: keywords });
        // set loading
        setIsLoading(true);
    };

    const handleDeleted = ()=>{
        setIsLoading(true);
        fetchPosts(searchOption);
    }

    const handleUploaded = ()=>{
        setIsLoading(true);
        fetchPosts(searchOption);
    }

    useEffect((
    )=>{
        // do search
        // 1st, didMount <- type = all, keyword = "'
        // after that, didUpdate type = all/user/keyword, keyword = keyword
        console.log("Option changed!")
        fetchPosts(searchOption);
    },[searchOption]);


    const fetchPosts = (options) => {
        const {type, keywords} = options;
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
            }).finally(()=>{
            setIsLoading(false);
        })
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
        console.log("Render the tab content of Images.");
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
        return <PhotoGallery images={imageArr} handleAllert={handleAlert} handleDeleted={handleDeleted} />;
    }
    const renderVideos = () => {
        console.log("Render the tab content of Videos.");
        let videos = posts.filter((post) => post.type === "video");
        // case 1: no data
        if (!videos || videos.length === 0) {
            return <div>No data!</div>;
        }
        return (
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                {videos.map((video) => (
                        <Grid item xs={2} sm={4} md={4} key={video.url}>
                            <video src={video.url} controls={true} className="video-block" />
                            <p>
                                {video.user}: {video.message}
                            </p>
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