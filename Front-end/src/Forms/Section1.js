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
  const [sectionTitle, setSectionTitle] = useState('Section 1: Project Fundamentals');

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:5000/api/projects/${projectId}/crrs/${crrId}`);
        if (!res.ok) throw new Error(`Échec de la requête : ${res.status}`);
        const data = await res.json();
        console.log('Données reçues :', data);
        if (data.sections && data.sections.length > 0) {
          setSectionTitle(data.sections[0].title || 'Section 1: Project Fundamentals');
          const firstSectionQuestions = data.sections[0].questions || [];
          console.log('Nombre de questions trouvées :', firstSectionQuestions.length);
          setQuestions([...firstSectionQuestions]);
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

  useEffect(() => {
    // Scroll to bottom after questions load
    window.scrollTo(0, document.body.scrollHeight);
  }, [questions]);

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

  const totalScore = questions.reduce((sum, q) => sum + (parseFloat(q.score) || 0), 0);
  const maxScore = questions.length * 5;

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error}</div>;

  return (
    <div className="crr-section" style={{ height: '100vh', overflowY: 'auto' }}>
      <h2>{sectionTitle}</h2>

      <div className="topbar">
        <div style={{ marginBottom: 10 }}>
          <button onClick={handleSave} disabled={isSaving} className="btn-primary">
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          {saveMessage && <span style={{ marginLeft: 10 }}>{saveMessage}</span>}
        </div>
      </div>

      <p>Total Score: {totalScore} / {maxScore}</p>

      <div className="questions-section">
        {questions.length > 0 ? (
          questions.map((q, index) => {
            console.log('Rendering question:', index + 1);
            return (
              <div
                className={`question-card${q.score === 'N/A' || q.isNA ? ' inactive-card' : ''}`}
                key={q._id || index}
              >
                <h4>{`Question ${index + 1}: ${q.text || 'Texte de la question non disponible'}`}</h4>

                <div className="form-group">
                  <label><strong>Actions</strong></label>
                  <input
                    type="text"
                    value={Array.isArray(q.actions) ? q.actions.join(', ') : q.actions || ''}
                    onChange={e => handleActionsChange(q._id || index, e.target.value)}
                    placeholder="Entrez les actions, séparées par des virgules"
                    style={{ width: '100%', marginTop: 4, marginBottom: 8 }}
                    disabled={q.score === 'N/A' || q.isNA}
                  />
                </div>

                <div className="form-group">
                  <label><strong>Document de Référence</strong></label>
                  <input
                    type="text"
                    value={q.referenceDocument || ''}
                    onChange={e => handleRefDocChange(q._id || index, e.target.value)}
                    placeholder="Entrez le document de référence"
                    style={{ width: '100%', marginTop: 4, marginBottom: 8 }}
                    disabled={q.score === 'N/A' || q.isNA}
                  />
                </div>

                <div className="form-group">
                  <label><strong>Délivrable</strong></label>
                  <input
                    type="text"
                    value={q.deliverable || ''}
                    onChange={e => handleDeliverableChange(q._id || index, e.target.value)}
                    placeholder="Entrez le livrable"
                    style={{ width: '100%', marginTop: 4, marginBottom: 8 }}
                    disabled={q.score === 'N/A' || q.isNA}
                  />
                </div>

                <div className="form-group">
                  <label><strong>Score</strong></label>
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
                    disabled={q.score === 'N/A' || q.isNA}
                    style={{ width: '100%', marginTop: 4 }}
                  ></textarea>
                </div>
              </div>
            );
          })
        ) : (
          <p>Aucune question disponible pour cette section.</p>
        )}
      </div>
    </div>
  );
};

export default Section1;