import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const sectionColors = [
  '#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f', '#edc949', '#af7aa1', '#ff9da7'
];

const Analytics = () => {
  const { projectId, crrId } = useParams();
  const navigate = useNavigate(); // Add this line
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCRR = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/projects/${projectId}/crrs/${crrId}`);
        if (!res.ok) throw new Error('Failed to fetch CRR');
        const data = await res.json();
        if (data.sections) {
          setSections(data.sections);
        } else if (data.crrs && data.crrs[0] && data.crrs[0].sections) {
          setSections(data.crrs[0].sections);
        } else {
          setSections([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCRR();
  }, [projectId, crrId]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div style={{ color: 'red' }}>Erreur : {error}</div>;

  // Prepare data for charts
  const sectionLabels = sections.map((section, idx) => section.title || `Section ${idx + 1}`);
  const scores = sections.map(section => {
    const questions = section.questions || [];
    return questions.reduce(
      (sum, q) => sum + (!q.isNA && !isNaN(Number(q.score)) ? Number(q.score) : 0),
      0
    );
  });
  const maxScores = sections.map(section =>
    (section.questions || []).filter(q => !q.isNA).length * 5
  );
  const scorePercents = scores.map((score, idx) =>
    maxScores[idx] > 0 ? ((score / maxScores[idx]) * 100).toFixed(1) : 0
  );
  const showstopperCounts = sections.map(section =>
    (section.questions || []).filter(q => q.showstopper).length
  );
  const questionCounts = sections.map(section => (section.questions || []).length);
  const showstopperPercents = showstopperCounts.map((count, idx) =>
    questionCounts[idx] > 0 ? ((count / questionCounts[idx]) * 100).toFixed(1) : 0
  );

  // Bar chart for section scores
  const barData = {
    labels: sectionLabels,
    datasets: [
      {
        label: 'Score (%)',
        data: scorePercents,
        backgroundColor: sectionColors,
      },
    ],
  };

  // Doughnut chart for showstopper percentage per section
  const doughnutData = {
    labels: sectionLabels,
    datasets: [
      {
        label: '% Showstoppers',
        data: showstopperPercents,
        backgroundColor: sectionColors,
      },
    ],
  };

  return (
    <div style={{
      maxWidth: 1100,
      margin: '0 auto',
      padding: 32,
      fontFamily: 'Segoe UI, Arial, sans-serif',
      background: '#f8f9fa',
      borderRadius: 16,
      boxShadow: '0 2px 12px rgba(0,0,0,0.07)'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: 32, color: '#2d3e50' }}>Résumé des Sections</h2>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 40,
        justifyContent: 'center',
        marginBottom: 40
      }}>
        <div style={{ flex: 1, minWidth: 350, background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
          <h3 style={{ textAlign: 'center', color: '#4e79a7' }}>Score par Section (%)</h3>
          <Bar data={barData} options={{
            responsive: true,
            plugins: {
              legend: { display: false },
              tooltip: { callbacks: { label: ctx => `${ctx.parsed.y} %` } }
            },
            scales: {
              y: { min: 0, max: 100, ticks: { stepSize: 20 } }
            }
          }} />
        </div>
        <div style={{ flex: 1, minWidth: 350, background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
          <h3 style={{ textAlign: 'center', color: '#e15759' }}>% Showstoppers par Section</h3>
          <Doughnut data={doughnutData} options={{
            plugins: {
              legend: { position: 'bottom' },
              tooltip: { callbacks: { label: ctx => `${ctx.label}: ${ctx.parsed} %` } }
            }
          }} />
        </div>
      </div>

      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        background: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: '0 1px 6px rgba(0,0,0,0.06)'
      }}>
        <thead>
          <tr style={{ background: '#e9ecef' }}>
            <th style={{ padding: 12, border: '1px solid #dee2e6' }}>Section</th>
            <th style={{ padding: 12, border: '1px solid #dee2e6' }}>Score Total</th>
            <th style={{ padding: 12, border: '1px solid #dee2e6' }}>% Score</th>
            <th style={{ padding: 12, border: '1px solid #dee2e6' }}>Showstoppers</th>
            <th style={{ padding: 12, border: '1px solid #dee2e6' }}>% Showstoppers</th>
          </tr>
        </thead>
        <tbody>
          {sections.map((section, idx) => (
            <tr key={idx} style={{ background: idx % 2 === 0 ? '#f8f9fa' : '#fff' }}>
              <td style={{ padding: 10, border: '1px solid #dee2e6' }}>{section.title || `Section ${idx + 1}`}</td>
              <td style={{ padding: 10, border: '1px solid #dee2e6' }}>
                {scores[idx]} / {maxScores[idx]}
              </td>
              <td style={{ padding: 10, border: '1px solid #dee2e6' }}>
                {scorePercents[idx]} %
              </td>
              <td style={{ padding: 10, border: '1px solid #dee2e6' }}>
                {showstopperCounts[idx]} / {questionCounts[idx]}
              </td>
              <td style={{ padding: 10, border: '1px solid #dee2e6' }}>
                {showstopperPercents[idx]} %
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
        <button
          onClick={() => navigate('/home')}
          style={{
            padding: '12px 32px',
            background: '#4e79a7',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontSize: 18,
            cursor: 'pointer',
            fontWeight: 600,
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
          }}
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default Analytics;