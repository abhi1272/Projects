var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var productSchema = new Schema({
	name:{type: String , index: true},
	batchNo:String,
	expiryDate: Date,
	MRP: Number,
	quantity:Number

});

var Product = mongoose.model('Product',productSchema);

module.exports = Product;

module.exports.Cart = function Cart(oldCart) {
	this.items =  oldCart.items || {};
	this.totalQty = oldCart.totalQty || 0;
	this.totalPrice = oldCart.totalPrice || 0;


	this.add = function(item, id){
        
		var storeItem = this.items[id];
		if(!storeItem){
			storeItem = this.items[id] =  {item: item , qty: 0 , price: 0};
		}
		storeItem.qty++
		storeItem.price = storeItem.item.MRP * storeItem.qty;
		this.totalQty++
		this.totalPrice += storeItem.item.MRP;
	};

	this.subtract = function(item, id){
        
		var storeItem = this.items[id];
		if(!storeItem){
			storeItem = this.items[id] =  {item: item , qty: 0 , price: 0};
		}
		storeItem.qty--
		storeItem.price = storeItem.item.MRP * storeItem.qty;
		this.totalQty--
		this.totalPrice -= storeItem.item.MRP;
	};


	this.generateArray = function(){
		var arr = [];
		for (var id in this.items){
			arr.push(this.items[id]);
		}
		return arr
	};
};


