import React, { useState, useEffect } from 'react';
import NavBar from '../DashboardNavBar';
import './Statistics.css';
import { createApiEndpoint } from '../../../../api/index';
import { Line, Bar, Pie } from 'react-chartjs-2';
import useAuth from '../../../../hooks/useAuth';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);

function Statistics() {
    useAuth();
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [materials, setMaterials] = useState([]);
    const [quizResults, setQuizResults] = useState([]);
    const [learnedData, setLearnedData] = useState([]);

    const getMaterials = createApiEndpoint('getMaterials');
    const getQuizResults = createApiEndpoint('getQuizResults');
    const getLearnedData = createApiEndpoint('getLearnedData');

    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const response = await getMaterials.getMaterials();
                setMaterials(response.data.value);
            } catch (error) {
                console.error('Error fetching materials:', error);
            }
        };

        fetchMaterials();
    }, []);

    useEffect(() => {
        const fetchQuizResults = async () => {
            if (!selectedMaterial) return;

            try {
                const response = await getQuizResults.getQuizResults(selectedMaterial.fileName);
                const results = response.data.value.map(result => {
                    const date = new Date(result.timestamp);
                    return {
                        ...result,
                        timestamp: isNaN(date.getTime()) ? null : date // Handle invalid dates
                    };
                });
                setQuizResults(results);
            } catch (error) {
                console.error('Error fetching quiz results:', error);
            }
        };

        const fetchLearnedData = async () => {
            if (!selectedMaterial) return;

            try {
                const response = await getLearnedData.getLearnedData(selectedMaterial.id);
                setLearnedData(response.data.value);
            } catch (error) {
                console.error('Error fetching learned data:', error);
            }
        };

        fetchQuizResults();
        fetchLearnedData();
    }, [selectedMaterial]);

    const handleSelectMaterial = (material) => {
        setSelectedMaterial(material);
    };

    const performanceData = {
        labels: quizResults.map(result => result.timestamp ? result.timestamp.toLocaleDateString() : "Unknown Date"),
        datasets: [
            {
                label: 'Quiz Performance',
                data: quizResults.map(result => result.score),
                fill: false,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
            },
        ],
    };

    const scoreVsQuestionsData = {
        labels: quizResults.map(result => `Quiz ${result.id}`),
        datasets: [
            {
                label: 'Score',
                data: quizResults.map(result => result.score),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
            },
            {
                label: 'Number of Questions',
                data: quizResults.map(result => result.numQuestions),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
        ],
    };

    const percentageLearnedVsScoreData = {
        labels: ['Percentage Learned', 'Score'],
        datasets: [
            {
                data: [
                    learnedData.reduce((acc, item) => acc + item.percentageLearned, 0) / learnedData.length,
                    quizResults.reduce((acc, item) => acc + item.score, 0) / quizResults.length
                ],
                backgroundColor: ['#FF6384', '#36A2EB'],
            },
        ],
    };

    const timeTakenVsScoreData = {
        labels: quizResults.map(result => `Quiz ${result.id}`),
        datasets: [
            {
                label: 'Time Taken (seconds)',
                data: quizResults.map(result => result.timeTaken),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
            {
                label: 'Score',
                data: quizResults.map(result => result.score),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
            },
        ],
    };

    return (
        <div>
            <NavBar />
            <div className="containerStatistics">
                {/* Sidebar */}
                <aside className="sidebar">
                    <h2>Materials</h2>
                    <ul className="materials-list">
                        {materials.map((material, index) => (
                            <li
                                key={index}
                                className={material === selectedMaterial ? 'selected' : ''}
                                onClick={() => handleSelectMaterial(material)}
                            >
                                {material.fileName} {/* Assuming each material has a 'fileName' field */}
                            </li>
                        ))}
                    </ul>
                </aside>

                {/* Main Content */}
                <main className="main-content">
                    <header className="header">
                        <h1>Statistics</h1>

                    </header>

                    {/* Graphs Section */}
                    <section className="graphs">
                        {selectedMaterial && quizResults.length > 0 && (
                            <>
                                <div className="graph-card">
                                    <h3>Quiz Performance Over Time</h3>
                                    <Line data={performanceData} />
                                </div>
                                <div className="graph-card">
                                    <h3>Score vs. Number of Questions</h3>
                                    <Bar data={scoreVsQuestionsData} />
                                </div>
                                <div className="graph-card">
                                    <h3>Percentage Learned vs. Score</h3>
                                    <Pie data={percentageLearnedVsScoreData} />
                                </div>
                                <div className="graph-card">
                                    <h3>Time Taken vs. Score</h3>
                                    <Bar data={timeTakenVsScoreData} />
                                </div>
                            </>
                        )}
                    </section>
                </main>
            </div>
        </div>
    );
}

export default Statistics;
