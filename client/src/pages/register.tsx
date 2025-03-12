import React from "react";
import '../assets/styles/global.css';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// Schéma validation Zod
const registerSchema = z.object({
    pseudo: z.string().min(3, "Le pseudo doit contenir au moins 3 caractères"),
    email: z.string().email("Email invalide"),
    password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    confirmPassword: z.string(),
    motivationText: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterForm: React.FC = () => {
    const { register, handleSubmit, formState: { errors }, reset, } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = (data: RegisterFormData) => {
        console.log("Inscription réussie :", data);
        reset(); // Réinitialise les champs après soumission
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
                            {...register("pseudo", { required: true })}
                            placeholder="Entrez votre pseudo"
                        />
                        {errors.pseudo && <p className="text-danger">{errors.pseudo.message}</p>}
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
                        <label htmlFor="confirmPassword" className="form-label">Confirmation fdp :</label>
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
                        {...register("motivationText", { required: true })}
                        placeholder="Pourquoi souhaitez-vous rejoindre ?"
                    />
                    {errors.motivationText && <p className="text-danger">{errors.motivationText.message}</p>}
                </div>

                <div className="text-center">
                    <button type="submit" className="btn btn-one py-2 px-4">S'inscrire</button>
                </div>
            </form>
        </>
    );
};

export default RegisterForm;
