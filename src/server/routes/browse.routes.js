import mongoose from 'mongoose';
import express from 'express';
import Room from '../models/Room';
let router = express.Router();

router.get('/browse', (req, res) => {
  Room.find({private: false}).catch(err => console.log("Room error: ", err.message));
});
