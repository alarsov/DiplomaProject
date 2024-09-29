import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Quiz.css';
import '../../../HeroSection.css'; // Ensure this is included to use the shared styles
import { createApiEndpoint } from '../../../../api/index';
import useAuth from '../../../../hooks/useAuth';

function Quiz() {
    useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const { questions, time, numQuestions, selectedMaterials } = location.state;

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [timeLeft, setTimeLeft] = useState(time * 60);
    const [selectedAnswers, setSelectedAnswers] = useState(Array(questions.length).fill(null));
    const [timerId, setTimerId] = useState(null);
    const saveQuizData = createApiEndpoint('saveQuizData');

    useEffect(() => {
        if (timeLeft <= 0) {
            handleSubmitQuiz();
        }

        const timer = setInterval(() => {
            setTimeLeft(prevTime => prevTime - 1);
        }, 1000);
        setTimerId(timer);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const handleAnswerOptionClick = (isCorrect, index) => {
        const updatedSelectedAnswers = [...selectedAnswers];
        updatedSelectedAnswers[currentQuestion] = index;
        setSelectedAnswers(updatedSelectedAnswers);

        if (isCorrect) {
            setScore(score + 1);
        }
    };

    const handleNextQuestion = () => {
        const nextQuestion = currentQuestion + 1;
        if (nextQuestion < questions.length) {
            setCurrentQuestion(nextQuestion);
        }
    };

    const handlePreviousQuestion = () => {
        const previousQuestion = currentQuestion - 1;
        if (previousQuestion >= 0) {
            setCurrentQuestion(previousQuestion);
        }
    };

    const handleSubmitQuiz = async () => {
        clearInterval(timerId);
        setShowScore(true);
        const timeTaken = time * 60 - timeLeft;

        const quizData = {
            selectedMaterials: selectedMaterials.map(material => material.fileName),
            score,
            numQuestions,
            timeTaken
        };

        try {
            await saveQuizData.saveQuizData(quizData);
        } catch (error) {
            console.error('Error saving quiz results:', error);
        }

    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return {
            minutes: `${minutes < 10 ? '0' : ''}${minutes}`,
            seconds: `${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
        };
    };

    const handleReturn = () => {
        navigate('/dashboard/quiz'); // Change this to the desired route
    };

    const { minutes, seconds } = formatTime(timeLeft);
    const timeTaken = formatTime(time * 60 - timeLeft);

    return (
        <div className="hero-container"> {/* Reuse the hero-container class */}
            <div className="circle1"></div>
            <div className="circle2"></div>
            <div className="circle3"></div>
            <div className="circle4"></div>
            <div className="circle5"></div>
            <div className='picture'>
                <img src='/images/quiz-removebg-preview.png' alt='Description of the image' style={{ width: '100%', height: 'auto' }} />
            </div>
            <div className="quiz-body">
                <div className="quiz-header">
                    <div className="timer">
                        <div className="flip-clock">
                            <div className="flip-card">
                                <h1>MINUTES</h1>
                                <div className="card" data-minutes>{minutes}</div>
                            </div>
                            <div className="flip-card">
                                <h1>SECONDS</h1>
                                <div className="card" data-seconds>{seconds}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="quiz-container">
                    {showScore ? (
                        <div className="score-section">
                            <img src="/images/trophy.png" alt="Trophy" className="trophy-image" />
                            <h2>Congratulations!</h2>
                            <p>You scored <strong>{score}</strong> out of <strong>{numQuestions}</strong></p>
                            <p>Time taken: <strong>{timeTaken.minutes}:{timeTaken.seconds}</strong></p>
                            <button className="return-button" onClick={handleReturn}>Return Back</button>
                        </div>
                    ) : (
                        <>
                            <div className="question-section">
                                <div className="question-count">
                                    <span>Question {currentQuestion + 1}</span>/{numQuestions}
                                </div>
                                <div className="question-text">{questions[currentQuestion].questionText}</div>
                            </div>
                            <div className="answers">
                                {questions[currentQuestion].answerOptions.map((answerOption, index) => (
                                    <button
                                        className={`answer ${selectedAnswers[currentQuestion] === index ? 'selected' : ''}`}
                                        key={index}
                                        onClick={() => handleAnswerOptionClick(answerOption.isCorrect, index)}
                                    >
                                        <div className="circle">{String.fromCharCode(65 + index)}</div>
                                        {answerOption.answerText}
                                    </button>
                                ))}
                            </div>
                            <div className="navigation-buttons">
                                <button className="prev-button" onClick={handlePreviousQuestion} disabled={currentQuestion === 0}>
                                    Previous
                                </button>
                                {currentQuestion === questions.length - 1 ? (
                                    <button className="submit-button" onClick={handleSubmitQuiz}>
                                        Submit Quiz
                                    </button>
                                ) : (
                                    <button className="next-button" onClick={handleNextQuestion}>
                                        Next
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Quiz;
