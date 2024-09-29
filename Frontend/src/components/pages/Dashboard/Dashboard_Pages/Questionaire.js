import React, { useEffect, useState } from 'react';
import NavBar from '../DashboardNavBar';
import { useNavigate } from 'react-router-dom'
import './Questionaire.css';
import { createApiEndpoint } from '../../../../api/index';
// import { questionGenerating } from '../../../../api/questionGenerating';
import { GoogleAPIHandler } from '../../../../api/GoogleGeminiAPI';
import useAuth from '../../../../hooks/useAuth';
import { Form } from 'react-bootstrap';

function Questionaire() {
    useAuth();
    const [materials, setMaterials] = useState([]);
    const [selectedMaterials, setSelectedMaterials] = useState([]);
    const [numQuestions, setNumQuestions] = useState(5);
    const [time, setTime] = useState(10);
    let navigate = useNavigate();

    const getMaterials = createApiEndpoint('getMaterials');

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

    const handleMaterialChange = (e, material) => {
        if (e.target.checked) {
            setSelectedMaterials((prevMaterials) => [...prevMaterials, material]);
        } else {
            setSelectedMaterials((prevMaterials) => prevMaterials.filter(m => m !== material));
        }
    };

    const handleNumQuestionsChange = (e) => {
        setNumQuestions(e.target.value);
    };
    const handleTimeChange = (e) => {
        setTime(e.target.value);
    };

    const handleStartQuiz = async () => {
        const googleAPIHandler = new GoogleAPIHandler();
        const questionData = selectedMaterials.map(material => material.fileContent).join(" ");
        const questions = await googleAPIHandler.questionGenerating({ inputs: questionData, numQuestions });
        console.log('Generated Questions:', questions);
        navigate('/dashboard/quiz/start', { state: { questions, numQuestions, time, selectedMaterials } });
    };



    return (
        <div>
            <NavBar />
            <div id="container-quiz">
                <img src='/images/book1.png' className='side-image' id='leftImage' />
                <div id="text-container">
                    <h1>Test your knowledge</h1>
                    <p>Choose your materials, create your quiz, and challenge yourself!</p>
                    <button id="start-quiz-button" onClick={handleStartQuiz}>START QUIZ</button>
                </div>
                <img src='/images/book2.png' className='side-image' id='rightImage' />
            </div>
            <div id="content-container">
                <div id="materials-container">
                    <h2>Materials</h2>
                    <ul>
                        {materials.map((material, index) => (
                            <li key={index}>
                                <div className="switch-wrapper">
                                    <Form.Check
                                        type="switch"
                                        id={`material-switch-${index}`}
                                        label={material.fileName}
                                        onChange={(e) => handleMaterialChange(e, material)}
                                        className="green-switch" // Add custom class for styling
                                    />
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div id="settings-container">
                    <h2>Settings</h2>
                    <div className="setting-item">
                        <label htmlFor="num-questions">Number of questions:</label>
                        <select id="num-questions" value={numQuestions} onChange={handleNumQuestionsChange}>
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                        </select>
                    </div>
                    <div className="setting-item">
                        <label htmlFor="quiz-time">Time for the quiz (minutes):</label>
                        <select id="quiz-time" value={time} onChange={handleTimeChange}>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="30">30</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Questionaire;