import { Router } from "express";
import { createMessages, deleteMessages, getMessages, getMessagesById, updateMessages } from "../controllers/messageController";

const router: Router = Router();

/**
 * @swagger
 * /api/messages:
 *   get:
 *     tags:
 *       - Messages
 *     summary: Récupérer tous les messages
 *     description: Cette route récupère tous les messages existants.
 *     responses:
 *       200:
 *         description: Liste des messages récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *       404:
 *         description: Aucun message trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/messages', getMessages);

/**
 * @swagger
 * /api/messages/{id}:
 *   get:
 *     tags:
 *       - Messages
 *     summary: Récupérer un message par ID
 *     description: Cette route permet de récupérer un message via son id.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: L'identifiant unique du message à récupérer.
 *         schema:
 *           type: string
 *           example: "60f7d53e3f90f4f4b7c9a9b7"
 *     responses:
 *       200:
 *         description: Message récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: "ID du message"
 *                 content:
 *                   type: string
 *                   description: "Contenu du message"
 *       404:
 *         description: Aucun message trouvé avec cet identifiant
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/messages/:id', getMessagesById);

/**
 * @swagger
 * /api/messages:
 *   post:
 *     tags:
 *       - Messages
 *     summary: Créer un message
 *     description: Cette route permet de créer un nouveau message.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: "Le contenu du message"
 *                 example: "C'est un message d'exemple."
 *     responses:
 *       201:
 *         description: Message créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 content:
 *                   type: string
 *       400:
 *         description: Le contenu du message est requis
 *       500:
 *         description: Erreur interne du serveur
 */
router.post('/messages', createMessages);

/**
 * @swagger
 * /api/messages/{id}:
 *   patch:
 *     tags:
 *       - Messages
 *     summary: Mettre à jour un message par ID
 *     description: Cette route permet de mettre à jour un message existant via son id.
 *     parameters:
 *       - name: id
 *         in: path
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
 *               properties:
 *                 property:
 *                   type: string
 *                 value:
 *                   type: string
 *     responses:
 *       200:
 *         description: Message mis à jour avec succès
 *       400:
 *         description: Requête invalide
 *       404:
 *         description: Message non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.patch('/messages/:id', updateMessages);

/**
 * @swagger
 * /api/messages/{id}:
 *   delete:
 *     tags:
 *       - Messages
 *     summary: Supprimer un message par ID
 *     description: Cette route permet de supprimer un message via son id.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: "60f7d53e3f90f4f4b7c9a9b7"
 *     responses:
 *       200:
 *         description: Message supprimé avec succès
 *       404:
 *         description: Message non trouvé
 *       400:
 *         description: Échec de la suppression du message
 *       500:
 *         description: Erreur interne du serveur
 */
router.delete('/messages/:id', deleteMessages);

export default router;