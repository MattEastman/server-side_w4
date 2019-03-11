const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.get((req,res,next) => {
    leaders.find({})
    .then((leaders) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json();
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post((req, res, next) => {
    leaders.create(req.body)
    .then((leader) => {
        console.log('promo Created ', dish);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));
})
    
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
})

.delete((req, res, next) => {
    leaders.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

leaderRouter.route('/leaders')
.get((req,res,next) => {
    leaders.find({})
    .then((leaders) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json();
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post((req, res, next) => {
    leaders.create(req.body)
    .then((leader) => {
        console.log('leader Created ', dish);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));
})
    
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /leader');
})

.delete((req, res, next) => {
    leaders.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});



leaderRouter.route('/leaders/:leadId')
.get((req,res,next) => {
    leaders.findById(req.params.leadId)
    .then((leader) => {
        if (promotion != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(leaders.id(req.params.leadId));
        }
        else {
            err = new Error('leader ' + req.params.leadId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /leaders/'+ req.params.promoId);
})
.post((req, res, next) => {
       res.statusCode = 403;
    res.end('Put operation not supported on /leaders/'+ req.params.promoId);
 })   
.delete((req, res, next) => {
    leaders.findById(req.params.promoId)
    .then((leader) => {
        if (leader != null) {
            leader.id(req.params.promoId).remove();
           leader.save()
            .then((leader) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(leader);                
            }, (err) => next(err));
        }
        else {
            err = new Error('leader' + req.params.leadId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});



module.exports = leaderRouter;