import express from 'express';
import { userModel } from '../DAO/models/users.model.js';

export const loginRouter = express.Router();

loginRouter.post('/', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).render('error-page', { msg: 'Datos incorrectos' });
  }
  try {
    const foundUser = await userModel.findOne({ email }).exec();
    if (foundUser && foundUser.password === password) {
      req.session.firstName = foundUser.firstName;
      req.session.email = foundUser.email;
      req.session.admin = foundUser.admin;
      return res.redirect('/home');
    } else {
      return res.status(400).render('error-page', { msg: 'Email o pass incorrectos' });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).render('error-page', { msg: 'Error inesperado en servidor' });
  }
});
