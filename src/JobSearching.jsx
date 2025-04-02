import React, { useState } from "react";
import "./index.css";
import Header from "./Header";

const JobSearching = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState({ field: "", date: "", skills: "" });

  const jobs = [
    { title: "Software Engineer", company: "TechCorp", field: "IT", date: "2025-04-01", skills: ["JavaScript", "React"] },
    { title: "Data Analyst", company: "DataWorld", field: "Data Science", date: "2025-03-28", skills: ["Python", "SQL"] },
    { title: "Marketing Specialist", company: "MarketPro", field: "Marketing", date: "2025-03-30", skills: ["SEO", "Content Writing"] },
  ];

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter({ ...filter, [event.target.name]: event.target.value });
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filter.field === "" || job.field === filter.field) &&
    (filter.date === "" || job.date === filter.date) &&
    (filter.skills === "" || job.skills.includes(filter.skills))
  );

  return (
    <>
    <Header/>
    <div className="job-search-container">
      <h1 className="job-search-title">Job Searching</h1>
      <input
        type="text"
        placeholder="Search for jobs..."
        value={searchTerm}
        onChange={handleSearch}
        className="job-search-bar"
      />
      <div className="job-filters">
        <select name="field" onChange={handleFilterChange} className="job-filter">
          <option value="">Select Field</option>
          <option value="IT">IT</option>
          <option value="Data Science">Data Science</option>
          <option value="Marketing">Marketing</option>
        </select>
        <select name="date" onChange={handleFilterChange} className="job-filter">
          <option value="">Select Date</option>
          <option value="2025-04-01">April 1, 2025</option>
          <option value="2025-03-28">March 28, 2025</option>
          <option value="2025-03-30">March 30, 2025</option>
        </select>
        <select name="skills" onChange={handleFilterChange} className="job-filter">
          <option value="">Select Skill</option>
          <option value="JavaScript">JavaScript</option>
          <option value="React">React</option>
          <option value="Python">Python</option>
          <option value="SQL">SQL</option>
          <option value="SEO">SEO</option>
        </select>
      </div>
      <ul className="job-list">
        {filteredJobs.map((job, index) => (
          <li key={index} className="job-item">
            <h3>{job.title}</h3>
            <p>{job.company} - {job.field}</p>
            <p><strong>Date Posted:</strong> {job.date}</p>
            <p><strong>Skills:</strong> {job.skills.join(", ")}</p>
          </li>
        ))}
      </ul>
    </div>
    </>
  );
};

export default JobSearching;