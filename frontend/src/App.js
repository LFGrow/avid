import { BrowserRouter, Route, Routes } from "react-router-dom";
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
				<Route path="/feed" element={<Home />} />
				<Route path="/" element={<Login />} />
				<Route path="signup" element={<Signup />} />
				<Route path="post">
					<Route path=":postId" element={<Post />} />
					<Route path="create" element={<CreatePost />} />
				</Route>
				<Route path=":userId" element={<Profile />} />
				<Route path="edit-profile" element={<EditProfile />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
