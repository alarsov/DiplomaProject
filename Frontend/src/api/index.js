import axios from "axios";

const userControllerUrl = 'https://localhost:7160/User/';
const fileControllerUrl = 'https://localhost:7160/File/';
const assesmentControllerUrl = 'https://localhost:7160/Assesment/';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
};
axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const createApiEndpoint = endpoint => {
    let userUrl = userControllerUrl + endpoint + '/';
    let fileUrl = fileControllerUrl + endpoint + '/';
    let assesmentUrl = assesmentControllerUrl + endpoint + '/';

    return {
        register: newUser => axios.post(userUrl, newUser),
        login: newLogin => axios.post(userUrl, newLogin),
        confirmEmail: id => axios.post(userUrl + id),
        sendResetEmail: email => axios.post(userUrl + email),
        read: FormData => axios.post(fileUrl, FormData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                ...getAuthHeader()
            }
        }),
        upload: (params) => axios.post(fileUrl, params, {
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            }
        }),
        getMaterials: () => axios.get(fileUrl, {
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            }
        }),
        saveQuizData: (params) => axios.post(assesmentUrl, params, {
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            }
        }),
        saveReport: (params) => axios.post(assesmentUrl, params, {
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            }
        }),
        getQuizResults: (fileName) => axios.get(`${assesmentUrl}${fileName}`, {
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            }
        }),
        getLearnedData: (id) => axios.get(`${assesmentUrl}${id}`, {
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            }
        }),
        getUserInfo: () => axios.get(userUrl, {
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            }
        }),
        saveProfileEdit: (params) => axios.post(userUrl, params, {
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            }
        }),
        savePasswordEdit: (params) => axios.post(userUrl, params, {
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            }
        }),
        getAuth: () => axios.get(`${userControllerUrl}verifyToken`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
    }
}