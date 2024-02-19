import React from 'react';
import {
    Link
  } from "react-router-dom";

function Menu() {
  return (
    <nav role="navigation"> 
        <ul>
            <li><Link to="/">Home</Link></li> 
            <li><Link to="/about.html">About</Link></li> 
            <li><Link to="/login.html">Login</Link></li> 
            <li><Link to="https://google.com">Google</Link></li> 
        </ul>
    </nav>
  );
}

export default Menu;