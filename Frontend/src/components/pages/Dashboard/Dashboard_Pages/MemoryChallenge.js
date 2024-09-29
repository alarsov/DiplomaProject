import React, { useEffect, useState } from 'react';
import NavBar from '../DashboardNavBar';
import { useNavigate } from 'react-router-dom';
import './MemoryChallenge.css';
import { createApiEndpoint } from '../../../../api/index';
import useSpeechRecognition from '../../../../hooks/useSpeechRecognition';
// import { report } from '../../../../api/reportGenerating';
import { GoogleAPIHandler } from '../../../../api/GoogleGeminiAPI';
import useAuth from '../../../../hooks/useAuth';
import { Form } from 'react-bootstrap';

function MemoryChallenge() {
    const { isAuthenticated, isLoading } = useAuth();
    const [materials, setMaterials] = useState([]);
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [time, setTime] = useState(600);
    const [showChallenge, setShowChallenge] = useState(false);
    const [summarizedContent, setSummarizedContent] = useState("Your summarized content will be shown here...");
    const [timeLeft, setTimeLeft] = useState(time);
    const [userInput, setUserInput] = useState("");
    const [showFeedback, setShowFeedback] = useState(false);
    const [showInputBox, setShowInputBox] = useState(false);
    const [showSummarizedContent, setShowSummarizedContent] = useState(true);
    const [showTimer, setShowTimer] = useState(true);
    const [reportData, setReportData] = useState(null);

    const getMaterials = createApiEndpoint('getMaterials');
    const saveReport = createApiEndpoint('saveReport');
    const { transcript, listening, startListening, stopListening } = useSpeechRecognition();

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
        setTimeLeft(time);
    }, [time]);

    useEffect(() => {
        setUserInput(transcript);
    }, [transcript]);

    const handleMaterialChange = (e, material) => {
        if (e.target.checked) {
            setSelectedMaterial(material);
        } else {
            setSelectedMaterial(null);
        }
    };

    const handleTimeChange = (e) => {
        const newTime = parseInt(e.target.value, 10);
        setTime(newTime);
        setTimeLeft(newTime);
    };

    const handleStart = () => {
        setShowChallenge(true);
        // Fetch summarized content based on the selected material
        const content = JSON.parse(selectedMaterial.summarizedContent);
        setSummarizedContent(content);

        // Start the timer
        const timer = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    setShowInputBox(true);
                    setShowSummarizedContent(false); // Hide summarized content
                    setShowTimer(false); // Hide timer
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);
    };

    useEffect(() => {
        if (!showChallenge) return;

        const countToDate = new Date().setSeconds(new Date().getSeconds() + timeLeft);

        const updateClock = () => {
            const currentDate = new Date();
            const timeBetweenDates = Math.ceil((countToDate - currentDate) / 1000);
            const minutes = Math.floor(timeBetweenDates / 60);
            const seconds = timeBetweenDates % 60;

            const minutesElement = document.querySelector("[data-minutes]");
            const secondsElement = document.querySelector("[data-seconds]");

            if (minutesElement) minutesElement.innerText = String(minutes).padStart(2, "0");
            if (secondsElement) secondsElement.innerText = String(seconds).padStart(2, "0");
        };

        const timerInterval = setInterval(updateClock, 250);

        return () => clearInterval(timerInterval);
    }, [timeLeft, showChallenge]);

    const handleSubmit = async () => {
        setShowFeedback(true);
        const googleAPIHandler = new GoogleAPIHandler();
        const reportResult = await googleAPIHandler.report({ inputs: summarizedContent, userInput });
        const reportJSON = reportResult[0];

        // Extract the necessary fields from reportData
        const percentageLearned = reportJSON.percentage_learned;
        const reportData = {
            fileId: selectedMaterial.id,
            fileName: selectedMaterial.fileName,
            percentageLearned
        }
        setReportData(reportJSON);
        try {
            await saveReport.saveReport(reportData);
        } catch (error) {
            console.error('Error saving report results:', error);
        }

    };


    return (
        <div>
            <NavBar />
            <div className="container-challenge">
                {!showChallenge ? (
                    <div className="settings-materials-container">
                        <div className="settings-materials">
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
                                    <label htmlFor="quiz-time">Time for the quiz (minutes):</label>
                                    <select id="quiz-time" value={time} onChange={handleTimeChange}>
                                        <option value="30">0.5 minutes</option>
                                        <option value="600">10 minutes</option>
                                        <option value="1200">20 minutes</option>
                                        <option value="1800">30 minutes</option>
                                        <option value="2400">40 minutes</option>
                                    </select>
                                </div>
                                <img src='/images/student-learning.png' className='challenge-image' id='rightImage' />
                            </div>
                        </div>
                        <button onClick={handleStart} className="start-button">Start Challenge</button>
                    </div>
                ) : !showFeedback ? (
                    <div className="container-challenge">
                        <header className="challenge-header">
                            <h1>Memory Challenge</h1>
                            {showTimer && (
                                <div className="timer">
                                    <div className="flip-clock">
                                        <div className="flip-card">
                                            <h1>MINUTES</h1>
                                            <div className="card" data-minutes>00</div>
                                        </div>
                                        <div className="flip-card">
                                            <h1>SECONDS</h1>
                                            <div className="card" data-seconds>00</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </header>
                        <main>
                            <div className="content-box">
                                {showSummarizedContent && (
                                    <div className="summarized-content">
                                        <p>{summarizedContent}</p>
                                    </div>
                                )}
                                {showInputBox && (
                                    <div className="input-section">
                                        <textarea
                                            id="user-input"
                                            value={userInput}
                                            onChange={(e) => setUserInput(e.target.value)}
                                            placeholder="Enter what you memorized..."
                                        ></textarea>

                                        {/* Action row for the microphone and submit buttons */}
                                        <div className="input-actions">
                                            <button
                                                id="microphone-button"
                                                className="microphone-button"
                                                onClick={listening ? stopListening : startListening}
                                            >
                                                <i className={`fas ${listening ? 'fa-microphone-slash' : 'fa-microphone'}`}></i>
                                            </button>

                                            <button
                                                id="start-button"
                                                className="start-button"
                                                onClick={handleSubmit}
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </main>
                    </div>
                ) : (
                    <div className="feedback-section">
                        <img src="/images/trophy.png" alt="Trophy" className="trophy-image" />
                        <h2>Congratulations!</h2>
                        {reportData && (
                            <>
                                <p>You scored <strong>{reportData.percentage_learned}%</strong> of the summarized content correctly.</p>
                                <div className="card-container">
                                    <div className="card">
                                        <div className="illustration">
                                            <lottie-player src="https://assets10.lottiefiles.com/packages/lf20_LrcfNr.json" background="white" speed="1" loop autoplay></lottie-player>
                                        </div>
                                        <h3>Analysis</h3>
                                        <p>{reportData.analysis}</p>
                                    </div>
                                    <div className="card">
                                        <div className="illustration">
                                            <lottie-player src="https://assets10.lottiefiles.com/packages/lf20_LrcfNr.json" background="white" speed="1" loop autoplay></lottie-player>
                                        </div>
                                        <h3>Areas for Improvement</h3>
                                        {reportData.areas_for_improvement.length > 0 ? (
                                            <ul>
                                                {reportData.areas_for_improvement.map((area, index) => (
                                                    <p key={index}>{area}</p>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p>No areas for improvement noted.</p>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                        <button className="start-button" onClick={() => window.location.reload()}>Return Back</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MemoryChallenge;
