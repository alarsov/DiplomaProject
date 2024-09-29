import React from 'react';
import '../../App.css'
import HeroSection from '../HeroSection'
import NavBar from '../NavBar';

function Home() {
    return (
        <>
            <NavBar />
            <HeroSection isHomePage={true} />
        </>
    )
}
export default Home;