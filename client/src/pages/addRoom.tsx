import React, { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { addRoom } from "../api/services/roomService";

const roomSchema = z.object({
    name: z.string().min(3, "Le nom du salon doit comporter au moins 3 caractères."),
    description: z.string().min(10, "La description doit comporter au moins 10 caractères."),
    picture: z
        .any()
        .refine(
            (files) => files instanceof FileList && files.length > 0,
            "Une image doit être sélectionnée."
        )
        .transform((files) => files[0])
});

type RoomFormData = z.infer<typeof roomSchema>;
type AddRoomProps = {
    refreshRooms?: () => Promise<void>;
};

const AddRoom: React.FC<AddRoomProps> = ({ refreshRooms }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<RoomFormData>({
        resolver: zodResolver(roomSchema)
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

    const onSubmit = async (data: RoomFormData) => {
        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('description', data.description);
            formData.append('picture', data.picture);
            
            const response = await addRoom(formData);
    
            setMessage("Salon ajouté avec succès !");
            setIsSuccess(true);
            console.log("Création réussie :", response.data);
    
            reset();
    
            if (refreshRooms) {
                await refreshRooms();
            }
    
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
        <>
            <div className="p-4 dash-title">
                <h1 className="mb-5">Ajouter un salon</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Nom du salon :</label>
                        <input
                            type="text"
                            id="name"
                            className="form-control"
                            {...register("name")}
                            placeholder="Choisissez un nom"
                        />
                        {errors.name && <p className="text-danger">{errors.name.message}</p>}
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

                    <div className="mb-3">
                        <label htmlFor="picture" className="form-label">Télécharger votre image :</label>
                        <input
                            type="file"
                            id="picture"
                            className="form-control"
                            {...register("picture")}
                        />
                        {errors.picture && typeof errors.picture.message === 'string' && (
                            <p className="text-danger">{errors.picture.message}</p>
                        )}
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
        </>
    );
};

export default AddRoom;