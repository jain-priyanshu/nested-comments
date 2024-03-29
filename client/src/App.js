import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Landing/Home";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import { UserProvider } from "./context/userContext";
import BlogPage from "./components/Blog/BlogPage";

function App() {
    return (
        <UserProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/Login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="blogs/:id" element={<BlogPage />} />
                </Routes>
            </BrowserRouter>
        </UserProvider>
    );
}

export default App;
