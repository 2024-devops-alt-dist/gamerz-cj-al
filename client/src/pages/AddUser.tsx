import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

// Schéma de validation Zod
const userSchema = z.object({
    username: z.string().min(3, "Le pseudo doit contenir au moins 3 caractères"),
    email: z.string().email("Email invalide"),
    password: z.string().min(4, "Le mot de passe doit contenir au moins 4 caractères"),
    confirmPassword: z.string(),
    description: z.string().min(1, "La description est obligatoire"),  
    role: z.enum(['admin', 'user']).transform(val => val === 'admin' ? ['admin', 'user'] : ['user']),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
});

type UserFormData = z.infer<typeof userSchema>;

const AddUser: React.FC = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<UserFormData>({
        resolver: zodResolver(userSchema),
    });

    const [message, setMessage] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
                setIsSuccess(null);
            }, 3000); 
    
            return () => clearTimeout(timer);
        }
    }, [message]);
    
    const onSubmit = async (data: UserFormData) => {
        try {
            const response = await axios.post('http://localhost:3000/api/users', {
                username: data.username,
                email: data.email,
                password: data.password,
                description: data.description,
                role: data.role, 
                isApproved: true,
                isBanned: false,
            }, {
                withCredentials: true,
            });

            setMessage("Utilisateur ajouté avec succès !");
            setIsSuccess(true);
            console.log("Inscription réussie :", response.data);
            reset();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMsg = error.response?.data?.message || error.message;
                setMessage("Erreur lors de la création : " + errorMsg);
            } else {
                setMessage("Une erreur inconnue s'est produite.");
            }
            setIsSuccess(false);
        }
    };


    return (
        <div className="p-4 dash-title">
            <h1 className="mb-5">Ajouter un utilisateur</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row mb-3">
                    <div className="col-md-4">
                        <label htmlFor="username" className="form-label">Nom d'utilisateur :</label>
                        <input
                            type="text"
                            id="username"
                            className="form-control"
                            {...register("username")}
                            placeholder="Entrez le nom d'utilisateur"
                        />
                        {errors.username && <p className="text-danger">{errors.username.message}</p>}
                    </div>

                    <div className="col-md-4">
                        <label htmlFor="email" className="form-label">Email :</label>
                        <input
                            type="email"
                            id="email"
                            className="form-control"
                            {...register("email")}
                            placeholder="Entrez l'email"
                        />
                        {errors.email && <p className="text-danger">{errors.email.message}</p>}
                    </div>

                    <div className="col-md-4">
                        <label htmlFor="role" className="form-label">Rôle :</label>
                        <select id="role" className="form-control" {...register("role")}>
                            <option value="user">Utilisateur</option>
                            <option value="admin">Administrateur</option>
                        </select>
                        {errors.role && <p className="text-danger">{errors.role.message}</p>}
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-6">
                        <label htmlFor="password" className="form-label">Mot de passe :</label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            {...register("password")}
                            placeholder="Entrez le mot de passe"
                        />
                        {errors.password && <p className="text-danger">{errors.password.message}</p>}
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="confirmPassword" className="form-label">Confirmer le mot de passe :</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            className="form-control"
                            {...register("confirmPassword")}
                            placeholder="Confirmez le mot de passe"
                        />
                        {errors.confirmPassword && <p className="text-danger">{errors.confirmPassword.message}</p>}
                    </div>
                </div>

                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description :</label>
                    <textarea
                        id="description"
                        className="form-control"
                        {...register("description")}
                        placeholder="Ajoutez une description"
                    />
                    {errors.description && <p className="text-danger">{errors.description.message}</p>}
                </div>

                {message && (
                    <div className={`mt-3 mb-3 text-center ${isSuccess ? "text-success" : "text-danger"}`}>
                        {message}
                    </div>
                )}

                <div className="text-center ">
                    <button type="submit" className="btn btnAdd mt-3">Ajouter</button>
                </div>
            </form>
        </div>
    );
};

export default AddUser;
