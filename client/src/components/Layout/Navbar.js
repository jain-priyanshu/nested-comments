import { React, useEffect } from "react";
import "../Layout/Navbar.css";
import { useUser } from "../../context/userContext";

const Navbar = () => {
    const { logout, isAuth, username } = useUser();

    return (
        <div className="navbar">
            {isAuth ? (
                <a className="logo" href="/">
                    {username}
                </a>
            ) : (
                <a className="logo" href="/">
                    Home
                </a>
            )}

            <div className="nav-list">
                <ul className="nav__links">
                    {!isAuth && (
                        <>
                            <li>
                                <a href="/login">Login</a>
                            </li>
                            <li>
                                <a href="/register">Register</a>
                            </li>
                        </>
                    )}

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
