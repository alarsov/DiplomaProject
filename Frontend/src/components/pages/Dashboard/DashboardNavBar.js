import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './DashboardNavBar.css';

function DashboardNavBar() {
    const [click, setClick] = useState(false);
    const [button, setButton] = useState(true);

    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);

    const showButton = () => {
        if (window.innerWidth <= 950) {
            setButton(false);
        } else {
            setButton(true);
        }
    };

    useEffect(() => {
        showButton();
        window.addEventListener('resize', showButton);
        return () => window.removeEventListener('resize', showButton);
    }, []);

    return (
        <div>
            <div className='navbar'>
                <div className='navbar-container'>
                    <Link to='/' className='navbar-logo' onClick={closeMobileMenu}>
                        Learning AI <i className='fab fa-typo3' />
                    </Link>
                    <div className='menu-icon' onClick={handleClick}>
                        <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
                    </div>
                    <ul className={click ? 'nav-menu active' : 'nav-menu'}>
                        <li className='nav-item'>
                            <Link to='/dashboard/upload' className='nav-links' onClick={closeMobileMenu}>
                                Upload materials
                            </Link>
                        </li>
                        <li className='nav-item'>
                            <Link to='/dashboard/quiz' className='nav-links' onClick={closeMobileMenu}>
                                Make questionnaire
                            </Link>
                        </li>
                        <li className='nav-item'>
                            <Link to='/dashboard/memory-challenge' className='nav-links' onClick={closeMobileMenu}>
                                Memory challenge
                            </Link>
                        </li>
                        <li className='nav-item'>
                            <Link to='/dashboard/flashcards' className='nav-links' onClick={closeMobileMenu}>
                                Flashcards
                            </Link>
                        </li>
                        <li className='nav-item'>
                            <Link to='/dashboard/statistics' className='nav-links' onClick={closeMobileMenu}>
                                Statistics
                            </Link>
                        </li>
                        <li>
                            <Link to='/dashboard/user-info' className='nav-links' onClick={closeMobileMenu}>
                                <i className='fas fa-user-circle' style={{ fontSize: '1.8rem', color: '#fff' }} />
                            </Link>

                        </li>
                    </ul>

                </div>
            </div>
        </div>
    );
}

export default DashboardNavBar;
