import express from "express";

import { connect } from "getstream";
import { StreamChat } from "stream-chat";
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { config } from 'dotenv';

const router = express.Router();
config();

const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;
const app_id = process.env.STREAM_APP_ID;

router.post('/signup', async (req, res, next) => {
  try {
    console.log('server signup: ', req.body);

    const { fullName, username, password, phoneNumber } = req.body;
    const userId = crypto.randomBytes(16).toString('hex');
    const serverClient = connect(api_key, api_secret, app_id);

    const hashedPassword = await bcrypt.hash(password, 10);
    const token = serverClient.createUserToken(userId);

    res.status(200).json({
      message: 'Sign up successfully',
      data: {
        token,
        username,
        fullName,
        userId,
        hashedPassword,
        phoneNumber
      }
    });
  } catch (error) {
    res.status(400).json({
      message: error,
      data: null
    });
  }
});

router.post('/login', async (req, res, next) => {
  try {
    console.log('server login: ', req.body);
    const { username, password } = req.body;

    const serverClient = connect(api_key, api_secret, app_id);
    const client = StreamChat.getInstance(api_key, api_secret);

    const { users } = await client.queryUsers({ name: username });
    if (!users.length) {
      return res.status(400).json({
        message: 'User not found',
        data: null
      })
    }

    const success = await bcrypt.compare(password, users[0].hashedPassword);
    const token = serverClient.createUserToken(users[0].id);
    if (success) {
      res.status(200).json({
        message: 'Login successfully',
        data: {
          token,
          fullName: users[0].fullName,
          username,
          userId: users[0].id
        }
      });
    } else {
      res.status(500).json({
        message: 'Password incorrect',
        data: null
      })
    }
  } catch (error) {
    res.status(400).json({
      message: error,
      data: null
    });
  }
});

export default router;