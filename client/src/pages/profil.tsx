import React from 'react';
import '../assets/styles/global.css';
import '../assets/styles/profil.css';
import profilIcon from '../assets/pic⁫tures/avatar1.png'

const Profil: React.FC = () => {
    
    return (
        <>
        <div className="container p-4" style={{ border: '2px solid red' }}>
            <div className="d-flex align-items-center">
                <div className="me-4">
                    <img src={profilIcon} alt="Profile" className="img-fluid rounded-circle" style={{ width: '180px', height: '180px' }} />
                </div>

                <div className="info-content">
                    <h2>Oha - Test brut</h2>
                    <p>Email: test.brut@mail.com</p>
                    <p>Password: ***********  modifier</p>
                </div>
            </div>
        </div>
            
        </>
        
    );
};

export default Profil;