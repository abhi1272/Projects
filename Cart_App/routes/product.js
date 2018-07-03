var express = require('express');
var router = express.Router();
var Product = require("../model/product");
var auth = require('../middleware/auth');

//add product 

router.get('/add',auth.checkLogin,function (req,res){
	res.render('product')
});

router.post('/add',function(req,res){

	var name =  req.body.name;
	var batchNo = req.body.batchNo;
	var expiryDate = req.body.expiryDate;
	var MRP = req.body.MRP;
	var quantity = req.body.quantity; 


   req.checkBody('name', 'Name is required').notEmpty();
   req.checkBody('batchNo', 'email is required').notEmpty();
   req.checkBody('expiryDate', 'email is not valid').notEmpty();
   req.checkBody('MRP', 'username is required').notEmpty();
   req.checkBody('quantity', 'password is required').notEmpty();
 
   var errors = req.validationErrors();
   
  
   if(errors){
       res.render('product',{
           errors: errors
       });
   }
   else{
       var newProduct = new Product({
           name: name,
           batchNo: batchNo,
           expiryDate: expiryDate,
           MRP: MRP,
           quantity:quantity
       });
       
       newProduct.save(function(err,product){
       		if(err) throw err
       })

       req.flash('success_msg','your product is added');
       
       res.redirect('/product/add');
   }
   
});

router.get('/all',function(req,res){
	Product.find({},function(err,product){
		if(err) throw err
		res.render('index',{product: product})

	});

});


router.get('/detail/:name',function(req,res){
	Product.findOne({name:req.params.name},function(err,product){
		if(err) throw err
		res.render('detail',{product: product})
	});

});

router.get('/edit/:id',auth.checkLogin,function(req,res){
	Product.findOne({_id:req.params.id},function(err,product){
		if(err) throw err
		res.render('edit',{product: product})
	});

});


router.post('/update/:id',auth.checkLogin,function(req,res){
	Product.findOneAndUpdate({_id:req.params.id},{$set:{name:req.body.name,batchNo:req.body.batchNo,
	MRP:req.body.MRP,quantity:req.body.quantity}},function(err,product){
		if(err) throw err
		//	res.send("successfully updated");
			res.redirect('/product/all')
	});
});

router.post('/delete/:id',function(req,res){
	Product.findOneAndRemove({_id:req.params.id},function(err){
		if(err) throw err
		//	res.send("successfully deleted");
			res.redirect('/product/all')
	});
});

router.get('/cart/:id',auth.checkLogin,function(req,res){

	var productId = req.params.id;
	var cart = new Product.Cart(req.session.cart ? req.session.cart : {});

	Product.findById(productId,function(err,product){
		if(err){
			return res.redirect('/')
		}
		else{
			cart.add(product,product.id);
			req.session.cart = cart;
			//res.render('cart',{items: req.session.cart.items,totalPrice: req.session.cart.totalPrice});
		return res.redirect('/product/cart');
		}
	})

})

router.get('/add-to-cart/:name',function(req,res){
	 
var cart = new Product.Cart(req.session.cart ? req.session.cart : {}); 

	Product.find({name: req.params.name},function(err,product){
			if(err) throw err
				productId = product[0].id
				Product.findById(productId,function(err,product){
				cart.add(product,product.id);
				req.session.cart = cart;
				return res.redirect('/product/cart')
			});

		});


})

router.get('/remove-from-cart/:name',function(req,res){
	 
var cart = new Product.Cart(req.session.cart ? req.session.cart : {}); 

	Product.find({name: req.params.name},function(err,product){
			if(err) throw err
				productId = product[0].id
				Product.findById(productId,function(err,product){
				if(cart.items[productId].qty>0){
					cart.subtract(product,product.id);
				}
				else{
					console.log('you can not reduce the quantity')
				}
				req.session.cart = cart;
				return res.redirect('/product/cart')
			});

		});


})


router.get('/cart',auth.checkLogin,function(req,res){
	if(req.session.cart){
		res.render('cart',{items: req.session.cart.items,totalPrice: req.session.cart.totalPrice});
	}
	else{
		res.send('add something in your cart first');
	}
})


module.exports = router;