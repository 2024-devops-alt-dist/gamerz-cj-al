import React from 'react';

const NotAutorisation: React.FC = () => {
    
    return (
        <>
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <div className="text-center">
                    <h1 className="dash-title">Accès non autorisé</h1>
                    <p className="dash-subTitle">Vous n'êtes pas encore autorisé à accéder à cette page. <br /> Attendez la validation de votre demande.</p>
                </div>
            </div>
        </>
    );
};

export default NotAutorisation;

