import { React } from "react";
import "../Layout/Navbar.css";
import { useUser } from "../../context/user/userContext";

const Navbar = () => {
    const { logout } = useUser();

    return (
        <div className="navbar">
            <a class="logo" href="/">
                Home
            </a>
            <div class="nav-list">
                <ul class="nav__links">
                    <li>
                        <a href="/login">Login</a>
                    </li>
                    <li>
                        <a href="register">Register</a>
                    </li>
                    <li>
                        <a href="/login" onClick={logout}>
                            Logout
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Navbar;
