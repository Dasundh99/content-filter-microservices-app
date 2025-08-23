import React, { useState } from "react";
import PostCreate from "./PostCreate";
import PostList from "./PostList";
import AuthPage from "./Auth/SignUp"; // combined SignUp/SignIn component

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const handleAuthSuccess = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  // 1️⃣ If not logged in, show AuthPage
  if (!token) {
    return (
      <div className="container" style={{ maxWidth: "500px", margin: "50px auto" }}>
        <AuthPage onAuthSuccess={handleAuthSuccess} />
      </div>
    );
  }

  // 2️⃣ If logged in, show post creation and posts
  return (
    <div className="container" style={{ maxWidth: "800px", margin: "50px auto" }}>
      <button
        onClick={handleLogout}
        style={{ float: "right", margin: "10px", padding: "6px 12px" }}
      >
        Logout
      </button>

      <h1>Create Post</h1>
      <PostCreate token={token} />
      <hr />
      <h1>Posts</h1>
      <PostList token={token} />
    </div>
  );
};

export default App;

