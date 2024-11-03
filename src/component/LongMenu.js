import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useContext } from 'react';
import { commentSectionContext } from '../context/context';

const options = [
  'Edit',
  'Delete',
];

const ITEM_HEIGHT = 48;

function LongMenu({commentid}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const {
    newCommentText,
    setNewCommentText,
    comments,
    setComments ,
    menuClickComment, setMenuClickComment,
    editIndex, setEditIndex,
    
  } = useContext(commentSectionContext);
  // console.log(props)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditComment = (event) => {
    setEditIndex(commentid - 1);
    comments.map((comment)=>{
      if(comment.id === commentid){
        setNewCommentText(comment.text);
      }
    })

  }

  const handleDeleteComment = () =>{
    const updatedComments = comments.filter((comment) => comment.id !== commentid);
    setComments(updatedComments); 
    handleClose(); 
  }


  const handleOptionSelect = (option , event) =>{
      option === "Edit" ? handleEditComment(event) : handleDeleteComment(event)
      // console.log(option , event.target);
  }

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>

      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: '20ch',
            },
          },
        }}
      >
        {options.map((option) => (
          <MenuItem commentid= {commentid} key={option} onClick={(event) => handleOptionSelect(option , event)}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

export default LongMenu;