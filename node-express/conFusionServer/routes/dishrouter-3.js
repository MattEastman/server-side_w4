const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Dishes = require('../models/dishes');
var authenticate = require('../authenticate');
var cors = require('cors');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
.all((req, res, next) => {
    console.log('inside starting function');
    next();
})
.get((req, res, next) => {
    Dishes.find({})
    .populate('comments.author')
    .then((dishes) => {
        console.log('Get request succeeded');
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dishes);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    console.log(req.body);
    var err = authenticate.verifyAdmin(req.user.admin);
    if(err) {
        return next(err);
    }
    Dishes.create(req.body)
    .then((dish) => {
        console.log('Dish added successfully to DB: ', dish);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => {
        console.log('inside error block: ', err);
        next(err);
    })
    .catch((err) => {
        console.log('inside catch block: ', err);
        next(err);
    });
})
.put(authenticate.verifyUser, (req, res, next)=> {
    res.statusCode = 403;
    res.end('PUT is not supported');
})
.delete(authenticate.verifyUser, (req,res,next)=> {
    var err = authenticate.verifyAdmin(req.user.admin);
    if(err) {
        return next(err);
    }
    Dishes.remove({})
    .then((resp) => {
        console.log('Dishes removed successfully from DB');
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => {next(err)});
});

dishRouter.route('/:dishId')
.get((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) => {
        console.log('Found dish successfully from DB: ', dish);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end('POST not supported on dishes/:dishId end point');
})
.put(authenticate.verifyUser, (req,res,next) => {
    var err = authenticate.verifyAdmin(req.user.admin);
    if(err) {
        return next(err);
    }
    Dishes.findByIdAndUpdate(req.params.dishId, { $set: req.body }, { new:true} )
    .then((dish) => {
        console.log('Updated given dish with new data: ', dish);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser, (req,res,next) => {
    var err = authenticate.verifyAdmin(req.user.admin);
    if(err) {
        return next(err);
    }
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((resp) => {
        console.log('Removed dish with given id');
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

dishRouter.route('/:dishId/comments')
.get((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) => {
        if(dish != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments);
        }
        else {
            err = new Error('no dish with given id was found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish != null) {
            req.body.author = req.user._id;
            dish.comments.push(req.body);
            dish.save()
            .then((dish) => {
                Dishes.findById(dish._id)
                .populate('comments.author')
                .then((dish) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish);
                })
            }, (err) => next(err))
            .catch((err) => next(err));
        }
        else {
            err = new Error("no dish with given id was found");
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT isn\'t supported on /:dishId/comments end point');
})
.delete(authenticate.verifyUser, (req, res, next) => {
    var err = authenticate.verifyAdmin(req.user.admin);
    if(err) {
        return next(err);
    }
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish != null) {
            for(var i=dish.comments.length-1; i>=0; i--) {
                dish.comments.id(dish.comments[i]._id).remove();
            }
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, (err) => next(err));
        }
        else {
            err = new Error("dish with given id not found");
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})

dishRouter.route('/:dishId/comments/:commentId')
.get((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) => {
        if(dish != null && dish.comments.id(req.params.commentId) != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments.id(req.params.commentId));
        }
        else if(dish == null) {
            err = new Error("No dish was found with given id");
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error("No comment was found with given id");
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /:dishId/comments/:commentId end point');
})
.put(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish != null && dish.comments.id(req.params.commentId) != null) {
            console.log('value of 1: ', dish.comments.id(req.params.commentId).author._id);
            console.log('value of 2: ', req.user._id);
            if(!dish.comments.id(req.params.commentId).author._id.equals(req.user._id)) {
                var err = new Error('You are not authorized to do this operation');
                err.status = 403;
                next(err);
            }
            if(req.body.rating) {
                dish.comments.id(req.params.commentId).rating = req.body.rating;
            }
            if(req.body.comment) {
                dish.comments.id(req.params.commentId).comment = req.body.comment;
            }
            dish.save()
            .then((dish) => {
                Dishes.findById(dish._id)
                .populate('comments.author')
                .then((dish) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish);
                })
            }, (err) => next(err))
            .catch((err) => next(err));
        }
        else if(dish == null) {
            err = new Error("No dish was found with given id");
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error("No comment was found with given id");
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            if(!dish.comments.id(req.params.commentId).author._id.equals(req.user._id)) {
                var err = new Error('You are not authorized to do this operation');
                err.status = 403;
                next(err);
            }
            dish.comments.id(req.params.commentId).remove();
            dish.save()
            .then((dish) => {
                Dishes.findById(dish._id)
                .populate('comments.author')
                .then((dish) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish);
                })
            }, (err) => next(err));
        }
        else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = dishRouter;