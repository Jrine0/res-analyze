import React from "react";
import Header from './Header';
import "./index.css";

const ResumeAnalysis = () => {
  return (
    <>
    <Header/>
    <div className="resume-container">
      <h1 className="resume-title">Resume Analysis & AI Resume Builder</h1>
      <p className="resume-description">
        Your resume is your first impression in the job market. A well-structured and optimized resume can significantly boost your chances of getting hired.
      </p>
      
      <h2 className="resume-subtitle">Fundamentals of a Strong Resume:</h2>
      <ul className="resume-fundamentals">
        <li><strong>Clear Formatting:</strong> Use simple, readable fonts and a clean structure.</li>
        <li><strong>Relevant Keywords:</strong> Match job descriptions with industry-specific keywords.</li>
        <li><strong>Concise & Impactful:</strong> Avoid lengthy paragraphs; use bullet points.</li>
        <li><strong>Achievements Over Duties:</strong> Focus on accomplishments instead of job responsibilities.</li>
        <li><strong>ATS Compatibility:</strong> Ensure proper formatting so Applicant Tracking Systems can read your resume.</li>
      </ul>
      
      <button className="resume-builder-button">Build AI-Powered Resume</button>
    </div>
    </>
  );
};

export default ResumeAnalysis;