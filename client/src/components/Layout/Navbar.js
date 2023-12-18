import { React } from "react";
import "../Layout/Navbar.css";
import { useUser } from "../../context/userContext";

const Navbar = () => {
    const { logout } = useUser();

    return (
        <div className="navbar">
            <a className="logo" href="/">
                Home
            </a>
            <div className="nav-list">
                <ul className="nav__links">
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
