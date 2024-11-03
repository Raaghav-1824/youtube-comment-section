import React, { useEffect, useState, useRef, useContext } from "react";
import styled from "styled-components";
import { commentSectionContext } from "../context/context";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import LongMenu from "./LongMenu";
import { deepPurple, blue, green, orange, red, pink } from '@mui/material/colors';

// Container for the entire component
const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;
`;

// Section to add new comments
const AddCommentSection = styled.div`
  width: 60vw;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

// Comment input box with better focus styling
const Input = styled.input`
  width: 80%;
  padding: 10px;
  font-size: large;
  border: none;
  border-bottom: 2px solid lightgray;
  outline: none;
  transition: border-bottom 0.2s ease;

  &:focus {
    border-bottom: 2px solid black;
  }
`;

// Styled button for adding comments
const StyledButton = styled(Button)`
  margin-left: 15px;
  font-size: medium;
`;

// List container for displaying all comments
const CommentedListContainer = styled.div`
  width: 60vw;
  max-height: 70%;
  overflow-y: auto;
  padding: 20px;
`;

// Container for each comment and reply thread
const CommentAndReplyContainer = styled(Paper)`
  padding: 15px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

// Flexbox for comment content (avatar, text, icons)
const CommentContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

// Text style for comments
const Text = styled(Typography)`
  /* font-size: medium;
  color: #333; */
  flex-grow: 1;
  margin-left: 15px;
  font-size: 14px;
  font-weight: 400; /* Regular weight */
  color: #0f0f0f; /* Dark color */
`;

// Container for reply input and button
const ReplyInputBox = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  width: 100%;
`;

// Container for icons (like, dislike, reply)
const IconContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  color: gray;
`;


// Reply container for displaying replies
const Reply = styled.div`
  margin-top: 10px;
  padding-left: 40px;
  color: #555;
  font-size: 15px;
  font-weight: 400;
  color: #606060; /* Lighter color for replies */
`;


//random avatar color and title picker 

// Array of colors to randomly pick from
const colors = [deepPurple[500], blue[500], green[500], orange[500], red[500], pink[500]];

// Array of possible initials or titles
const titles = ['AB', 'CD', 'EF', 'GH', 'IJ', 'KL', 'MN', 'OP', 'QR', 'ST', 'UV', 'WX', 'YZ'];

const randomColor = () =>{
  return colors[Math.floor(Math.random()*colors.length)];
}

const randomTitle = () =>{
  return titles[Math.floor(Math.random*titles.length)];
}


// Input component logic
const InputContainer = () => {
  const inputRef = useRef(null);
  const {
    newCommentText,
    setNewCommentText,
    comments,
    setComments,
    replyText,
    setReplyText,
    replyingTo,
    setReplyingTo,
    editIndex, setEditIndex
  } = useContext(commentSectionContext);


  // generate random color and title on every render

  const [bgColor, setBgColor] = useState(randomColor());
  const [title, setTitle] = useState(randomTitle());

  useEffect(()=>{
     setBgColor(randomColor());
     setTitle(randomTitle())
  }, [])

  // Function to add a new comment
  const handleAddComment = () => {
    if (!newCommentText.trim()) return;

    const newComment = {
      id: comments.length + 1,
      text: newCommentText,
      replies: [],
      likeAndDislike: {
        like: 0,
        dislike: 0,
      },
    };

    if (editIndex === -1) {
      setComments((prevComments) => [...prevComments, newComment]);
    } else {
      setComments((prevComments) =>
        prevComments.map((comment, index) =>
          index === editIndex ? { ...comment, text: newCommentText } : comment
        )
      );
      setEditIndex(-1);
      
    }
    setNewCommentText(""); 
  };


  // Handle reply button click
  const handleReplyClick = (commentId) => {
    setReplyingTo(commentId);
    setReplyText("");
  };

  // Handle reply submission
  const handleReplySubmit = (commentId) => {
    if (!replyText.trim()) return;
    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...comment.replies, replyText.trim()],
        };
      }
      return comment;
    });
    setComments(updatedComments);
    setReplyingTo(null);
    setReplyText("");
  };

  // Like and dislike feature
  const handleLike = (event, commentId) => {
    const clickedBtn = event.currentTarget.getAttribute("name");
    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        if (clickedBtn === "likeBtn") {
          return {
            ...comment,
            likeAndDislike: {
              ...comment.likeAndDislike,
              like: comment.likeAndDislike.like + 1,
            },
          };
        } else {
          return {
            ...comment,
            likeAndDislike: {
              ...comment.likeAndDislike,
              dislike: comment.likeAndDislike.dislike + 1,
            },
          };
        }
      }
      return comment;
    });
    setComments(updatedComments);
  };

  // handle reply deletion

  const handleDeleteReply = (index, commentID) => {
    const updatedComments = comments.map((comment) => {
      if (comment.id === commentID) {
        return {
          ...comment,
          replies: comment.replies.filter(
            (_, replyIndex) => replyIndex !== index
          ),
        };
      }
      return comment;
    });

    setComments(updatedComments);
  };

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  // handleLongMenu

  // const handleClickLongMenu = (event) => {
  //   // setMenuClickComment(parseInt(commentID, 10))
  //   console.log(event);
  // };

  return (
    <Container>
      <AddCommentSection>
        <Input
          ref={inputRef}
          type="text"
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          placeholder="Add a comment..."
        />
        <StyledButton
          style={{ margin: "2px 20px" }}
          onClick={handleAddComment}
          variant="outlined"
        >
          Comment
        </StyledButton>
      </AddCommentSection>

      <CommentedListContainer>
        <ul>
          {comments.map((comment) => (
            <CommentAndReplyContainer key={comment.id}>
              <CommentContent>
                <Avatar sx={{ bgcolor: bgColor }}>{title}</Avatar>
                <Text className="comment" noWrap sx={{ padding: "2px 10px" }}>
                  {comment.text}
                </Text>
                <IconContainer>
                  <ReplyOutlinedIcon
                    onClick={() => handleReplyClick(comment.id)}
                  />
                  <span
                    name="likeBtn"
                    onClick={(event) => handleLike(event, comment.id)}
                  >
                    <ThumbUpOutlinedIcon />
                    {comment.likeAndDislike.like}
                  </span>
                  <span
                    name="dislikeBtn"
                    onClick={(event) => handleLike(event, comment.id)}
                  >
                    <ThumbDownOffAltOutlinedIcon />
                    {comment.likeAndDislike.dislike}
                  </span>

                  {/* Long Menu */}
                  <LongMenu commentid={comment.id} />

                </IconContainer>
              </CommentContent>

              {comment.id === replyingTo && (
                <ReplyInputBox>
                  <Input
                    style={{ flexGrow: 1 }}
                    type="text"
                    placeholder="Add a reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <Button onClick={() => handleReplySubmit(comment.id)}>
                    Reply
                  </Button>
                </ReplyInputBox>
              )}

              {comment.replies.length > 0 && (
                <Reply className="reply">
                  {comment.replies.map((reply, index) => (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-around",
                      }}
                      key={index}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          flex: "0.95",
                        }}
                        
                      >
                        <Avatar
                          src="/broken-image.jpg"
                          sx={{ width: 24, height: 24, margin: 1 }}
                        />
                        <p>{reply}</p>
                      </div>
                      <Chip
                        key={index}
                        label="Delete"
                        onClick={() => {
                          handleDeleteReply(index, comment.id);
                        }}
                      />
                    </div>
                  ))}
                </Reply>
              )}
            </CommentAndReplyContainer>
          ))}
        </ul>
      </CommentedListContainer>
    </Container>
  );
};

export default InputContainer;
