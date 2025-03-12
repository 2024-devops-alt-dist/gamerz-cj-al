import React, { useState } from 'react';
import RegisterForm from './register';
import '../assets/styles/global.css';
import '../assets/styles/login.css';
import logo from '../assets/pic⁫tures/logo3.png';
import logoIcon from '../assets/pic⁫tures/loco-icon.png';

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [activeTab, setActiveTab] = useState("login");

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
        setError('Tous les champs sont requis.');
        return;
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="logo-icon-container">
                <img src={logoIcon} alt="Logo icon" className="logo-icon" />
            </div>

            <div className="card px-5 py-3 shadow-lg" style={{ width: '650px' }}>
                <div className="card-body">
                    <div className="text-center mb-4">
                        <h1 className="card-title mb-1 mt-3">Bienvenue sur</h1>
                        <img className="logo-custom" src={logo} alt="Logo Gamerz"/>
                    </div>
                    
                    {/* <h3 className="card-title text-center mb-4">
                        {activeTab === "login" ? "Connexion" : "Inscription"}
                    </h3> */}

                    <div className="test-marge">
                        <ul role="tablist" className="nav nav-pills rounded nav-fill mb-3">
                            <li className="nav-item shadow-sm">
                                <a onClick={() => handleTabChange("login")} className={`nav-link ${activeTab === "login" ? "active" : ""}`} >Connexion</a>
                            </li>
                            <li className="nav-item shadow-sm">
                                <a onClick={() => handleTabChange("register")} className={`nav-link ${activeTab === "register" ? "active" : ""}`}>Inscription</a>
                            </li>
                        </ul>
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}

                    {activeTab === "login" && (
                        <form onSubmit={handleSubmit} className="content-form-login">
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email :</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="form-control"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Entrez votre email"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="password" className="form-label">Mot de passe :</label>
                                <input
                                    type="password"
                                    id="password"
                                    className="form-control"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Entrez votre mot de passe"
                                    required
                                />
                                <div className="text-end mt-1">
                                <a className="link-forgot-password" href="#">Mot de passe oublié ?</a>
                            </div>
                            </div>

                            <div className="text-center mb-3">
                                <button type="submit" className="btn btn-one py-2 px-4">Se connecter</button>
                            </div>
                        </form>
                    )}

                    {activeTab === "register" && (
                        <form onSubmit={handleSubmit}>
                            {activeTab === "register" && <RegisterForm />}
                        </form>
                    )}
                </div>
        </div>
    </div>
    );
};

export default LoginForm;
