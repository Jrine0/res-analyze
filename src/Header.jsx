import React from "react";
import { Link } from "react-router-dom";
import "./index.css"; 

const Header = () => {
  return (
    <nav className="header">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/resume-analysis">Resume Analysis</Link></li>
        <li><Link to="/ats">ATS</Link></li>
        <li><Link to="/job-searching">Job Searching</Link></li>
        <li><Link to="/about">About</Link></li>
      </ul>
    </nav>
  );
};

export default Header;
