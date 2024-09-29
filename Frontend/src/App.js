import React from 'react';
import NavBar from './components/NavBar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/pages/Home';
import Register from './components/pages/Register';
import HeroSection from './components/HeroSection';
import Login from './components/pages/Login';
import ResetPassword from './components/pages/ResetPassword';
import EmailConfirmation from './components/pages/EmailConfirmation';
import ChangePassword from './components/pages/ChangePassword';
import EmailConfirmed from './components/pages/EmailConfirmed';
import Dashboard from './components/pages/Dashboard/Dashboard';
import Upload from './components/pages/Dashboard/Dashboard_Pages/UploadMaterials';
import Questionaire from './components/pages/Dashboard/Dashboard_Pages/Questionaire';
import Quiz from './components/pages/Dashboard/Dashboard_Pages/Quiz';
import MemoryChallenge from './components/pages/Dashboard/Dashboard_Pages/MemoryChallenge';
import Statistics from './components/pages/Dashboard/Dashboard_Pages/Statistics';
import Flashcards from './components/pages/Dashboard/Dashboard_Pages/Flashcards';
import UserInfo from './components/pages/Dashboard/Dashboard_Pages/UserInfo';
import useTokenRefresh from './hooks/useTokenRefresh';


function App() {
  useTokenRefresh();
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' exact Component={Home} />
          <Route path='/register' exact Component={Register} />
          <Route path='/login' exact Component={Login} />
          <Route path='/emailConfirmation' exact Component={EmailConfirmation} />
          <Route path="/resetPassword" exact Component={ResetPassword} />
          <Route path="/emailConfirmed/:id" exact Component={EmailConfirmed} />
          <Route path="/passwordChange/:id" exact Component={ChangePassword} />

          <Route path='/dashboard' exact Component={Dashboard} />
          <Route path='/dashboard/upload' exact Component={Upload} />
          <Route path='/dashboard/quiz' exact Component={Questionaire} />
          <Route path='/dashboard/quiz/start' exact Component={Quiz} />
          <Route path='/dashboard/memory-challenge' exact Component={MemoryChallenge} />
          <Route path='/dashboard/statistics' exact Component={Statistics} />
          <Route path='/dashboard/flashcards' exact Component={Flashcards} />
          <Route path='/dashboard/user-info' exact Component={UserInfo} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
