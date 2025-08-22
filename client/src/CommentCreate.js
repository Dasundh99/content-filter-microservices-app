import React, { useState } from "react";
import axios from "axios";

const CommentCreate = ({ postId, onCommentCreated }) => {
  const [content, setContent] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.post(`http://localhost:8002/posts/${postId}/comments`, {
        content,
      });
      setContent("");
      if (onCommentCreated) onCommentCreated(); // Refresh posts/comments
      alert("Comment created successfully!");
    } catch (err) {
      console.error("Failed to create comment:", err.message);
      alert("Error creating comment. Check console for details.");
    }
  };

  return (
    <div style={{ marginTop: "10px" }}>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor={`comment-${postId}`}>New Comment</label>
          <input
            id={`comment-${postId}`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="form-control"
            placeholder="Enter your comment"
          />
        </div>
        <button type="submit" className="btn btn-primary mt-1">
          Submit
        </button>
      </form>
    </div>
  );
};

export default CommentCreate;

