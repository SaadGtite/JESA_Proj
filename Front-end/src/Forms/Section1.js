import React, { useState,useEffect } from 'react';
import './Section1.css';
import { useParams} from 'react-router-dom';

const Section1 = () => {
  const [questions, setQuestions] = useState([
    {
      id: 'q1.1',
      title: '1.1 Project Scope Definition',
      question: 'Is the project scope clearly defined and documented with all deliverables identified?',
      actions: [
        'Update scope statement with latest client requirements',
        'Verify alignment with regulatory requirements',
        'Distribute updated scope to all stakeholders',
      ],
      refDoc: 'Project_Scope_Statement_v3.pdf',
      deliverable: 'Scope Statement Document',
      score: null,
      comment: '',
      showstopper: false,
    },
    {
      id: 'q1.2',
      title: '1.2 Project Team Structure',
      question: 'Has the project team been properly staffed with clearly defined roles and responsibilities?',
      actions: [
        'Schedule team onboarding sessions',
        'Distribute RACI matrix to all team members',
        'Confirm resource availability for Q4',
      ],
      refDoc: 'Project_Team_RACI_Matrix.xlsx',
      deliverable: 'Team Structure & RACI Matrix',
      score: null,
      comment: '',
      showstopper: false,
    },
    // Add more questions as needed
  ]);

  const handleCommentChange = (index, value) => {
    const updated = [...questions];
    updated[index].comment = value;
    setQuestions(updated);
  };

  const handleScoreChange = (index, value) => {
    const updated = [...questions];
    updated[index].score = value;
    setQuestions(updated);
  };

  const handleShowstopperChange = (index) => {
    const updated = [...questions];
    updated[index].showstopper = !updated[index].showstopper;
    setQuestions(updated);
  };

  const totalScore = questions.reduce((sum, q) => sum + (parseFloat(q.score) || 0), 0);
  const maxScore = questions.length * 5;

  return (
    <div className="crr-section">
      <div className="topbar">
        <h2>CRR Section 1: Project fundamentals</h2>
        <div className="topbar-buttons">
          <button className="btn-outline">Print</button>
          <button className="btn-outline">Export</button>
        </div>
      </div>

      <div className="project-info">
        <div><strong>Project Name:</strong> Central District Water Treatment Facility</div>
        <div><strong>Project Number:</strong> PRJ-2023-0458</div>
        <div><strong>Project Manager:</strong> Sarah Johnson</div>
        <div><strong>Construction Manager:</strong> Michael Rodriguez</div>
        <div><strong>Review Date:</strong> October 15, 2023</div>
        <div><strong>Responsible Office:</strong> Northwest Regional Office</div>
      </div>

      <div className="questions-section">
        <h3>Section 1 Questions</h3>

        {questions.map((q, index) => (
          <div className="question-card" key={q.id}>
            <h4>{q.title}</h4>
            <p className="question">{q.question}</p>
            <div className="action-items">
              <strong>Action Items:</strong>
              <ol>
                {q.actions.map((action, i) => (
                  <li key={i}>{action}</li>
                ))}
              </ol>
            </div>

            <div className="comments">
              <strong>Comments:</strong>
              <textarea
                rows="3"
                placeholder="Enter your comment..."
                value={q.comment}
                onChange={(e) => handleCommentChange(index, e.target.value)}
              />
            </div>

            <div className="metadata">
              <div><strong>Reference Document:</strong> {q.refDoc}</div>
              <div><strong>Deliverable Information:</strong> {q.deliverable}</div>
              <div>
                <strong>Score:</strong>
                <label><input
                        type="radio"
                        className="custom-radio"
                        name={q.id}
                        onChange={() => handleScoreChange(index, 0)}/> 0</label>
                <label><input
                        type="radio"
                        className="custom-radio"
                        name={q.id}
                        onChange={() => handleScoreChange(index, 2.5)}/> 2.5</label>
                <label><input
                        type="radio"
                        className="custom-radio"
                        name={q.id}
                        onChange={() => handleScoreChange(index, 5)}/> 5</label>
              </div>
              <div>
                <label>
                  <input
                    type="checkbox"
                    className="custom-checkbox"
                    checked={q.showstopper}
                    onChange={() => handleShowstopperChange(index)}/> Showstopper
                </label>
              </div>
            </div>
          </div>
        ))}

        <div className="summary-box">
          <p><strong>Questions Completed:</strong> {questions.length} of {questions.length}</p>
          <p><strong>Maximum Score:</strong> {maxScore}</p>
          <p><strong>Section Score:</strong> {totalScore}</p>
          <p><strong>Section Percentage:</strong> {((totalScore / maxScore) * 100).toFixed(0)}%</p>
          <div className="progress-bar">
            <div className="filled" style={{ width: `${(totalScore / maxScore) * 100}%` }}></div>
          </div>
          <p className="status-warning">Section requires attention before proceeding</p>
          <button className="btn-primary">Next Section</button>
        </div>
      </div>
    </div>
  );
};

export default Section1;
