const express = require('express');
const router = express.Router();
const Product = require('../models/Products');
const multer = require('multer');
const Order = require('../models/order');
var fs = require('fs');
var User = require('../models/user')
var upload = multer({ dest: 'uploads/' });

router.use('/',(req,res,next)=>{
    if(req.isAuthenticated()){
        return next()
    }
    return res.redirect('/admin/login');
});

router.get('/products',(req,res)=>{
    res.render('allproducts');
});

router.post('/orders/:id',(req,res)=>{
    Order.findById(req.params.id,(err,order)=>{
        if(!err){
            order.status = "Delivered";
            order.save((err)=>{
                if(!err){
                    res.redirect("back");
                }
            });
        }
    });
});
router.get('/orders/:id',(req,res)=>{
    Order.findById(req.params.id,(err,order)=>{
        if(!err){
            console.log(order);
            return res.render('orderinfo',{order:order});
        }
    })
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
router.get('/orders',(req,res)=>{
    var lim = 10;
    var noMatch = null;
    if(req.query.search){
        console.log("search");
        var re = req.query.search;
        console.log(req.query.search);
        const regex = new RegExp(escapeRegex(re), 'gi');
        Order.aggregate([
            {
                $match:{name:regex}
            },
            {
                $project:{
                    user:0,updatedAt:0,'cart.items':0
                }
            },
            {
                $sort :{
                    createdAt:-1
                }
            },
        ]).exec((err,orders)=>{
            if (err){
                console.log(err);
            } else {
                if(orders.length < 1){
                    noMatch = "No Match Found!";
                }
                res.send({orders:orders,noMatch:noMatch});
            }
        });
    } else if(req.query.data){
        lim = req.query.data;
        Order.aggregate([
            {
              $match:{}
            },
            {
                $project:{
                    user:0,updatedAt:0,'cart.items':0
                }
            },
            {
                $sort :{
                    createdAt:-1
                }
            },
            {
              $skip: lim-10
            },
            {
                $limit:10
            }
        ]).exec((err,orders)=>{
            if (err){
                console.log(err);
            } else {
                return res.send({orders:orders});
            }
        });
    } else {
        console.log('ordinary');
        Order.find({}).select({user:0,updatedAt:0,'cart.items':0}).sort({'createdAt':-1}).limit(lim).exec((err,orders)=>{
            if (err){
                console.log(err);
            } else {
                res.render('orders',{orders:orders,noMatch:noMatch});
            }
        });
    }
});

router.get('/',(req,res)=> {
    var revenue = 0;
    var customers = 0;
    var sales = 0;
    var Recent4 = [];
    Order.aggregate([
        {
            $match:{}
        },
        {
            $project:{
                updatedAt:0,'cart.items':0
            }
        },
        {
            $sort :{
                createdAt:-1
            }
        }
    ]).exec((err,orders)=>{
        if (!err){
            for(var order of orders){
                revenue += order.cart.totalPrice;
                sales += order.cart.totalQty;
            }
            Recent4 = orders.slice(0,4);
            User.count({},(err,count)=>{
                if (!err){
                    customers = count;
                    return res.render('index',{customers:customers,sales:sales,revenue:revenue,orders:Recent4});
                }
            });
        }else {
            console.log(err);
        }
    });
});
router.get('/addnew',(req,res)=>{
   res.render('advanceaddnew',{danger:req.flash('danger')[0],success:req.flash('success')[0]});
});
router.post('/addnew', upload.single('image'),(req,res,next)=>{
    console.log(req.file);
   var product = new Product ({
       title: req.body.title.toLowerCase(),
       content: req.body.content,
       category: req.body.category,
       originalPrice:req.body.originalPrice,
       discountedPrice:req.body.discountedPrice
   });
   product.img.data = fs.readFileSync(req.file.path);
   product.contentType = 'image/png';
   var info,message;
   product.save((err)=>{
       if(!err){
           info = 'success';
           message = "Successfully Added";
           req.flash(info,message);
           res.redirect('/addnew');
       }else {
           info = 'danger';
           message = err.toString();//development
           // message = "Invalid Credentials";//production
           req.flash(info,message);
           res.redirect('/addnew');
       }
   });




});
module.exports = router;