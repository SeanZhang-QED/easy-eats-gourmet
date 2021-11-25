import React, {useState} from 'react';
import {
    Backdrop,
    Box,
    Button, CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, Divider,
    Fab,
    IconButton, Input,
    Modal, TextField,
    Typography
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import {BASE_URL, TOKEN_KEY} from "../constants";
import axios from "axios";
import {Navigate} from "react-router-dom";
import SearchBar from "./SearchBar";


const BootstrapDialogTitle = (props) => {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, pt: '4px', pb: '4px', width:'500px' }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 4,
                        p:'4px',
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};

function UploadButton(props) {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState();
    const [isEmpty, setIsEmpty] = useState(false);
    const [currentFile, setCurrentFile] = useState();
    const [loading, setLoading] = useState(false);

    const handleOpen = () => {
        setOpen(true);
        console.log("the Upload Modal is open!");
    };
    const handleClose = () => {
        setMessage(null);
        setCurrentFile(null);
        setIsEmpty(false);
        setOpen(false);
    };

    const handleUpload = () => {
        console.log(currentFile);
        console.log(message);
        setLoading(true);
        // get form data
        // 整理上传数据发送给后端
        // step 1: get post info, need to refresh video or img, <- need to specific the type of the file
        const description = message;
        const uploadPost = currentFile;
        const { type } = uploadPost; // uploadPost is an array(size=1).
        const postType = type.match(/^(image|video)/g)[0]; // also return an array of matched results.
        if (postType) {
            let formData = new FormData();
            formData.append("message", description);
            formData.append("media_file", uploadPost);

            // step 2: config opt method
            const opt = {
                method: "POST",
                url: `${BASE_URL}/upload`,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
                },
                data: formData
            };

            // step 3: sent data to the server
            axios(opt)
                .then((res) => {
                    if (res.status === 200) {
                        props.handleAlert("success", "The image/video is uploaded!" );
                        // 1. clear formItem
                        // 2. close the modal
                        // -> all in handleClose
                        handleClose();
                        // 3.
                        props.handleUploaded();
                    }
                })
                .catch((err) => {
                    console.log("Upload image/video failed: ", err.message);
                    props.handleAlert('error','Failed to upload image/video!')
                })
                .finally(()=>{
                    setLoading(false);
                });
        }
    };

    return (
        <Box>
            <div>
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={loading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            </div>
            <Fab color="primary"
                 size="medium"
                 sx={{position: 'absolute', bottom: 100, right: 24}}
                 onClick={handleOpen}
            >
                <AddIcon />
            </Fab>
            <Dialog open={open} onClose={handleClose}
                    sx={{
                        position: 'absolute',
                        top: '-15%',
                    }}>
                <BootstrapDialogTitle onClose={handleClose} >
                    Upload Ur favorites!
                </BootstrapDialogTitle>
                <Divider />
                <DialogContent >
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="message"
                        label="Message of the post"
                        type="text"
                        fullWidth
                        variant="standard"
                        error={isEmpty}
                        helperText={isEmpty ? 'Can not leave it empty':''}
                        onChange={(event)=>{
                            let curMess = event.target.value;
                            setMessage(curMess);
                            if (!curMess){
                                setIsEmpty(true);
                            } else {
                                setIsEmpty(false);
                            }
                        }}
                        style={{paddingBottom:'24px'}}
                    />
                    <label htmlFor="btn-upload" >
                        <input
                            id="btn-upload"
                            name="btn-upload"
                            style={{ display: 'none'}}
                            type="file"
                            accept="image/*"
                            onChange={(event)=>{
                                let file = event.target.files[0];
                                // console.log(file);
                                setCurrentFile(file);
                            }}
                        />
                        <div style={{display:'flex', alignItems:'center'}}>
                            <Button
                                className="btn-choose"
                                variant="outlined"
                                component="span"
                            >
                                Choose Files
                            </Button>
                            <div className="file-name" style={{paddingLeft:'16px'}}>
                                {currentFile ? currentFile.name : null}
                            </div>
                        </div>
                    </label>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}
                            variant="outlined">
                        Cancel
                    </Button>
                    <Button variant="outlined"
                            disabled={!currentFile}
                            onClick={handleUpload}>
                        Upload
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default UploadButton;