const router = require('express').Router();
const { findAll, findByUsername, findById, create, update, remove } = require('../../controllers/usersController');
const { User } = require('../../models')
const passport = require('../../passport');

router.post("/login",
    (req, res, next) => {
        console.log("routes/user.js, login, req.body:", req.body);
        next();
    },
    passport.authenticate("local"),
    (req, res) => {
        console.log("logged in", req.user);
        // var userInfo = {
        //     username: req.user.username
        // };
        res.json(req.user);
    }
);

router.post("/", (req, res) => {
    console.log("user signup", req.body);

    const { username, password, email } = req.body;
    // ADD VALIDATION
    User.findOne({ username: username }, (err, user) => {
        if (err) {
            console.log("User.js post error: ", err);
        } else if (user) {
           return res.json({ error: `Sorry, already a user with the username: ${username}`});
        } else {
            const newUser = new User({
                username: username,
                password: password,
                email: email
            });
            newUser.save((err, savedUser) => {
                if (err) return res.json(err);
                res.json(savedUser);
            });
        }
    });
});


router.get("/", (req, res) => {
    // console.log('rq.user frin api/user', req.user)
    if (!req.user) {
        res.json({ user: null });
    } else {
        console.log("===== user!!======");
        console.log('api/users.js req.user', req.user);
        res.json({ user: req.user });
    }
});

router.post("/logout", (req, res) => {
    if (req.user) {
        req.logout();
        console.log("logged out req.user", req.user)
        res.send({ msg: "logging out" });
    } else {
        console.log('no user to log out')
        res.send({ msg: "no user to log out" });
    }
});

router.get('/:username', ({ params }, res) => {
    // console.log('/api/user/:id req.params', req.params)
    User.findOne({ username: params.username }).populate({ path: 'works', options: { sort: { _id: -1}} })
        .then(user => res.send(user))
        .catch(err => console.log(err));
})
//     .post(create)
//     .put(update)
//     .delete(remove);

module.exports = router;
// router.route('/login').post(function (req, res, next) {
//         console.log('routes/login.js, login, req.body', req.body);
//         next();
//     },
//         passport.authenticate('local'),
//         (req, res) => {
//             console.log('logged in', req.user);
//             res.send(req.user);
// });

// router.route('/:username')
//     .get(findByUsername);

// router.route('/:id')
//     .get(findById);


