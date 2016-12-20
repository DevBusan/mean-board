// posts.js

var express = require('express');
var Post = require('../models/Post');

var router = express.Router();

// Index
router.get('/', function(req, res) {

	//현재 페이지
	var curPage = req.param('curPage');
	if (curPage == null) {
		curPage = 1;
	}

	//skip 할 데이터 사이즈
	var sizePerPage = 10;
	var skipSize = (curPage-1) * sizePerPage;
	var pageNum = 1;

	Post.count({}, function(err, totalCount){
		if(err) return res.json(err);

		pageNum = Math.ceil(totalCount/sizePerPage);

		Post.find({}).sort({createdAt:-1}).skip(skipSize).limit(sizePerPage).exec(
			function(err,posts){
				if(err) return res.json(err);

				res.render('posts/index',
					{
						posts: posts,
						pageNum : pageNum,
						curPage : curPage
					}
				);
			});

		// Post.find({}, function(err, posts) {
		// 	if (err) res.json(err);
		// 	res.render('posts/index', {posts: posts});
		// });
	});
});

// New
router.get('/new', function(req, res) {
	res.render('posts/new');
});

// Show
router.get('/:id', function(req, res) {
	Post.findOne({_id: req.params.id}, function(err, post) {
		if (err) res.json(err);
		res.render('posts/show', {post: post});
	});
});

// Edit
router.get('/:id/edit', function(req, res) {
	Post.findOne({_id: req.params.id}, function(err, post) {
		if (err) res.json(err);
		res.render('posts/edit', {post: post});
	});
});

// Create
router.post('/', function(req, res) {
	Post.create(req.body, function(err, post) {
		if (err) res.json(err);
		res.redirect('/posts');
	});
});

// Update
router.put('/:id', function(req, res) {
	req.body.updatedAt = Date.now();
	Post.findOneAndUpdate({_id: req.params.id}, req.body, function(err, post) {
		if (err) res.json(err);
		res.redirect('/posts/' + req.params.id);
	});
});

// Destory
router.delete('/:id', function(req, res) {
	Post.remove({_id: req.params.id}, function(err, post) {
		if (err) res.json(err);
		res.redirect('/posts');
	});
});

module.exports = router;
