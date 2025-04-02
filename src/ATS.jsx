import React, { useState } from "react";
import Header from './Header';
import "./ats.css";

const ATS = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [fileContent, setFileContent] = useState(null);
  const [fileName, setFileName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [error, setError] = useState("");
  const [isParsing, setIsParsing] = useState(false);

  // Common ATS keywords by industry
  const industryKeywords = {
    technology: ["javascript", "react", "node", "python", "java", "aws", "cloud", "api", "frontend", "backend", "full-stack", "agile", "devops", "ci/cd", "database", "sql", "nosql", "development", "programming", "software", "engineer", "developer", "architect", "application", "system", "testing", "code", "algorithm", "web", "mobile"],
    finance: ["analysis", "accounting", "financial", "compliance", "audit", "risk", "investment", "portfolio", "regulatory", "banking", "securities", "forecasting", "budget", "finance", "tax", "reconciliation", "revenue", "profit", "loss", "statements", "transactions", "assets", "liabilities", "equity"],
    healthcare: ["patient", "clinical", "medical", "health", "healthcare", "compliance", "regulations", "hipaa", "treatment", "care", "documentation", "hospital", "physician", "nurse", "therapy", "diagnosis", "pharmaceutical", "medicine", "doctor", "clinic"],
    marketing: ["campaign", "social media", "analytics", "content", "seo", "digital", "brand", "strategy", "customer", "metrics", "conversion", "marketing", "advertising", "promotion", "audience", "market", "communications", "creative", "media", "public relations", "engagement"],
    general: ["leadership", "management", "project", "team", "communication", "organization", "analysis", "collaboration", "strategy", "problem-solving", "coordination", "planning", "research", "presentation", "reporting", "achievement", "improvement", "implementation"]
  };

  // Resume sections that should be present
  const resumeSections = [
    { name: "contact", keywords: ["email", "phone", "address", "linkedin", "github", "@", ".com", "contact"] },
    { name: "education", keywords: ["education", "university", "college", "degree", "bachelor", "master", "phd", "diploma", "gpa", "school"] },
    { name: "experience", keywords: ["experience", "work", "employment", "job", "career", "position", "role"] },
    { name: "skills", keywords: ["skill", "proficiency", "competent", "expertise", "proficient", "knowledge"] }
  ];

  const handleFileChange = (event) => {
    setError("");
    setResult(null);
    const selectedFile = event.target.files[0];
    
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          setIsParsing(true);
          const text = e.target.result;
          // Simple text sanitization to handle various formats
          const sanitizedText = text
            .replace(/[\r\n]+/g, " ")  // Replace multiple newlines with space
            .replace(/\s+/g, " ")      // Replace multiple spaces with single space
            .toLowerCase();
          
          setFileContent(sanitizedText);
          setIsParsing(false);
        } catch (err) {
          setError("Error reading file: " + err.message);
          setIsParsing(false);
        }
      };
      
      reader.onerror = () => {
        setError("Failed to read the file. Please try again with a different file.");
        setIsParsing(false);
      };
      
      // For all file types, we'll just read as text
      reader.readAsText(selectedFile);
    } else {
      setFile(null);
      setFileName("");
      setFileContent(null);
    }
  };

  // Function to determine if content is too minimal
  const isMinimalContent = (content) => {
    if (!content) return true;
    
    // Count the number of words
    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
    
    // Check if the content has fewer than 50 words
    return wordCount < 50;
  };

  // Function to detect resume sections
  const detectSections = (content) => {
    if (!content) return [];
    
    return resumeSections.filter(section => {
      return section.keywords.some(keyword => content.includes(keyword));
    }).map(section => section.name);
  };

  // Function to detect industry
  const detectIndustry = (content) => {
    if (!content) return { industry: "unknown", confidence: 0 };
    
    let maxMatches = 0;
    let detectedIndustry = "unknown";
    let matchCounts = {};
    
    for (const [industry, keywords] of Object.entries(industryKeywords)) {
      const matches = keywords.filter(keyword => 
        content.includes(keyword.toLowerCase())
      ).length;
      
      matchCounts[industry] = matches;
      
      if (matches > maxMatches) {
        maxMatches = matches;
        detectedIndustry = industry;
      }
    }
    
    // Calculate confidence as a percentage of matched keywords
    const totalKeywords = industryKeywords[detectedIndustry]?.length || 1;
    const confidence = Math.min(100, Math.round((maxMatches / totalKeywords) * 100));
    
    // If confidence is too low, default to "general"
    if (confidence < 15 && detectedIndustry !== "general") {
      detectedIndustry = "general";
      maxMatches = matchCounts.general || 0;
    }
    
    return { 
      industry: detectedIndustry, 
      confidence: confidence
    };
  };

  const analyzeResume = () => {
    if (!fileContent) {
      return {
        error: "No content could be extracted from the file."
      };
    }
    
    // Check if the content is too minimal
    if (isMinimalContent(fileContent)) {
      return {
        error: "The uploaded file contains minimal content. Please upload a complete resume for accurate analysis.",
        isMinimal: true,
        content: fileContent
      };
    }
    
    // Detect present sections
    const detectedSections = detectSections(fileContent);
    
    // Identify industry based on content
    const { industry: detectedIndustry, confidence: industryConfidence } = detectIndustry(fileContent);
    
    // Get relevant keywords for detected industry
    const relevantKeywords = [
      ...industryKeywords[detectedIndustry],
      ...industryKeywords.general
    ];
    
    // Analyze keyword matches
    const keywordMatches = relevantKeywords.filter(keyword => 
      fileContent.includes(keyword.toLowerCase())
    );
    
    // Calculate keyword match score (0-100)
    const keywordScore = Math.min(100, Math.floor((keywordMatches.length / (relevantKeywords.length * 0.3)) * 100));
    
    // Job description matching (if provided)
    let jdScore = 0;
    let jdKeywords = [];
    let jdMatches = [];
    let jdMissingKeywords = [];
    
    if (jobDescription.trim()) {
      // Extract potential keywords from job description (words with 5+ characters)
      const jdLower = jobDescription.toLowerCase();
      jdKeywords = jdLower.match(/\b[a-z]{5,}\b/g) || [];
      
      // Remove duplicates and common words
      const commonWords = ["about", "above", "across", "after", "again", "against", "almost", "alone", "along", "already", "although", "always", "among", "another", "around", "because", "before", "behind", "being", "below", "between", "both", "business", "company", "could", "either", "enough", "every", "everyone", "everything", "having", "including", "inside", "should", "someone", "something", "sometimes", "their", "there", "these", "things", "those", "through", "under", "until", "using", "where", "whether", "which", "while", "within", "without", "would", "years"];
      jdKeywords = [...new Set(jdKeywords)].filter(word => !commonWords.includes(word));
      
      // Count matches
      jdMatches = jdKeywords.filter(keyword => 
        fileContent.includes(keyword)
      );
      
      // Missing keywords
      jdMissingKeywords = jdKeywords.filter(keyword => 
        !fileContent.includes(keyword)
      );
      
      // Calculate JD match score
      jdScore = Math.min(100, Math.floor((jdMatches.length / (jdKeywords.length || 1)) * 100));
    }
    
    // ATS formatting checks
    const missingSections = resumeSections
      .filter(section => !detectedSections.includes(section.name))
      .map(section => section.name);
    
    const formattingIssues = [];
    
    // Check for common formatting issues
    if (fileContent.length > 50000) {
      formattingIssues.push("Resume may be too long for some ATS systems.");
    }
    
    missingSections.forEach(section => {
      switch(section) {
        case "contact":
          formattingIssues.push("Contact information may be missing or not clearly labeled.");
          break;
        case "education":
          formattingIssues.push("Education section may be missing or not clearly labeled.");
          break;
        case "experience":
          formattingIssues.push("Work experience section may be missing or not clearly labeled.");
          break;
        case "skills":
          formattingIssues.push("Skills section may be missing or not clearly labeled.");
          break;
      }
    });
    
    // Calculate formatting score
    const formattingScore = Math.max(0, 100 - (formattingIssues.length * 15));
    
    // Calculate final ATS score with adjusted weights
    const weights = {
      keywords: 0.5,
      formatting: 0.5,
      jobDescription: 0.3  // Only added to calculation if JD is provided
    };
    
    let finalScore;
    if (jobDescription.trim()) {
      const totalWeight = weights.keywords + weights.formatting + weights.jobDescription;
      finalScore = Math.floor(
        ((keywordScore * weights.keywords) + 
        (formattingScore * weights.formatting) + 
        (jdScore * weights.jobDescription)) / totalWeight
      );
    } else {
      const totalWeight = weights.keywords + weights.formatting;
      finalScore = Math.floor(
        ((keywordScore * weights.keywords) + 
        (formattingScore * weights.formatting)) / totalWeight
      );
    }
    
    // Generate recommendations
    const recommendations = [];
    
    if (keywordScore < 70 && industryConfidence > 30) {
      const topMissingKeywords = relevantKeywords
        .filter(keyword => !fileContent.includes(keyword.toLowerCase()))
        .slice(0, 5);
        
      if (topMissingKeywords.length > 0) {
        recommendations.push(`Add more ${detectedIndustry} industry keywords like: ${topMissingKeywords.join(", ")}.`);
      }
    }
    
    if (jdScore < 70 && jobDescription.trim()) {
      const topJdMissingKeywords = jdMissingKeywords.slice(0, 5);
      if (topJdMissingKeywords.length > 0) {
        recommendations.push(`Include more job-specific terms from the job description like: ${topJdMissingKeywords.join(", ")}.`);
      }
    }
    
    formattingIssues.forEach(issue => recommendations.push(issue));
    
    if (recommendations.length === 0) {
      recommendations.push("Your resume is well-optimized for ATS systems!");
    }
    
    // Missing keywords that would improve score
    const missingKeywords = relevantKeywords
      .filter(keyword => !fileContent.includes(keyword.toLowerCase()))
      .slice(0, 10);
    
    return {
      detectedIndustry: detectedIndustry === "unknown" ? "General" : detectedIndustry.charAt(0).toUpperCase() + detectedIndustry.slice(1),
      industryConfidence,
      atsScore: finalScore,
      keywordScore,
      formatScore: formattingScore,
      jobDescriptionScore: jdScore,
      keywordsFound: keywordMatches.slice(0, 10),
      missingKeywords,
      jobSpecificMatches: jdMatches.slice(0, 10),
      jobSpecificMissing: jdMissingKeywords.slice(0, 10),
      detectedSections,
      missingSections,
      recommendations
    };
  };

  const handleAnalyze = () => {
    if (!file) {
      setError("Please upload a resume file first.");
      return;
    }
    
    setLoading(true);
    setError("");
    
    // Simulating processing time
    setTimeout(() => {
      try {
        const analysisResult = analyzeResume();
        setResult(analysisResult);
      } catch (err) {
        setError("Error analyzing resume: " + err.message);
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  const handleReset = () => {
    setFile(null);
    setFileName("");
    setFileContent(null);
    setResult(null);
    setError("");
    setJobDescription("");
  };

  return (
    <>
      <Header/>
      <div className="ats-container">
        <h1 className="ats-title">ATS Resume Analyzer</h1>
        <p className="ats-description">Upload your resume and check its ATS compatibility score.</p>
        
        {error && (
          <div className="ats-error">
            <p>{error}</p>
            {result?.isMinimal && (
              <p>We detected only header information. For accurate analysis, please upload your complete resume.</p>
            )}
          </div>
        )}
        
        <div className="ats-upload-section">
          <input 
            type="file" 
            onChange={handleFileChange} 
            className="ats-file-input"
            accept=".pdf,.txt,.doc,.docx,.rtf" 
            id="resume-upload"
          />
          <label htmlFor="resume-upload" className="ats-file-label">
            Choose Resume File
          </label>
          <p className="ats-file-name">{fileName || "No file selected"}</p>
          {isParsing && <p className="ats-parsing">Parsing file content...</p>}
        </div>
        
        <div className="ats-jd-section">
          <h3>Optional: Paste Job Description</h3>
          <p className="ats-jd-description">To get more targeted analysis, paste the job description you're applying for:</p>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="ats-jd-textarea"
            rows="5"
            placeholder="Paste job description here for better matching..."
          />
        </div>
        
        <div className="ats-button-group">
          <button 
            onClick={handleAnalyze} 
            className="ats-analyze-button"
            disabled={loading || !file}
          >
            {loading ? "Analyzing..." : "Analyze Resume"}
          </button>
          
          <button 
            onClick={handleReset}
            className="ats-reset-button"
            disabled={loading}
          >
            Reset
          </button>
        </div>
        
        {loading && (
          <div className="ats-loading">
            <p>Analyzing your resume...</p>
            <div className="ats-spinner"></div>
          </div>
        )}
        
        {result && !result.error && (
          <div className="ats-result">
            <h2 className="ats-score-heading">ATS Compatibility Score: 
              <span className={`ats-score ${
                result.atsScore >= 80 ? "ats-score-high" : 
                result.atsScore >= 60 ? "ats-score-medium" : 
                "ats-score-low"
              }`}>
                {result.atsScore}%
              </span>
            </h2>
            
            <div className="ats-score-breakdown">
              <h3>Score Breakdown:</h3>
              <div className="ats-score-detail">
                <span>Industry Keywords:</span>
                <div className="ats-progress-bar">
                  <div className="ats-progress" style={{width: `${result.keywordScore}%`}}></div>
                </div>
                <span>{result.keywordScore}%</span>
              </div>
              <div className="ats-score-detail">
                <span>ATS Formatting:</span>
                <div className="ats-progress-bar">
                  <div className="ats-progress" style={{width: `${result.formatScore}%`}}></div>
                </div>
                <span>{result.formatScore}%</span>
              </div>
              {jobDescription.trim() && (
                <div className="ats-score-detail">
                  <span>Job Description Match:</span>
                  <div className="ats-progress-bar">
                    <div className="ats-progress" style={{width: `${result.jobDescriptionScore}%`}}></div>
                  </div>
                  <span>{result.jobDescriptionScore}%</span>
                </div>
              )}
            </div>
            
            <div className="ats-industry">
              <h3>Detected Industry:</h3>
              <p>{result.detectedIndustry} 
                {result.industryConfidence < 40 && 
                  <span className="ats-low-confidence"> (low confidence - consider adding more industry-specific keywords)</span>
                }
              </p>
            </div>
            
            <div className="ats-sections">
              <h3>Resume Sections:</h3>
              <div className="ats-section-list">
                {resumeSections.map(section => (
                  <span 
                    key={section.name} 
                    className={`ats-section-tag ${result.detectedSections.includes(section.name) ? 'ats-section-found' : 'ats-section-missing'}`}
                  >
                    {section.name.charAt(0).toUpperCase() + section.name.slice(1)}
                    {result.detectedSections.includes(section.name) ? ' ✓' : ' ✗'}
                  </span>
                ))}
              </div>
            </div>
            
            {result.keywordsFound.length > 0 && (
              <div className="ats-keywords">
                <h3>ATS Keywords Found:</h3>
                <div className="ats-keyword-list">
                  {result.keywordsFound.map((keyword, index) => (
                    <span key={index} className="ats-keyword-tag">{keyword}</span>
                  ))}
                </div>
              </div>
            )}
            
            {result.missingKeywords.length > 0 && (
              <div className="ats-keywords">
                <h3>Suggested Keywords to Add:</h3>
                <div className="ats-keyword-list">
                  {result.missingKeywords.map((keyword, index) => (
                    <span key={index} className="ats-keyword-tag ats-keyword-missing">{keyword}</span>
                  ))}
                </div>
              </div>
            )}
            
            {jobDescription.trim() && result.jobSpecificMatches.length > 0 && (
              <div className="ats-keywords">
                <h3>Job-Specific Keywords Found:</h3>
                <div className="ats-keyword-list">
                  {result.jobSpecificMatches.map((keyword, index) => (
                    <span key={index} className="ats-keyword-tag ats-keyword-job">{keyword}</span>
                  ))}
                </div>
              </div>
            )}
            
            {jobDescription.trim() && result.jobSpecificMissing.length > 0 && (
              <div className="ats-keywords">
                <h3>Job-Specific Keywords Missing:</h3>
                <div className="ats-keyword-list">
                  {result.jobSpecificMissing.map((keyword, index) => (
                    <span key={index} className="ats-keyword-tag ats-keyword-job-missing">{keyword}</span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="ats-recommendations">
              <h3>Recommendations:</h3>
              <ul>
                {result.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ATS;