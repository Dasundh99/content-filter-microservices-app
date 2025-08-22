import React from "react";

const CommentList = ({ comments = [] }) => {
  const renderedComments = comments.map((comment) => {
    let content;
    switch (comment.status) {
      case "pending":
        content = "This comment is awaiting moderation!";
        break;
      case "rejected":
        content = "This comment has been rejected!";
        break;
      default:
        content = comment.content;
        break;
    }
    return (
      <li key={comment.id} style={{ marginBottom: "5px" }}>
        {content}
      </li>
    );
  });

  return <ul>{renderedComments}</ul>;
};

export default CommentList;

