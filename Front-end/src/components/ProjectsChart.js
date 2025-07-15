import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './ProjectsChart.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ProjectsChart = ({ projects }) => {
  if (projects.length === 0) {
    return <p className="text-center fade-in">Click a project zone to display its chart.</p>;
  }

  const chartData = {
    labels: ['CRR 1', 'CRR 2', 'CRR 3', 'CRR 4'],
    datasets: [
      {
        label: 'Number of Projects',
        data: projects.reduce(
          (acc, project) => {
            acc[0] += project.completion['1'];
            acc[1] += project.completion['2'];
            acc[2] += project.completion['3'];
            acc[3] += project.completion['4'];
            return acc;
          },
          [0, 0, 0, 0]
        ),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Projects by Completion Status (CRR)',
        font: { size: 18 },
      },
    },
    animation: {
      duration: 800,
      easing: 'easeOutQuart',
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="chart-container fade-in">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default ProjectsChart;
