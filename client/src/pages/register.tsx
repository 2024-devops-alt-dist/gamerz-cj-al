import React, { useState } from "react";
import '../assets/styles/global.css';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { apiRegister } from "../api/services/authService";

// Schéma validation Zod
const registerSchema = z.object({
    username: z.string().min(3, "Le pseudo doit contenir au moins 3 caractères"),
    email: z.string().email("Email invalide"),
    password: z.string().min(4, "Le mot de passe doit contenir au moins 4 caractères"),
    confirmPassword: z.string(),
    description: z.string().min(1, "Le texte de motivation est obligatoire"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterForm: React.FC = () => {
    const { register, handleSubmit, formState: { errors }, reset, } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const [message, setMessage] = useState<string | null>(null);  
    const [isSuccess, setIsSuccess] = useState<boolean | null>(null)

    const onSubmit = async (data: RegisterFormData) => {
        try {
            const response = await apiRegister(
                data.username,
                data.email,
                data.password,
                data.description || ""
            );
    
            setMessage("Inscription réussie !");
            setIsSuccess(true);
            console.log("Inscription réussie :", response.data);
            reset();
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const errorMsg = error.response?.data?.message || error.message;
                setMessage("Erreur lors de l'inscription : " + errorMsg);
            } else {
                setMessage("Une erreur inconnue s'est produite.");
            }
            setIsSuccess(false);
        }
    };
    

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3 row">
                    <div className="col-sm-6">
                        <label htmlFor="pseudo" className="form-label">Pseudo :</label>
                        <input
                            type="text"
                            id="pseudo"
                            className="form-control"
                            {...register("username", { required: true })}
                            placeholder="Entrez votre pseudo"
                        />
                        {errors.username && <p className="text-danger">{errors.username.message}</p>}
                    </div>
                    <div className="col-sm-6">
                        <label htmlFor="email" className="form-label">Email :</label>
                        <input
                            type="email"
                            id="email"
                            className="form-control"
                            {...register("email", { required: true })}
                            placeholder="Entrez votre email"
                        />
                        {errors.email && <p className="text-danger">{errors.email.message}</p>}
                    </div>
                </div>

                <div className="mb-3 row">
                    <div className="col-sm-6">
                        <label htmlFor="password" className="form-label">Mot de passe :</label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            {...register("password", { required: true })}
                            placeholder="Entrez votre mot de passe"
                        />
                        {errors.password && <p className="text-danger">{errors.password.message}</p>}
                    </div>
                    <div className="col-sm-6">
                        <label htmlFor="confirmPassword" className="form-label">Confirmation mdp :</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            className="form-control"
                            {...register("confirmPassword", { required: true })}
                            placeholder="Confirmez votre mot de passe"
                        />
                        {errors.confirmPassword && <p className="text-danger">{errors.confirmPassword.message}</p>}
                    </div>
                </div>

                <div className="mb-3">
                    <label htmlFor="motivationText" className="form-label">Texte de motivation :</label>
                    <textarea
                        id="motivationText"
                        className="form-control"
                        {...register("description", { required: true })}
                        placeholder="Pourquoi souhaitez-vous rejoindre ?"
                    />
                    {errors.description && <p className="text-danger">{errors.description.message}</p>}
                </div>

                {message && (
                    <div className={`mt-3 mb-3 text-center ${isSuccess ? "text-success" : "text-danger"}`}>
                        {message}
                    </div>
                )}

                <div className="text-center">
                    <button type="submit" className="btn btn-one py-2 px-4">S'inscrire</button>
                </div>
            </form>
        </>
    );
};

export default RegisterForm;
