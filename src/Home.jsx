import React from "react";
import Header from './Header';
import "./index.css";

const Home = () => {
  return (
  <>
  <Header/>
  
    <div className="home-container">
      <h1 className="home-title">Welcome to Your Ultimate Career Growth Platform</h1>
      <p className="home-description">
        In today's fast-paced job market, staying ahead requires the right tools and insights.
        Our platform is designed to empower job seekers with AI-driven solutions that streamline
        the job search process, optimize resumes, and provide personalized career guidance.
        Whether you're a fresh graduate or an experienced professional, we help you land your dream job with ease.
      </p>
      <h2 className="home-subtitle">Key Features:</h2>
      <ul className="home-features">
        <li className="home-feature-item"><strong>AI Resume Builder</strong> – Generate a professional resume tailored to industry standards, enhanced by AI insights.</li>
        <li className="home-feature-item"><strong>ATS Optimization</strong> – Ensure your resume passes through Applicant Tracking Systems and gets noticed by recruiters.</li>
        <li className="home-feature-item"><strong>Future Skill Recommendations</strong> – Stay ahead by learning in-demand skills curated for your career growth.</li>
        <li className="home-feature-item"><strong>Smart Job Searching</strong> – Discover relevant job opportunities quickly and efficiently with AI-powered job matching.</li>
        <li className="home-feature-item"><strong>Auto-Apply System</strong> – Set your preferences, and our system will automatically apply to relevant job openings on your behalf.</li>
      </ul>
      <p className="home-mission">
        Our mission is to simplify your job search and career planning journey through intelligent
        automation and expert insights. Get started today and take the next step toward your professional success!
      </p>
    </div>
  </>
  );
};

export default Home;