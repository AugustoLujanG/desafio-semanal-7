import express from 'express';
import { userModel } from '../DAO/models/users.model.js';

export const registerRouter = express.Router();

registerRouter.get('/', (req, res) => {
  res.render('register-form');
});

registerRouter.post('/', async (req, res) => {
  const { firstName, lastName, age, email, password } = req.body;
  if (!firstName || !lastName || !age || !email || !password) {
    return res.status(400).render('error-page', { msg: 'Datos incorrectos' });
  }
  try {
    await userModel.create({ firstName, lastName, age, email, password });
    req.session.firstName = firstName;
    req.session.email = email;
    return res.status(201).render('success-login');
  } catch (e) {
    console.log(e);
    return res.status(400).render('error-page', { msg: 'Controla tu email y intenta más tarde' });
  }
});
