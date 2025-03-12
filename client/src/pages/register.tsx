import React, { useState } from "react";
import '../assets/styles/global.css';

const RegisterForm: React.FC = () => {
    const [pseudo, setPseudo] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [motivationText, setMotivationText] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas !");
            return;
        }

        // Traitement de l'inscription ici
        console.log({ pseudo, email, password, motivationText });
        
        // Réinitialiser les champs après l'inscription réussie
        setPseudo("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setMotivationText("");
        setError("");
    };

    return (
        <>
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="mb-3 row">
                    <div className="col-sm-6">
                        <label htmlFor="pseudo" className="form-label">Pseudo :</label>
                        <input
                            type="text"
                            id="pseudo"
                            className="form-control"
                            value={pseudo}
                            onChange={(e) => setPseudo(e.target.value)}
                            placeholder="Entrez votre pseudo"
                            required
                        />
                    </div>
                    <div className="col-sm-6">
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
                </div>

                <div className="mb-3 row">
                    <div className="col-sm-6">
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
                    </div>
                    <div className="col-sm-6">
                        <label htmlFor="confirmPassword" className="form-label">Confirmation fdp :</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            className="form-control"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirmez votre mot de passe"
                            required
                        />
                    </div>
                </div>

                <div className="mb-3">
                    <label htmlFor="motivationText" className="form-label">Texte de motivation :</label>
                    <textarea
                        id="motivationText"
                        className="form-control"
                        value={motivationText}
                        onChange={(e) => setMotivationText(e.target.value)}
                        placeholder="Pourquoi souhaitez-vous rejoindre ?"
                    />
                </div>

                <div className="text-center">
                    <button type="submit" className="btn btn-one py-2 px-4">S'inscrire</button>
                </div>
            </form>
        </>
    );
};

export default RegisterForm;
