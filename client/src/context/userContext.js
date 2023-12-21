import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    useMemo,
} from "react";
import axios from "axios";
import setAuthToken from "../utils/setToken";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userId, setUserId] = useState(null);
    const [isAuth, setAuth] = useState(false);
    const token = localStorage.getItem("token");
    const [blogs, setBlogs] = useState(null);
    const [currBlog, setCurrBlog] = useState(null);
    const [comments, setComments] = useState([]);
    const [error, setError] = useState(null);

    const commentsByParentId = useMemo(() => {
        const group = {};
        comments.forEach((comment) => {
            group[comment.parent_id] ||= [];
            group[comment.parent_id].push(comment);
        });
        return group;
    }, [comments]);

    const loadUser = async () => {
        if (localStorage.token) {
            setAuthToken(localStorage.token);
        }

        try {
            const res = await axios.get("http://localhost/users/current");
            setAuth(true);
            setUserId(res.data[0].user_id);
        } catch (err) {
            console.error(err);
        }
    };

    // login
    const login = async (formData) => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        try {
            const res = await axios.post(
                "http://localhost/users/login",
                formData,
                config
            );
            setAuth(true);
            localStorage.setItem("token", res.data.token);
            setUserId(res.data.user_id);
            loadUser();
        } catch (err) {
            setError(err.response.data.message);
            RemoveError();
        }
    };

    // register
    const register = async (formData) => {
        const config = {
            hedaers: {
                "Content-Type": "application/JSON",
            },
        };

        try {
            const res = await axios.post(
                "http://localhost/users/register",
                formData,
                config
            );
            setAuth(true);
            localStorage.setItem("token", res.data.token);
            loadUser();
        } catch (err) {
            setError(err.response.data.message);
            RemoveError();
        }
    };

    // logout
    const logout = () => {
        localStorage.removeItem("token");
        setAuth(false);
    };

    const getBlogs = async () => {
        try {
            const res = await axios.get("http://localhost/blogs/all");
            setBlogs(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const getBlogById = async (id) => {
        try {
            const res = await axios.get(`http://localhost/blogs/${id}`);
            setCurrBlog(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    // gets all comments for a blog_id
    const getComments = async (blog_id) => {
        try {
            const res = await axios.get(
                `http://localhost/comments/all/${blog_id}`
            );
            setComments(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    // gets "child" comments of a given parent comment
    const getReplies = (parent_id) => {
        return commentsByParentId[parent_id];
    };

    // adds comments to state
    const addComments = (comment) => {
        setComments((prev) => {
            return [comment, ...prev];
        });
    };

    const postComment = async (formData) => {
        const config = {
            hedaers: {
                "Content-Type": "application/JSON",
            },
        };
        try {
            const res = await axios.post(
                "http://localhost/comments/post",
                formData,
                config
            );
            addComments(res.data);
        } catch (err) {
            setError(err.response.data.message);
            console.log(err);
            RemoveError();
        }
    };

    const RemoveError = () => {
        setTimeout(() => {
            setError([]);
        }, 3000);
    };

    useEffect(() => {
        setAuthToken(token);
    }, [token]);

    useEffect(() => {
        loadUser();
    }, []);

    const contextValue = {
        userId,
        isAuth,
        blogs,
        currBlog,
        commentsByParentId,
        parentComments: commentsByParentId[null],
        comments,
        error,
        login,
        register,
        logout,
        getBlogs,
        getBlogById,
        getComments,
        getReplies,
        addComments,
        postComment,
        loadUser,
    };

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);

    if (!context) {
        throw new Error("useUser nust be used within a UserProvider");
    }

    return context;
};
