import React, { useState, useEffect } from 'react';
import './Section1.css';
import { useParams} from 'react-router-dom';

const Section1 = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/questions') // Adjust port if needed
      .then(res => res.json())
      .then(data => setQuestions(data))
      .catch(err => console.error('Failed to fetch questions:', err));
  }, []);

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
      <h2>CRR Section 1: Project Fundamentals</h2>

      <div className="questions-section">
        {questions.map((q, index) => (
          <div className={`question-card${q.score === 'N/A' ? ' inactive-card' : ''}`} key={q.id}>
            <h4>{q.title}</h4>
            <p>{q.question}</p>

            {/* Editable Actions */}
            <div>
              <label>
                Actions:
                <input
                  type="text"
                  value={Array.isArray(q.actions) ? q.actions.join(', ') : q.actions}
                  onChange={e => {
                    const updated = [...questions];
                    updated[index].actions = e.target.value.split(',').map(a => a.trim());
                    setQuestions(updated);
                  }}
                  placeholder="Enter actions, separated by commas"
                  style={{ width: '100%', marginTop: 4, marginBottom: 8 }}
                  disabled={q.score === 'N/A'}
                />
              </label>
            </div>

            {/* Editable Reference Document */}
            <div>
              <label>
                Reference Document:
                <input
                  type="text"
                  value={q.refDoc}
                  onChange={e => {
                    const updated = [...questions];
                    updated[index].refDoc = e.target.value;
                    setQuestions(updated);
                  }}
                  placeholder="Reference document"
                  style={{ width: '100%', marginTop: 4, marginBottom: 8 }}
                  disabled={q.score === 'N/A'}
                />
              </label>
            </div>

            {/* Editable Deliverable */}
            <div>
              <label>
                Deliverable:
                <input
                  type="text"
                  value={q.deliverable}
                  onChange={e => {
                    const updated = [...questions];
                    updated[index].deliverable = e.target.value;
                    setQuestions(updated);
                  }}
                  placeholder="Deliverable"
                  style={{ width: '100%', marginTop: 4, marginBottom: 8 }}
                  disabled={q.score === 'N/A'}
                />
              </label>
            </div>

            <div>
              <strong>Score:</strong>
              <label>
                <input
                  type="radio"
                  name={q.id}
                  checked={q.score === 0}
                  onChange={() => handleScoreChange(index, 0)}
                /> 0
              </label>
              <label>
                <input
                  type="radio"
                  name={q.id}
                  checked={q.score === 2.5}
                  onChange={() => handleScoreChange(index, 2.5)}
                /> 2.5
              </label>
              <label>
                <input
                  type="radio"
                  name={q.id}
                  checked={q.score === 5}
                  onChange={() => handleScoreChange(index, 5)}
                /> 5
              </label>
              <label>
                <input
                  type="radio"
                  name={q.id}
                  checked={q.score === 'N/A'}
                  onChange={() => handleScoreChange(index, 'N/A')}
                /> N/A
              </label>
            </div>

            <div>
              <label>
                <input
                  type="checkbox"
                  checked={q.showstopper}
                  disabled
                /> Showstopper
              </label>
            </div>

            <textarea
              value={q.comment}
              onChange={e => handleCommentChange(index, e.target.value)}
              placeholder="Comment..."
              rows="2"
              disabled={q.score === 'N/A'}
            ></textarea>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Section1;
