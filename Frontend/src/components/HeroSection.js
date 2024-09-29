import React from 'react';
import { Button } from './Button';
import './HeroSection.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function HeroSection({ isHomePage }) {
    return (
        <div className='hero-container'>
            {isHomePage && (
                <>
                    <Container>
                        <Row className='align-items-center'>
                            <Col md={6} className='text-center'>
                                <h1>
                                    Empowering Your Learning Journey
                                </h1>
                                <p>Welcome to LearningAI, your ultimate companion in the pursuit of knowledge!</p>
                                <div className='hero-btns'>
                                    <Button
                                        className='btns'
                                        buttonStyle='btn--outline'
                                        buttonSize='btn--large'>
                                        GET STARTED
                                    </Button>
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className='picture'>
                                    <img src='/images/ilu.png' alt='Description of the image' className='img-fluid' />
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </>
            )}
            <div className="circle1"></div>
            <div className="circle2"></div>
            <div className="circle3"></div>
            <div className="circle4"></div>
            <div className="circle5"></div>
        </div>
    );
}

export default HeroSection;
