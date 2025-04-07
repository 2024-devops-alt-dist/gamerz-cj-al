import { Router } from "express";
import { createUser, deleteUser, getUserById, getUsers, updateUser } from "../controllers/userController";
import auth from "../middlewares/auth";


const router: Router = Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Récupérer tous les utilisateurs
 *     description: Cette route renvoie une liste de tous les utilisateurs.
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 */
router.get('/users', auth, getUsers);


/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Récupérer un utilisateur par ID
 *     description: Cette route renvoie un utilisateur basé sur son ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: L'ID de l'utilisateur
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utilisateur trouvé
 *         content:
 *           application/json:
 *       404:
 *         description: Utilisateur non trouvé
 */
router.get('/users/:id', auth, getUserById);


/**
 * @swagger
 * /api/users:
 *   post:
 *     tags:
 *       - Users
 *     summary: Créer un nouvel utilisateur
 *     description: Cette route permet de créer un nouvel utilisateur.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 */
router.post('/users', auth, createUser);

/**
 * @swagger
 * /api/users:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Met à jour un utilisateur
 *     description: Cette route permet de mettre à jour un utilisateur.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: L'ID de l'utilisateur
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *     responses:
 *       204:
 *         description: Utilisateur mis à jour avec succès
 *         content:
 *           application/json:
 */
router.patch('/users/:id', auth, updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Supprimer un utilisateur
 *     description: Cette route permet de supprimer un utilisateur en fonction de son ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: L'ID de l'utilisateur
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès
 *       404:
 *         description: Utilisateur non trouvé
 */
router.delete('/users/:id', auth, deleteUser);

export default router;