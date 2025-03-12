import React, { useState } from 'react';
import RegisterForm from './register';
import '../assets/styles/global.css';
import '../assets/styles/login.css';
import logo from '../assets/pic⁫tures/logo3.png';
import logoIcon from '../assets/pic⁫tures/loco-icon.png';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../context/AuthContext';

// Schéma validation Zod
const loginSchema = z.object({
    email: z.string().email("Format Email invalide - ex : jean.marc@gmail.com"),
    password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères")
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
    const { login } = useAuth();
    const [activeTab, setActiveTab] = useState("login");

    // React Hook Form
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
        resolver: zodResolver(loginSchema)
    });

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    const onSubmit = (data: LoginFormInputs) => {
        console.log("Données soumises :", data);
        
        login(data.email, data.password);
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

                    {activeTab === "login" && (
                        <form onSubmit={handleSubmit(onSubmit)} className="content-form-login">
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email :</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="form-control"
                                    {...register("email", { required: true })}
                                    placeholder="Entrez votre email"
                                />
                                {errors.email && <span className="text-danger">{errors.email.message}</span>}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="password" className="form-label">Mot de passe :</label>
                                <input
                                    type="password"
                                    id="password"
                                    className="form-control"
                                    {...register("password", { required: true })}
                                    placeholder="Entrez votre mot de passe"
                                />

                                {errors.password && <span className="text-danger">{errors.password.message}</span>}

                                <div className="text-end mt-1">
                                    <a className="link-forgot-password" href="#">Mot de passe oublié ?</a>
                                </div>
                            </div>

                            <div className="text-center mb-3">
                                <button type="submit" className="btn btn-one py-2 px-4">Se connecter</button>
                            </div>
                        </form>
                    )}
                    
                    {activeTab === "register" && <RegisterForm />}
                    {/* {activeTab === "register" && (
                        <form onSubmit={handleSubmit}>
                            {activeTab === "register" && <RegisterForm />}
                        </form>
                    )} */}
                </div>
        </div>
    </div>
    );
};

export default LoginForm;
