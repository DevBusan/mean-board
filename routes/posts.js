// posts.js

var express = require('express');
var Post = require('../models/Post');
var fs = require('fs');
var multer = require('multer');

var router = express.Router();

var upload = multer({
    dest: '/tmp/'
});

// Index
router.get('/', function (req, res) {
    //현재 페이지	
    var curPage = req.query.curPage;
    if (curPage == null) {
        curPage = 1;
    }

    Post.count({}, function (err, totalCount) {
        if (err) return res.json(err);

        //페이지당 출력 데이터 수
        var sizePerPage = 15;
        var skipSize = (curPage - 1) * sizePerPage;
        var maxPage = Math.ceil(totalCount / sizePerPage);

        //한번에 출력할 페이지들
        var pagePerGroup = 10;
        var curGroup = Math.ceil(curPage / pagePerGroup);
        var startPage = (curGroup - 1) * pagePerGroup + 1;
        var endPage = (curGroup * pagePerGroup) > maxPage ? maxPage : (curGroup * pagePerGroup);

        var startIndex = totalCount - ((curPage - 1) * sizePerPage)

        Post.find({}).sort({
            createdAt: -1
        }).skip(skipSize).limit(sizePerPage).exec(
            function (err, posts) {
                if (err) return res.json(err);

                res.render('posts/index', {
                    posts: posts,
                    maxPage: maxPage,
                    curPage: curPage,
                    startPage: startPage,
                    endPage: endPage,
                    startIndex: startIndex
                });
            });

        // Post.find({}, function(err, posts) {
        // 	if (err) res.json(err);
        // 	res.render('posts/index', {posts: posts});
        // });
    });
});

// New
router.get('/new', function (req, res) {
    res.render('posts/new');
});

// Show
router.get('/:id', function (req, res) {
    Post.findOne({
        _id: req.params.id
    }, function (err, post) {
        if (err) res.json(err);

        post.count = post.count + 1;
        post.save(function (err) {
            if (err) res.json(err);

            res.render('posts/show', {
                post: post
            });
        });
    });
});

// Edit
router.get('/:id/edit', function (req, res) {
    Post.findOne({
        _id: req.params.id
    }, function (err, post) {
        if (err) res.json(err);
        res.render('posts/edit', {
            post: post
        });
    });
});

// Create
router.post('/', upload.array('attach'), function (req, res) {

    //for (var i = 0; i < 1000; i++) {
    // 	req.body.title = "게시판 테스트 데이터 : " + i;
    // 	Post.create(req.body);
    //}    

    var upFile = req.files;
    

    Post.create(req.body, function (err, post) {
        if (err) res.json(err);
        res.redirect('/posts');
    });
});

// Update
router.put('/:id', function (req, res) {
    req.body.updatedAt = Date.now();
    Post.findOneAndUpdate({
        _id: req.params.id
    }, req.body, function (err, post) {
        if (err) res.json(err);
        res.redirect('/posts/' + req.params.id);
    });
});

// Update Like
router.put('/:id/like', function (req, res) {
    Post.findOne({
        _id: req.params.id
    }, function (err, post) {
        if (err) res.json(err);

        post.like = post.like + 1;

        post.save(function (err) {
            if (err) res.json(err);
            res.redirect('/posts/' + req.params.id);
        });
    });
});

// Delete
router.delete('/:id', function (req, res) {
    Post.remove({
        _id: req.params.id
    }, function (err, post) {
        if (err) res.json(err);
        res.redirect('/posts');
    });
});

//Comment - Create
router.post('/comment/:id', function (req, res) {
    Post.findOne({
        _id: req.params.id
    }, function (err, post) {
        if (err) throw err;

        post.comments.unshift({
            writer: req.body.com_name,
            email: req.body.com_email,
            memo: req.body.com_memo
        });

        post.save(function (err) {
            if (err) throw err;
            res.redirect('/posts/' + req.params.id);
        });
    });
});

//Comment - Update
router.put('/:id/comment/:com_id', function (req, res) {
    Post.findOne({
        _id: req.params.id
    }, function (err, post) {
        if (err) throw err;

        var comment = post.comments.id(req.params.com_id);

        comment.memo = req.body.com_memo_update;

        post.save(function (err) {
            if (err) throw err;
            res.redirect('/posts/' + req.params.id);
        });
    });
});

//Comment - Delete
router.delete('/:id/comment/:com_id', function (req, res) {
    /*Post.update(
        { _id: req.params.id },           
        { $pull : { 'comments' : { _id : req.params.com_id }  } },
        function(err, post) {            
            if (err) throw err;             
            res.redirect('/posts/' + req.params.id);        
        });*/
    Post.findOne({
        _id: req.params.id
    }, function (err, post) {
        post.comments.id(req.params.com_id).remove();
        post.save(function (err) {
            if (err) throw err;
            res.redirect('/posts/' + req.params.id);
        });
    });
});

module.exports = router;