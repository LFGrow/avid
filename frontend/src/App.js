import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import CreatePost from "./pages/CreatePost";
import EditProfile from "./pages/EditProfile";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Post from "./pages/Post";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path=":userid" element={<Profile />}>
          <Route path=":postid" element={<Post />} />
          <Route path="create-post" element={<CreatePost />} />
          <Route path="edit" element={<EditProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
