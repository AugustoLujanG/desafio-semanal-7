import express from 'express';
import { checkUser } from '../middlewares/auth.js';

export const logoutRouter = express.Router();

logoutRouter.get('/', checkUser, (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.render('error-page', { msg: 'No se pudo cerrar la sessión' });
    }
    return res.redirect('/');
  });
});
