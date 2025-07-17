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
          const initializedQuestions = data.sections[0].questions.map(q => ({
            ...q,
            comments: '',
            actions: [],
            referenceDocument: '',
            deliverable: '',
            score: undefined,
            showstopper: q.showstopper || false
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

  const totalScore = questions.reduce((sum, q) => {
    const score = parseFloat(q.score);
    return sum + (!isNaN(score) ? score : 0);
  }, 0);
  const maxScore = questions.length * 5;

  if (loading || projectLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error}</div>;
  if (projectError) return <div>Erreur lors du chargement du projet : {projectError}</div>;

  return (
    <div className="crr-section">
      {project && (
        <div className="project-card">
          <h3 className="form-title">Project Information</h3>
          <div className="project-info">
            <div>
              <strong className="form-label">Responsible Office:</strong> {project['responsible office'] || 'N/A'}
            </div>
            <div>
              <strong className="form-label">Project Name:</strong> {project['name project'] || 'N/A'}
            </div>
            <div>
              <strong className="form-label">Project Number:</strong> {project['number project'] || 'N/A'}
            </div>
            <div>
              <strong className="form-label">Review Date:</strong> {project['review date']?.slice(0, 10) || 'N/A'}
            </div>
            <div>
              <strong className="form-label">Manager:</strong> {project.manager || 'N/A'}
            </div>
            <div>
              <strong className="form-label">Constructor Manager:</strong> {project['manager constructor'] || 'N/A'}
            </div>
            <div>
              <strong className="form-label">Project Scope:</strong> {project['project scope'] || 'N/A'}
            </div>
            <div>
              <strong className="form-label">Review Team:</strong>
              <ul className="list-group">
                {project['review team members']?.length > 0 ? (
                  project['review team members'].map((member, index) => (
                    <li key={index} className="list-group-item">{member}</li>
                  ))
                ) : (
                  <span>None</span>
                )}
              </ul>
            </div>
            <div>
              <strong className="form-label">Interview Team:</strong>
              <ul className="list-group">
                {project['project members interviewed']?.length > 0 ? (
                  project['project members interviewed'].map((member, index) => (
                    <li key={index} className="list-group-item">{member}</li>
                  ))
                ) : (
                  <span>None</span>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      <h2>{sectionTitle}</h2>

      <div className="questions-section">
        {questions.length > 0 ? (
          questions.map((q, index) => (
            <div
              key={q._id || index}
              className={`question-card${q.score === 'N/A' || q.isNA ? ' inactive-card' : ''}`}
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

              <div className="form-group">
                <strong>Score</strong>
                <div>
                  {[0, 2.5, 5, 'N/A'].map(value => (
                    <label key={value} style={{ marginLeft: 8 }}>
                      <input
                        type="radio"
                        name={`score-${q._id || index}`}
                        checked={q.score === value}
                        onChange={() => handleScoreChange(q._id || index, value)}
                      />{' '}
                      {value}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label><strong>Showstopper</strong></label>
                <input
                  type="checkbox"
                  checked={q.showstopper || false}
                  disabled
                />
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
        <p>Total Score: {totalScore} / {maxScore}</p>
        <button onClick={handleSave} disabled={isSaving} className="btn-primary">
          {isSaving ? 'Saving...' : 'Save'}
        </button>
        {saveMessage && <span>{saveMessage}</span>}
      </div>
    </div>
  );
};

export default Section1;