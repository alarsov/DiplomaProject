import React, { useState } from 'react';
import NavBar from '../DashboardNavBar';
import './UploadMaterials.css';
import { createApiEndpoint } from '../../../../api/index';
// import { query } from '../../../../api/bartAPI';
import { GoogleAPIHandler } from '../../../../api/GoogleGeminiAPI';
import useAuth from '../../../../hooks/useAuth';
import { Alert, Stack } from '@mui/material';  // MUI Alert and Stack

function UploadMaterials() {
    useAuth();
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null); // State for success/error messages
    const [error, setError] = useState(null);     // State for error messages
    const createEndpoint = createApiEndpoint('read');
    const uploadEndpoint = createApiEndpoint('upload');

    const handleFiles = (event) => {
        const files = event.target.files;
        const newFiles = Array.from(files);
        setUploadedFiles((prevFiles) => [...prevFiles, ...newFiles]);
    };

    const dropHandler = (event) => {
        event.preventDefault();
        handleFiles(event);
    };

    const dragOverHandle = (event) => {
        event.preventDefault();
    };

    const fileRemoveHandler = (fileName) => {
        setUploadedFiles((prevFiles) =>
            prevFiles.filter((file) => file.name !== fileName)
        );
    };

    const uploadAndSummarize = async () => {
        if (uploadedFiles.length === 0) {
            setMessage('Please select files to upload.');
            setError(null);
            return;
        }

        setLoading(true);
        setMessage(null);  // Clear previous messages
        setError(null);    // Clear previous errors

        const formData = new FormData();
        uploadedFiles.forEach((file) => {
            formData.append('files', file);
            formData.append('fileNames', file.name);
        });
        try {
            const googleAPIHandler = new GoogleAPIHandler();
            const response = await createEndpoint.read(formData);
            const contentArray = response.data.value;
            const result = [];
            for (const [index, value] of contentArray.entries()) {
                const summarized = await googleAPIHandler.query(value);
                result.push({
                    Summaries: JSON.stringify(summarized),
                    FileContents: JSON.stringify(value),
                    FileName: uploadedFiles[index].name
                });
            }
            await uploadEndpoint.upload(result);
            setMessage('Files uploaded and summarized successfully!');
            setError(null);
        } catch (error) {
            console.error('Error uploading files:', error);
            setError('An error occurred while uploading files.');
            setMessage(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <NavBar />
            <div className="container mt-5">
                <div className="row">
                    {/* Left Column: Uploaded Materials */}
                    <div className="col-md-6 p-0">
                        <div className="file-list-container">
                            <h2 className="uploaded-header">Uploaded Materials</h2>
                            <div className="uploaded-files">
                                {uploadedFiles.length > 0 ? (
                                    uploadedFiles.map((file, index) => (
                                        <div key={index} className="uploaded-file-item">
                                            <div className="file-info">
                                                <i className="fas fa-file-alt file-icon"></i>
                                                <span className="file-name">{file.name}</span>
                                            </div>
                                            <button
                                                onClick={() => fileRemoveHandler(file.name)}
                                                className="btn remove-button"
                                            >
                                                <i className="fas fa-trash"></i> Remove
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="no-files-text">No files uploaded yet.</p>
                                )}
                            </div>
                        </div>


                    </div>

                    {/* Right Column: Upload Files */}
                    <div className="col-md-6">
                        <div className="drop-area text-center p-4 mb-4"
                            onDrop={dropHandler}
                            onDragOver={dragOverHandle}
                        >
                            <div className="drop-area-content">
                                <p>Drag & Drop files here</p>
                                <p>or</p>
                                <input
                                    type="file"
                                    id="fileInput"
                                    multiple
                                    accept=".pdf, .docx"
                                    onChange={handleFiles}
                                    className="form-control"
                                />
                                <label
                                    htmlFor="fileInput"
                                    className={`btn btn-primary mt-3 ${loading ? 'disabled' : ''}`}
                                >
                                    {loading ? 'Uploading...' : 'Browse'}
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="row justify-content-center">
                    <div className="col-md-12 text-center">
                        <button
                            className="submit-button btn btn-success mt-4"
                            onClick={uploadAndSummarize}
                            disabled={loading}
                        >
                            Submit
                        </button>
                    </div>
                </div>

                {/* Alert Messages */}
                <Stack sx={{ width: '100%', marginTop: '20px' }} spacing={2}>
                    {message && <Alert severity="success" onClose={() => setMessage(null)}>{message}</Alert>}
                    {error && <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>}
                </Stack>
            </div>
        </div>
    );
}

export default UploadMaterials;
