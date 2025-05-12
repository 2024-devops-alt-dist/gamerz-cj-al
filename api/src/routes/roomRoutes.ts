import { Router } from "express";
import { createRoom, getRoomById, updateRoom, getRooms, deleteRoom } from "../controllers/roomController";
import upload from "../middlewares/upload";


const router: Router = Router();

/**
 * @swagger
 * /api/rooms:
 *   get:
 *     tags:
 *       - Rooms
 *     summary: Récupérer tous les salons
 *     description: Cette route renvoie la liste de tous les salons.
 *     responses:
 *       200:
 *         description: Liste des salons
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 */
router.get('/rooms', getRooms);

/**
 * @swagger
 * /api/rooms/{id}:
 *   get:
 *     tags:
 *       - Rooms
 *     summary: Récupérer un salon par son ID
 *     description: Cette route renvoie un salon basé sur son ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: L'ID du salon
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Salon trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 picture:
 *                   type: string
 *                 description:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *           404:
 *              description: Utilisateur non trouvé 
*/
router.get('/rooms/:id', getRoomById);

/**
 * @swagger
 * /api/rooms:
 *   post:
 *     tags:
 *       - Rooms
 *     summary: Créer un nouveau salon
 *     description: Cette route permet de créer un nouveau salon.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - picture
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               picture:
 *                 type: string
 *     responses:
 *       201:
 *         description: Salon créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 picture:
 *                   type: string
 *       500:
 *         description: Erreur interne du serveur
 */
router.post('/rooms', upload.single('picture'), createRoom);

/**
 * @swagger
 * /api/rooms/{id}:
 *   patch:
 *     tags:
 *       - Rooms
 *     summary: Mettre à jour un salon
 *     description: Met à jour un ou plusieurs champs d'un salon existant.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID du salon à mettre à jour
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               required:
 *                 - property
 *                 - value
 *               properties:
 *                 property:
 *                   type: string
 *                   example: name
 *                 value:
 *                   type: string
 *                   example: Mon nouveau salon
 *     responses:
 *       200:
 *         description: Salon mis à jour avec succès
 *       404:
 *         description: Salon non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */

router.patch('/rooms/:id', upload.single('picture'), updateRoom);

/**
 * @swagger
 * /api/rooms/{id}:
 *   delete:
 *     tags:
 *       - Rooms
 *     summary: Supprimer un salon
 *     description: Supprime un salon existant par son ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID du salon à supprimer
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Salon supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Room deleted successfully"
 *                 id:
 *                   type: string
 *                   example: "60adf8d74e35e52c8e2a6bfc"
 *       404:
 *         description: Salon non trouvé
 *       400:
 *         description: Échec de la suppression du salon
 *       500:
 *         description: Erreur interne du serveur
 */

router.delete('/rooms/:id', deleteRoom);

export default router;