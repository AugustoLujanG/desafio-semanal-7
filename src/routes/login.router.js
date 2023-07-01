import express from 'express';
import passport from 'passport';

export const loginRouter = express.Router();

loginRouter.post(
  '/',
  passport.authenticate('login', { failureRedirect: '/login/faillogin' }),
  async (req, res) => {
    if (!req.user) {
      return res.status(400).render('error-page', { msg: 'Datos incorrectos' });
    }
    req.session.user = {
      _id: req.user._id,
      age: req.user.age,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      admin: req.user.admin,
    };

    return res.redirect('/home');
  }
);

loginRouter.get('/faillogin', async (req, res) => {
  return res.status(500).render('error-page', { msg: 'Error inesperado en servidor' });
});

// loginRouter.post('/', async (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password) {
//     return res.status(400).render('error-page', { msg: 'Datos incorrectos' });
//   }
//   try {
//     const foundUser = await userModel.findOne({ email }).exec();
//     if (foundUser && isValidPassword(password, foundUser.password)) {
//       req.session.firstName = foundUser.firstName;
//       req.session.email = foundUser.email;
//       req.session.admin = foundUser.admin;
//       return res.redirect('/home');
//     } else {
//       return res.status(400).render('error-page', { msg: 'Email o pass incorrectos' });
//     }
//   } catch (e) {
//     console.log(e);
//     return res.status(500).render('error-page', { msg: 'Error inesperado en servidor' });
//   }
// });
