import mongoose from "mongoose";
import User from "../models/User";
import config from "../config";
import logger from "../utils/logger";
import bcrypt from "bcrypt";


async function createFixtures() {
    try {
        const mongoUri = config.uri;
        const saltRounds = 10;
        await mongoose.connect(mongoUri);
        await User.deleteMany({});
  
        const users = [
            { 
                username: 'admin', 
                email: 'admin@admin.com', 
                password: bcrypt.hashSync('admin', saltRounds),
                role: ['admin', 'user']
            },
            {
                username: 'player1',
                email: 'player1@example.com',
                password: bcrypt.hashSync('admin', saltRounds),
            },
            {
                username: 'gamer_22',
                email: 'gamer22@example.com',
                password: bcrypt.hashSync('admin', saltRounds),
            },
            {
                username: 'proPlayer01',
                email: 'proplayer01@example.com',
                password: bcrypt.hashSync('admin', saltRounds),
            },
            {
                username: 'shadow_ninja',
                email: 'shadow.ninja@example.com',
                password: bcrypt.hashSync('admin', saltRounds),
            },
            {
                username: 'xp_master',
                email: 'xpmaster@example.com',
                password: bcrypt.hashSync('admin', saltRounds),
            },
            {
                username: 'kingofarena',
                email: 'kingofarena@example.com',
                password: bcrypt.hashSync('admin', saltRounds),
            },
            {
                username: 'icefire55',
                email: 'icefire55@example.com',
                password: bcrypt.hashSync('admin', saltRounds),
            },
            {
                username: 'arcade_queen',
                email: 'arcadequeen@example.com',
                password: bcrypt.hashSync('admin', saltRounds),
            },
            {
                username: "stealth_assassin",
                email: 'stealth.assassin@example.com',
                password: bcrypt.hashSync('admin', saltRounds),
            },
            {
                username: 'gamer_legend',
                email: 'gamerlegend@example.com',
                password: bcrypt.hashSync('admin', saltRounds),
            }
        ];

        await User.insertMany(users);
        logger.info('Fixtures successfully inserted');
    } catch (error) {
        logger.error('Error during fixtures insertion', error);
    } finally {
        await mongoose.disconnect();
    }
  }

  createFixtures();