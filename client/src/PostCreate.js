import React, { useState } from "react";
import axios from "axios";

const PostCreate = () => {
  const [title, setTitle] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.post("http://localhost:8001/post/create", {
        title,
      });
      setTitle("");
      alert("Post created successfully!");
    } catch (err) {
      console.error("Failed to create post:", err.message);
      alert("Error creating post. Check console for details.");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "20px auto" }}>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
            placeholder="Enter post title"
          />
        </div>
        <button type="submit" className="btn btn-primary mt-2">
          Submit
        </button>
      </form>
    </div>
  );
};

export default PostCreate;

