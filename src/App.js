import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import ResumeAnalysis from "./ResumeAnalysis";
import ATS from "./ATS";
import JobSearching from "./JobSearching";
import Header from "./Header";
import "./index.css";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resume-analysis" element={<ResumeAnalysis />} />
        <Route path="/ats" element={<ATS />} />
        <Route path="/job-searching" element={<JobSearching />} />
      </Routes>
    </>
  );
};

export default App;
