import React, { useState, useEffect } from 'react';
import NavBar from '../DashboardNavBar';
import './Flashcards.css';  // Import the updated CSS file
import { createApiEndpoint } from '../../../../api/index';
import { GoogleAPIHandler } from '../../../../api/GoogleGeminiAPI';
import useAuth from '../../../../hooks/useAuth';

function Flashcards() {
    useAuth();
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [materials, setMaterials] = useState([]);
    const [flashcardsData, setFlashcardsData] = useState([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [animateIn, setAnimateIn] = useState(false);
    const [animateOut, setAnimateOut] = useState(false);

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

    const handleSelectMaterial = async (material) => {
        setSelectedMaterial(material);

        try {
            const googleAPIHandler = new GoogleAPIHandler();
            const response = await googleAPIHandler.flashcards(material.fileContent);
            setFlashcardsData(response || []);
            setCurrentCardIndex(0);
            setAnimateIn(true);
        } catch (error) {
            console.error('Error generating flashcards:', error);
            setFlashcardsData([]);
        }
    };

    const handleCardClick = () => {
        setAnimateOut(true);
        setTimeout(() => {
            setAnimateOut(false);
            setCurrentCardIndex((prevIndex) =>
                prevIndex < flashcardsData.length - 1 ? prevIndex + 1 : 0
            );
            setAnimateIn(true);
        }, 800);
    };

    // Randomize wavy design for each card
    const randomizeShape = () => {
        return {
            '--rotation': `${Math.random() * 10 - 5}deg`,
            '--top-before': `${Math.random() * -40 - 10}px`,
            '--left-before': `${Math.random() * -40 - 10}px`,
            '--bottom-after': `${Math.random() * -40 - 10}px`,
            '--right-after': `${Math.random() * -40 - 10}px`,
        };
    };

    return (
        <div>
            <NavBar />
            <div className="container-fluid">
                <div className="row">
                    {/* Sidebar Section */}
                    <aside className="col-md-3 col-lg-2 sidebar">
                        <h2>Materials</h2>
                        <ul className="materials-list list-group">
                            {materials.map((material, index) => (
                                <li
                                    key={index}
                                    className={`list-group-item ${material === selectedMaterial ? 'selected' : ''}`}
                                    onClick={() => handleSelectMaterial(material)}
                                >
                                    {material.fileName}
                                </li>
                            ))}
                        </ul>
                    </aside>

                    {/* Flashcards Section */}
                    <main className="col-md-9 col-lg-10 main-content">
                        <header className="header">
                            <h1>Flashcards</h1>
                        </header>
                        <div className="flashcards-container d-flex justify-content-center align-items-center">
                            {flashcardsData.length > 0 ? (
                                <div
                                    className={`card ${animateIn ? 'animate-in' : ''} ${animateOut ? 'animate-out' : ''}`}
                                    style={randomizeShape()}
                                    onClick={handleCardClick}
                                >
                                    <p>
                                        {flashcardsData[currentCardIndex].key_point ||
                                            flashcardsData[currentCardIndex].fact ||
                                            'No data available'}
                                    </p>
                                </div>
                            ) : (
                                <div className="card">
                                    <p>No flashcards available.</p>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default Flashcards;
