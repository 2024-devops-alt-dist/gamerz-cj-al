import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getRoomById } from "../api/services/roomService";
import { IRoom } from "../models/IRoom";
import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Edit from "../assets/pic⁫tures/edit.png";

const roomSchema = z.object({
    name: z.string().min(1, "Le nom est requis"),
    description: z.string().optional(),
});

type RoomFormData = z.infer<typeof roomSchema>;

const EditRoom: React.FC = () => {
    const { id } = useParams();
    const [room, setRoom] = useState<IRoom | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<RoomFormData>({
        resolver: zodResolver(roomSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    });

    useEffect(() => {
        const fetchRoom = async () => {
            if (!id) return;
            try {
                const res = await getRoomById(id);
                setRoom(res.data);
                reset({
                    name: res.data.name,
                    description: res.data.description || "",
                });
            } catch (error) {
                console.error("Erreur récupération salon :", error);
            }
        };
        fetchRoom();
    }, [id, reset]);

    const onSubmit = async (data: RoomFormData) => {
        if (!id) return;

        const formData = new FormData();
        const updates = [
            { property: "name", value: data.name },
            { property: "description", value: data.description },
        ];

        formData.append("updates", JSON.stringify(updates));
        if (file) {
            formData.append("picture", file);
        }
    
        try {
            const res = await fetch(`http://localhost:3000/api/rooms/${id}`, {
                method: "PATCH",
                body: formData,
            });
    
            if (!res.ok) throw new Error("Échec de la mise à jour");
    
            navigate(`/details-room/${id}`);
        } catch (error) {
            console.error("Erreur lors de la mise à jour :", error);
        }
    };

    if (!room) return <div>Chargement...</div>;

    return (
        <div className="p-4 dash-title">
            <div className="d-flex justify-content-between mb-5">
                <h1>Modifier le salon</h1>

                <div className="d-flex gap-3">
                    <Button className="btn btn-secondary btn-menu position-relative" disabled>
                        <img
                            src={Edit}
                            alt="icon edit"
                            style={{ width: "19px", height: "19px" }}
                        />
                        <span className="btn-text">En cours</span>
                    </Button>
                    <Button
                        variant="secondary"
                        className="d-flex justify-content-center align-items-center"
                        style={{ width: "38px", height: "38px" }}
                        onClick={() => navigate(`/details-room/${id}`)}
                    >
                        ✕
                    </Button>
                </div>
            </div>

            <Form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                    <div className="col-md-4 text-center">
                    {previewUrl ? (
                        <img
                            src={previewUrl}
                            alt="Aperçu"
                            className="img-fluid rounded mb-2"
                            style={{ maxHeight: "300px", objectFit: "cover" }}
                        />
                    ) : room.picture ? (
                        <img
                            src={`http://localhost:3000/uploads/${room.picture}`}
                            alt="Image du salon"
                            className="img-fluid rounded mb-2"
                            style={{ maxHeight: "300px", objectFit: "cover" }}
                        />
                    ) : (
                        <div className="text-muted">Aucune image associée</div>
                    )}

                    </div>

                    <div className="col-md-8">
                        <Form.Group className="mb-4">
                            <Form.Label><h5>Nom du salon</h5></Form.Label>
                            <Form.Control
                                type="text"
                                {...register("name")}
                                isInvalid={!!errors.name}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.name?.message}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label><h5>Description</h5></Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                {...register("description")}
                                isInvalid={!!errors.description}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.description?.message}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label><h5>Changer l'image du salon</h5></Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const target = e.target as HTMLInputElement;
                                    if (target.files && target.files.length > 0) {
                                        const selectedFile = target.files[0];
                                        setFile(selectedFile);
                                        setPreviewUrl(URL.createObjectURL(selectedFile));
                                    }
                                }}
                            />
                        </Form.Group>

                        <div className="d-flex gap-2 mt-3">
                            <Button className="btn btnAdd mt-3" type="submit" disabled={isSubmitting}>
                                Enregistrer les modifications
                            </Button>
                        </div>
                    </div>
                </div>
            </Form>
        </div>
    );
};

export default EditRoom;
