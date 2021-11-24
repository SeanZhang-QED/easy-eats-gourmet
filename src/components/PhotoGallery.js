import React, {useEffect, useState} from 'react';
import Gallery from 'react-grid-gallery';
import axios from "axios";
import {Button, IconButton} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import {BASE_URL, TOKEN_KEY} from "../constants";


const captionStyle = {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    maxHeight: "240px",
    overflow: "hidden",
    position: "absolute",
    bottom: "0",
    width: "100%",
    color: "white",
    padding: "2px",
    fontSize: "90%"
};

const wrapperStyle = {
    display: "block",
    padding: "8px",
    minHeight: "1px",
    width: "100%",
    // border: "1px solid #ddd",
    overflow: "auto"
};

function PhotoGallery(props) {
    const [images, setImages] = useState(props.images);
    const [curImgIdx, setCurImgIdx] = useState(0);

    const imageArr = images.map((image) => {
        // return a object <- {}
        return {
            // what is ... ? <- Array or Object spread operator, https://oprea.rocks/blog/what-do-the-three-dots-mean-in-javascript
            // means the returned object is the same with image, but ADD a new key value pair(customOverlay:element).
            ...image,
            customOverlay: ( // A custom element to be rendered as a thumbnail overlay on hover.
                <div style={captionStyle}>
                    <div>{`${image.user}: ${image.caption}`}</div>
                </div>
            )
        };
    });

    const onDelete = () => {
        if (window.confirm(`Are you sure you want to delete this image?`)){
            const curImg = images[curImgIdx];
            const newImageArr = images.filter((img, index) => index !== curImgIdx);
            console.log('delete image ', newImageArr);
            const opt = {
                method: 'DELETE',
                url: `${BASE_URL}/post/${curImg.postId}`,
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
                        props.handleAllert('success','Delete posts successes!')
                        setImages(newImageArr);
                    }
                })
                .catch( err => {
                    // case2: fail
                    props.handleAllert('error','Delete posts failed!')
                    console.log('fetch posts failed: ', err.message);
                })
        }
    }

    const onCurrentImageChange = index => {
        console.log('curIdx ', index);
        setCurImgIdx(index)
    }

    useEffect(() => {
        setImages(props.images)
    }, [props.images])

    return (
        <div style={wrapperStyle}>
            <Gallery
                images={imageArr}
                enableImageSelection={false}
                backdropClosesModal={true}
                showLightboxThumbnails={true}
                currentImageWillChange={onCurrentImageChange}
                customControls={[
                    <Button variant="standard"
                            startIcon={<DeleteIcon />}
                            onClick={onDelete}
                            size="small"
                            sx={{color:"white"}}
                    >
                        Delete
                    </Button>
                ]}
            />
        </div>
    );
}

export default PhotoGallery;