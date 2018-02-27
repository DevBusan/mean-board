// routes/users.js

var express = require('express');
var User = require('../models/User');

var router = express.Router();

// index
router.route("/").get(function(req, res) {
	User.find({})
	.sort({username: 1})
	.exec(function(err, users) {
		if (err) return res.json(err);
		res.render('users/list', {users: users});
	});
});


// new
router.get('/new', function(req, res) {
	res.render('users/new');
});

// create
router.post('/', function(req, res) {

	var newUser = new User;

	newUser.username = req.body.username;
	newUser.userid = req.body.userid;
	newUser.password = req.body.password;
	newUser.email = req.body.email;
	
	newUser.save(function(err) {
        if(err) throw err;        
        res.redirect('users/list');
    })
});

// show
router.get('/:username', function(req, res) {
	User.findOne({username: req.params.username}, function(err, user) {
		if (err) return res.json(err);
		res.render('users/show', {user: user});
	});
});

// CheckID
router.get('/checkID/:ID', function(req, res) {		
	User.count({userid: req.params.ID}, function(err, count) {
		if (err) return res.json(err);
		res.json(count);
	});
});

// edit
router.get('/:username/edit', function(req, res) {
	User.findOne({username: req.params.username}, function(err, user) {
		if (err) return res.json(err);
		res.render('users/edit', {user: user});
	});
});

// update
router.put('/:username', function(req, res) {
	User.findOne({username: req.params.username})
	.select('password')
	.exec(function(err, user) {
		if (err) return res.json(err);

		user.originalPassword = user.password;
		user.password = req.body.newPassword? req.body.newPassword : user.password;
		for (var p in req.body) {
			user[p] = req.body[p];	
		}

		user.save(function(err, user) {
			if (err) return res.json(err);
			res.redirect('/users/' + req.params.username);
		});
	});
});

module.exports = router;
