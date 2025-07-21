import React, { useState, useEffect } from 'react';
import './Section1.css';
import { useParams } from 'react-router-dom';

const Section1 = () => {
  const { projectId, crrId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [project, setProject] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [projectLoading, setProjectLoading] = useState(true);
  const [projectError, setProjectError] = useState(null);
  const [sectionTitle, setSectionTitle] = useState('Section 1: Project Fundamentals');

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:5000/api/projects/${projectId}/crrs/${crrId}`);
        if (!res.ok) throw new Error(`Échec de la requête : ${res.status}`);
        const data = await res.json();

        if (data.sections && data.sections.length > 0) {
          setSectionTitle(data.sections[0].title || 'Section 1: Project Fundamentals');

          const randomShowstoppers = new Set();
          while (randomShowstoppers.size < 5 && randomShowstoppers.size < data.sections[0].questions.length) {
            randomShowstoppers.add(Math.floor(Math.random() * data.sections[0].questions.length));
          }

          const initializedQuestions = data.sections[0].questions.map((q, i) => ({
            ...q,
            comments: '',
            actions: [],
            referenceDocument: '',
            deliverable: '',
            score: undefined,
            showstopper: randomShowstoppers.has(i)
          }));
          setQuestions(initializedQuestions);
        } else {
          setQuestions([]);
        }
      } catch (err) {
        console.error('Failed to fetch CRR:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchProject = async () => {
      setProjectLoading(true);
      setProjectError(null);
      try {
        const res = await fetch(`http://localhost:5000/api/projects/${projectId}`);
        if (!res.ok) throw new Error(`Failed to fetch project: ${res.status}`);
        const data = await res.json();
        setProject(data);
      } catch (err) {
        console.error('Failed to fetch project:', err);
        setProjectError(err.message);
      } finally {
        setProjectLoading(false);
      }
    };

    fetchQuestions();
    fetchProject();
  }, [projectId, crrId]);

  const handleCommentChange = (id, value) => {
    setQuestions(prev => prev.map(q => (q._id === id ? { ...q, comments: value } : q)));
  };

  const handleScoreChange = (id, value) => {
    setQuestions(prev => prev.map(q => (q._id === id ? { ...q, score: value } : q)));
  };

  const handleActionsChange = (id, value) => {
    setQuestions(prev =>
      prev.map(q => (q._id === id ? { ...q, actions: value.split(',').map(a => a.trim()) } : q))
    );
  };

  const handleRefDocChange = (id, value) => {
    setQuestions(prev => prev.map(q => (q._id === id ? { ...q, referenceDocument: value } : q)));
  };

  const handleDeliverableChange = (id, value) => {
    setQuestions(prev => prev.map(q => (q._id === id ? { ...q, deliverable: value } : q)));
  };

const handleSave = async () => {
  try {
    if (questions.length === 0) {
      setSaveMessage('No questions to save ❌');
      return;
    }

    setIsSaving(true);
    setSaveMessage('');

    console.log('projectId:', projectId, 'crrId:', crrId);
    console.log('Payload:', JSON.stringify({ questions }, null, 2));

    const sanitizedQuestions = questions.map(q => ({
      _id: q._id, // Include _id as sent by frontend
      text: q.text || '', // Ensure text is present
      actions: q.actions.join(',') || '', // Convert array to string
      referenceDocument: q.referenceDocument || '',
      deliverable: q.deliverable || '',
      score: q.score === 'N/A' ? null : [0, 2.5, 5].includes(parseFloat(q.score)) ? parseFloat(q.score) : null, // Match enum
      isNA: q.isNA || false,
      showstopper: q.showstopper || false,
      comments: q.comments || '',
    }));

    const res = await fetch(`http://localhost:5000/api/projects/${projectId}/crrs/${crrId}/section/1`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questions: sanitizedQuestions }),
    });

    if (res.ok) {
      setSaveMessage('Saved successfully ✅');
    } else {
      const errorData = await res.json();
      console.error('Error response:', errorData);
      setSaveMessage(`Failed to save ❌: ${errorData.message || res.statusText || res.status}`);
    }
  } catch (err) {
    console.error('Failed to save:', err);
    setSaveMessage(`Error occurred ❌: ${err.message}`);
  } finally {
    setIsSaving(false);
  }
};

  const totalScore = questions.reduce((sum, q) => {
    const score = parseFloat(q.score);
    return sum + (!isNaN(score) ? score : 0);
  }, 0);

  const maxScore = questions.length * 5;

  const getScoreColor = (score, max) => {
    const percentage = score / max;
    // Interpolate from green (0, 255, 0) to red (230, 57, 70)
    const r = Math.round(percentage * 230);
    const g = Math.round((1 - percentage) * 255);
    const b = Math.round(percentage * 70);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const questionsAnswered = questions.filter(q => q.score !== undefined && q.score !== 'N/A').length;
  const showstopperCount = questions.filter(q => q.showstopper).length;

  if (loading || projectLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error}</div>;
  if (projectError) return <div>Erreur lors du chargement du projet : {projectError}</div>;

  return (
    <div className="crr-section">
      {project && (
        <div className="project-card">
          <h3 className="form-title">Project Information</h3>
          <div className="project-info-table">
            <div className="info-row">
              <div className="info-cell"><strong>Responsible Office:</strong><br />{project['responsible office'] || 'N/A'}</div>
              <div className="info-cell"><strong>Project Name:</strong><br />{project['name project'] || 'N/A'}</div>
            </div>
            <div className="info-row">
              <div className="info-cell"><strong>Project Number:</strong><br />{project['number project'] || 'N/A'}</div>
              <div className="info-cell"><strong>Review Date:</strong><br />{project['review date']?.slice(0, 10) || 'N/A'}</div>
            </div>
            <div className="info-row">
              <div className="info-cell"><strong>Manager:</strong><br />{project.manager || 'N/A'}</div>
              <div className="info-cell"><strong>Constructor Manager:</strong><br />{project['manager constructor'] || 'N/A'}</div>
            </div>
            <div className="info-row full-width">
              <div className="info-cell"><strong>Project Scope:</strong><br />{project['project scope'] || 'N/A'}</div>
            </div>
            <div className="info-row full-width">
              <div className="info-cell">
                <strong>Review Team:</strong>
                {project['review team members']?.length > 0 ? (
                  <ul className="styled-list">
                    {project['review team members'].map((member, i) => (
                      <li key={i}>{member}</li>
                    ))}
                  </ul>
                ) : <p>None</p>}
              </div>
            </div>
            <div className="info-row full-width">
              <div className="info-cell">
                <strong>Interview Team:</strong>
                {project['project members interviewed']?.length > 0 ? (
                  <ul className="styled-list">
                    {project['project members interviewed'].map((member, i) => (
                      <li key={i}>{member}</li>
                    ))}
                  </ul>
                ) : <p>None</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="summary-section">
        <div className="summary-item">
          <strong>Questions Answered:</strong> {questionsAnswered} / {questions.length}
        </div>
        <div className="summary-item">
          <strong>Showstoppers:</strong> {showstopperCount}
        </div>
        <div className="summary-item">
          <button
            className="score-button"
            style={{ backgroundColor: getScoreColor(totalScore, maxScore) }}
          >
            Score: {totalScore.toFixed(1)}
          </button>
        </div>
      </div>

      <h2>{sectionTitle}</h2>

      <div className="questions-section">
        {questions.length > 0 ? (
          questions.map((q, index) => (
            <div
              key={q._id || index}
              className={`question-card
                ${q.score === 'N/A' || q.isNA ? 'inactive-card' : ''}
                ${(parseFloat(q.score) > 0 && q.showstopper) ? 'danger-card' : ''}`}
            >
              <h4>{`Question ${index + 1}: ${q.text || 'Texte de la question non disponible'}`}</h4>

              <div className="form-group">
                <label><strong>Actions</strong></label>
                <input
                  type="text"
                  value={Array.isArray(q.actions) ? q.actions.join(', ') : q.actions || ''}
                  onChange={e => handleActionsChange(q._id || index, e.target.value)}
                  placeholder="Entrez les actions, séparées par des virgules"
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label><strong>Document de Référence</strong></label>
                <input
                  type="text"
                  value={q.referenceDocument || ''}
                  onChange={e => handleRefDocChange(q._id || index, e.target.value)}
                  placeholder="Entrez le document de référence"
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label><strong>Délivrable</strong></label>
                <input
                  type="text"
                  value={q.deliverable || ''}
                  onChange={e => handleDeliverableChange(q._id || index, e.target.value)}
                  placeholder="Entrez le livrable"
                  className="form-control"
                />
              </div>

              <div className="form-group score-showstopper-group">
                <div className="score-group">
                  <strong>Score</strong>
                  <div className="score-options">
                    {[0, 2.5, 5, 'N/A'].map(value => (
                      <label key={value} className="score-label">
                        <span>{value}</span>
                        <input
                          type="radio"
                          name={`score-${q._id || index}`}
                          checked={q.score === value}
                          onChange={() => handleScoreChange(q._id || index, value)}
                        />
                      </label>
                    ))}
                  </div>
                </div>
                <div className="showstopper-group">
                  <label><strong>Showstopper</strong></label>
                  <input type="checkbox" checked={q.showstopper || false} disabled />
                </div>
              </div>

              <div className="form-group">
                <label><strong>Commentaires</strong></label>
                <textarea
                  value={q.comments || ''}
                  onChange={e => handleCommentChange(q._id || index, e.target.value)}
                  placeholder="Entrez vos commentaires..."
                  rows="2"
                  className="form-control"
                ></textarea>
              </div>
            </div>
          ))
        ) : (
          <p>Aucune question disponible pour cette section.</p>
        )}
      </div>

      <div className="bottom-save-bar">
        <button onClick={handleSave} disabled={isSaving} className="btn-primary">
          {isSaving ? 'Saving...' : 'Save'}
        </button>
        {saveMessage && <span>{saveMessage}</span>}
      </div>
    </div>
  );
};

export default Section1;