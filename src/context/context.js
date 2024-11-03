import { createContext, useState } from "react";

export const commentSectionContext = createContext(null);

const ContextProvider = ({ children }) => {
  const [comments, setComments] = useState([
    {
      id: 1,
      text: "mock comment",
      replies: [],
      likeAndDislike: {
        like: 0,
        dislike: 0,
      },
    },
  ]);
  const [editIndex, setEditIndex] = useState(null);
  const [newCommentText, setNewCommentText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);

  return (
    <commentSectionContext.Provider
      value={{editIndex, setEditIndex, comments, setComments, newCommentText, setNewCommentText , replyText, setReplyText  ,replyingTo, setReplyingTo}}
    >
      {children}
    </commentSectionContext.Provider>
  );
};

export default ContextProvider;
