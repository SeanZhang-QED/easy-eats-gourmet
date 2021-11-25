import React, {useState} from 'react';
import {
    Box,
    Divider,
    FormControl,
    FormControlLabel,

    IconButton,
    InputBase,
    Paper,
    RadioGroup, Typography
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import Radio from '@mui/material/Radio';
import MenuIcon from '@mui/icons-material/Menu';
import {SEARCH_KEY} from "../constants";

function SearchBar(props) {
    const [ type, setType ] = useState(SEARCH_KEY.all);
    const [ keyInfo, setKeyInfo ] = useState("");
    const [error, setError] = useState("");



    const handleSearch = () => {
        // when to show the error message under the search bar
        if (type !== SEARCH_KEY.all && keyInfo === "") {
            setError("Please input your search keyword!");
            return;
        }
        // need to remove error <- reset to ""
        setError("");
        props.handleSearch({
            type: type,
            keywords: keyInfo
        });
    };

    const changeSearchType = (e) => {
        // e is the event object
        const searchType = e.target.value;
        console.log(searchType);
        // call setStates fn to reset the searchType value
        setType(searchType);
        // 切换时应该清除error message
        setError("");
        // if search type is all, then disable the keyword, -> set the keyword=""
        if (searchType == SEARCH_KEY.all) {
            props.handleSearch({ type: SEARCH_KEY.all, keywords: "" });
        }
    };


    return (
        <Box sx={{width: "500px", margin: "0 auto"}}>
            <Paper component="form" sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 500 }}
            >
                <MenuIcon sx={{p:"10px"}}/>
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    type="text"
                    placeholder="Search Gourmet Posts"
                    onChange={event=>{setKeyInfo(event.target.value)}}
                />
                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                <IconButton
                    sx={{ p: '10px' }}
                    disabled={type == SEARCH_KEY.all}
                    onClick={handleSearch}
                >
                    <SearchIcon />
                </IconButton>
            </Paper>
            <Typography className="error-msg" textAlign="center" color="red">
                { error }
            </Typography>
            <FormControl component="fieldset" sx={{ p: '2px 4px', width: 500 }}>
                <RadioGroup row
                            name="search-type-group"
                            sx={{mt:1, display:'flex', justifyContent:'space-evenly'}}
                            onChange={changeSearchType}

                >
                    <FormControlLabel value={SEARCH_KEY.all} control={<Radio />} label="All" />
                    <FormControlLabel value={SEARCH_KEY.keyword} control={<Radio />} label="Keyword" />
                    <FormControlLabel value={SEARCH_KEY.user} control={<Radio />} label="User" />
                </RadioGroup>
            </FormControl>
        </Box>
    );
}

export default SearchBar;