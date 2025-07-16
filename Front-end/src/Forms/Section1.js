import React, { useState, useEffect } from 'react';
import './Section1.css';
import { useParams } from 'react-router-dom';

const Section1 = () => {
  const { projectId, crrId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:5000/api/projects/${projectId}/crrs/${crrId}`);
        if (!res.ok) throw new Error(`Échec de la requête : ${res.status}`);
        const data = await res.json();
        console.log('Données reçues :', data); // Pour déboguer
        if (data.sections && data.sections.length > 0) {
          setQuestions(data.sections[0].questions);
        } else {
          setQuestions([]);
          console.log('Aucune section trouvée dans les données.');
        }
      } catch (err) {
        console.error('Failed to fetch CRR:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [projectId, crrId]);

  const handleCommentChange = (id, value) => {
    setQuestions(prev =>
      prev.map(q => (q._id === id ? { ...q, comments: value } : q))
    );
  };

  const handleScoreChange = (id, value) => {
    setQuestions(prev =>
      prev.map(q => (q._id === id ? { ...q, score: value } : q))
    );
  };

  const handleActionsChange = (id, value) => {
    setQuestions(prev =>
      prev.map(q =>
        q._id === id ? { ...q, actions: value.split(',').map(a => a.trim()) } : q
      )
    );
  };

  const handleRefDocChange = (id, value) => {
    setQuestions(prev =>
      prev.map(q => (q._id === id ? { ...q, referenceDocument: value } : q))
    );
  };

  const handleDeliverableChange = (id, value) => {
    setQuestions(prev =>
      prev.map(q => (q._id === id ? { ...q, deliverable: value } : q))
    );
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSaveMessage('');

      const res = await fetch(`http://localhost:5000/api/projects/${projectId}/crrs/${crrId}/section/1`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions })
      });

      if (res.ok) {
        setSaveMessage('Saved successfully ✅');
      } else {
        const errorText = await res.text();
        setSaveMessage(`Failed to save ❌: ${errorText || res.status}`);
      }
    } catch (err) {
      console.error('Failed to save:', err);
      setSaveMessage('Error occurred ❌');
    } finally {
      setIsSaving(false);
    }
  };

  const totalScore = questions.reduce((sum, q) => sum + (parseFloat(q.score) || 0), 0);
  const maxScore = questions.length * 5;

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error}</div>;

  return (
    <div className="crr-section">
      <h2>CRR Section 1: Project Fundamentals</h2>

      <div style={{ marginBottom: 10 }}>
        <button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save'}
        </button>
        {saveMessage && <span style={{ marginLeft: 10 }}>{saveMessage}</span>}
      </div>

      <p>Total Score: {totalScore} / {maxScore}</p>

      <div className="questions-section">
        {questions.map(q => (
          <div
            className={`question-card${q.score === 'N/A' || q.isNA ? ' inactive-card' : ''}`}
            key={q._id}
          >
            <h4>{`Question ${questions.findIndex(qq => qq._id === q._id) + 1}`}</h4>
            <p>{q.text}</p>

            <div>
              <label>
                Actions:
                <input
                  type="text"
                  value={Array.isArray(q.actions) ? q.actions.join(', ') : q.actions || ''}
                  onChange={e => handleActionsChange(q._id, e.target.value)}
                  placeholder="Enter actions, separated by commas"
                  style={{ width: '100%', marginTop: 4, marginBottom: 8 }}
                  disabled={q.score === 'N/A' || q.isNA}
                />
              </label>
            </div>

            <div>
              <label>
                Reference Document:
                <input
                  type="text"
                  value={q.referenceDocument || ''}
                  onChange={e => handleRefDocChange(q._id, e.target.value)}
                  placeholder="Reference document"
                  style={{ width: '100%', marginTop: 4, marginBottom: 8 }}
                  disabled={q.score === 'N/A' || q.isNA}
                />
              </label>
            </div>

            <div>
              <label>
                Deliverable:
                <input
                  type="text"
                  value={q.deliverable || ''}
                  onChange={e => handleDeliverableChange(q._id, e.target.value)}
                  placeholder="Deliverable"
                  style={{ width: '100%', marginTop: 4, marginBottom: 8 }}
                  disabled={q.score === 'N/A' || q.isNA}
                />
              </label>
            </div>

            <div>
              <strong>Score:</strong>
              {[0, 2.5, 5, 'N/A'].map(value => (
                <label key={value} style={{ marginLeft: 8 }}>
                  <input
                    type="radio"
                    name={`score-${q._id}`}
                    checked={q.score === value}
                    onChange={() => handleScoreChange(q._id, value)}
                  />{' '}
                  {value}
                </label>
              ))}
            </div>

            <div>
              <label>
                <input
                  type="checkbox"
                  checked={q.showstopper || false}
                  disabled
                />{' '}
                Showstopper
              </label>
            </div>

            <textarea
              value={q.comments || ''}
              onChange={e => handleCommentChange(q._id, e.target.value)}
              placeholder="Comment..."
              rows="2"
              disabled={q.score === 'N/A' || q.isNA}
              style={{ width: '100%', marginTop: 4 }}
            ></textarea>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Section1;