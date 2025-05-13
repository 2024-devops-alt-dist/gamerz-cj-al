import mongoose from "mongoose";
import User from "../models/User";
import config from "../config";
import logger from "../utils/logger";
import bcrypt from "bcrypt";
import Room from "../models/Room";
import Message from "../models/Message";


async function createFixtures() {
    try {
        const mongoUri = config.uri;
        const saltRounds = 10;
        await mongoose.connect(mongoUri);
        await User.deleteMany({});
        await Room.deleteMany({});

        const users = [
            { 
                username: 'admin', 
                email: 'admin@admin.com', 
                password: bcrypt.hashSync('admin', saltRounds),
                role: ['admin', 'user'],
                description: 'Passionné par les mondes ouverts et les aventures palpitantes, je suis un joueur assidu d\'Assassin\'s Creed. J\'adore plonger dans des histoires riches et immersives tout en explorant des paysages magnifiques. Rejoindre un salon de discussion sur ce jeu serait l\'occasion de partager ma passion et d\'échanger des astuces avec d\'autres fans.',
            },
            {
                username: 'player1',
                email: 'player1@example.com',
                password: bcrypt.hashSync('admin', saltRounds),
                description: 'Minecraft est mon terrain de jeu préféré ! Que ce soit pour construire des mondes imaginaires ou affronter des créatures dans des aventures épiques, ce jeu me permet d\'exprimer ma créativité tout en restant connecté à une communauté dynamique. J\'aimerais échanger avec d\'autres joueurs pour découvrir de nouvelles astuces et projets.',
            },
            {
                username: 'gamer_22',
                email: 'gamer22@example.com',
                password: bcrypt.hashSync('admin', saltRounds),
                description: 'Witcher 3 a transformé ma vision des RPG avec ses personnages profonds et ses quêtes fascinantes. J\'ai passé des heures à parcourir les terres de Temeria et je suis toujours à la recherche de discussions passionnantes sur l\'univers de Geralt. Ce salon est l\'endroit idéal pour rencontrer d\'autres fans et échanger sur les meilleurs moments du jeu.',
            },
            {
                username: 'proPlayer01',
                email: 'proplayer01@example.com',
                password: bcrypt.hashSync('admin', saltRounds),
                description: 'Les jeux vidéo sont bien plus qu\'une simple passion pour moi, c\'est un moyen d\'évasion. Assassin\'s Creed m\'a permis de découvrir des époques fascinantes tout en défiant mes compétences de joueur. Partager mes expériences avec d\'autres passionnés et apprendre de nouvelles stratégies est quelque chose que j\'attends avec impatience.',
            },
            {
                username: 'shadow_ninja',
                email: 'shadow.ninja@example.com',
                password: bcrypt.hashSync('admin', saltRounds),
                description: 'Minecraft est une véritable source d\'inspiration pour moi. Construire, explorer et collaborer avec d\'autres joueurs est ce qui me motive à me plonger toujours plus dans ce monde en perpétuelle évolution. Je suis impatient de rejoindre ce salon pour découvrir de nouvelles créations et stratégies avec d\'autres fans du jeu.',
            },
            {
                username: 'xp_master',
                email: 'xpmaster@example.com',
                password: bcrypt.hashSync('admin', saltRounds),
                description: "L'univers de The Witcher 3 est l'un des plus riches que j'aie exploré. Entre l'alchimie, les contrats de sorceleur et les décisions aux lourdes conséquences, chaque partie est unique. J'aimerais partager mes découvertes et discuter des différentes fins possibles avec d'autres passionnés."

            },
            {
                username: 'kingofarena',
                email: 'kingofarena@example.com',
                password: bcrypt.hashSync('admin', saltRounds),
                description: "Fan des combats fluides et des mécaniques d'infiltration, j’ai suivi la saga Assassin’s Creed depuis ses débuts. Chaque épisode m’a marqué différemment et j’aimerais échanger avec ceux qui ont vécu cette évolution. Qui sait ? On pourrait même débattre sur le meilleur assassin !"

            },
            {
                username: 'icefire55',
                email: 'icefire55@example.com',
                password: bcrypt.hashSync('admin', saltRounds),
                description: "Minecraft me permet de laisser libre cours à mon imagination, que ce soit dans des constructions monumentales ou des aventures survie hardcore. Je suis curieux de voir les créations des autres joueurs et de collaborer sur des projets communautaires."
            },
            {
                username: 'arcade_queen',
                email: 'arcadequeen@example.com',
                password: bcrypt.hashSync('admin', saltRounds),
                description: "Je suis tombée sous le charme de l’univers sombre et mature de Witcher 3. Entre les intrigues politiques et les histoires humaines, ce jeu m’a transportée comme peu d'autres. J’ai hâte de discuter des moments marquants et de découvrir des choix que je n’ai pas explorés."
            },
            {
                username: "stealth_assassin",
                email: 'stealth.assassin@example.com',
                password: bcrypt.hashSync('admin', saltRounds),
                description: "L’infiltration, la discrétion, et l’art de la lame secrète… Assassin’s Creed est mon terrain de jeu favori. Chaque mission est un défi que j’adore relever. Je suis ici pour échanger techniques et souvenirs épiques avec ceux qui aiment passer dans l’ombre."
            },
            {
                username: 'gamer_legend',
                email: 'gamerlegend@example.com',
                password: bcrypt.hashSync('admin', saltRounds),
                description: "Pourquoi choisir quand on peut tout aimer ? Minecraft pour la créativité, Witcher 3 pour l’aventure. J’aime autant bâtir des mondes pixelisés que me plonger dans les quêtes profondes de Geralt. Ce salon est parfait pour rencontrer d'autres passionnés aux multiples facettes comme moi."
            }
        ];

        const rooms = [
            {
                name: "Assassin's Creed",
                description: "Discutez de toute la saga Assassin's Creed, des premiers épisodes emblématiques aux dernières aventures. Partagez vos théories, moments marquants et souvenirs de parkour à travers l’Histoire.",
                picture : "assassinsCreed.jpeg",
            },
            {
                name: "The Witcher 3",
                description: "Un espace pour tous les fans de The Witcher 3 : parlez des choix difficiles, des quêtes épiques, des monstres redoutables et des personnages inoubliables qui ont marqué vos aventures dans le Continent. Retouvez des joueurs avec qui partager ce moment.",
                picture : "witcher3.jpg",
            },
            {
                name: "Minecraft",
                description: "Rejoignez la communauté des bâtisseurs et aventuriers ! Que vous soyez fan de survie ou de créations monumentales, ce salon est fait pour partager vos mondes et trouver l’inspiration. Retouvez des joueurs avec qui partager ce moment.",
                picture : "minecraft.jpg",
            },
        ];

        await User.insertMany(users);
        await Room.insertMany(rooms);
        logger.info('Fixtures successfully inserted');
    } catch (error) {
        logger.error('Error during fixtures insertion', error);
    } finally {
        await mongoose.disconnect();
    }
}

createFixtures();