import React from 'react'
import NavBar from './DashboardNavBar';
import './Dashboard.css';
import useAuth from '../../../hooks/useAuth';

function Dashboard() {
    useAuth();

    return (
        <div>
            <NavBar />
            <div className='dashboard-container'>
                <div className='dashboard-heading'>
                    <h2>How it works?</h2>
                </div>
                <div className="dashboard-items">
                    <div className="dashboard-item">
                        <h3>Upload</h3>
                        <p>Start by uploading your study materials, documents, or text that you want to work with.</p>
                    </div>


                    <div className="dashboard-item">
                        <h3>Summarize</h3>
                        <p>Once uploaded, use our summarization tool to condense the content into key points and essential information.</p>
                    </div>


                    <div className="dashboard-item">
                        <h3>Create questionnaire</h3>
                        <p>If desired, generate a custom questionnaire based on the summarized material to test your understanding.</p>
                    </div>


                    <div className="dashboard-item">
                        <h3>Check your learning</h3>
                        <p> Finally, assess your learning by taking quizzes or tests based on the summarized content.</p>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Dashboard
