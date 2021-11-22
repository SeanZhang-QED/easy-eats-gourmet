import React from 'react';
import {Box, Link, Typography} from "@mui/material";

function CopyRight(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="#">
                Easy Eats - Gourmet
            </Link>{' '}
            {new Date().getFullYear()}
            {'. All Rights Reserved. Website Made by Sean - '}
            <Link color="inherit" href="mailto:Sean.XUANZHANG@gmail.com">
                Xuan Zhang
            </Link>
            {'. '}
        </Typography>
    );
}

export default CopyRight;