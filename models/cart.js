module.exports = function cart(oldCart){
  this.items = oldCart.items;
  this.totalQty = oldCart.totalQty;
  this.totalPrice = oldCart.totalPrice;

  this.add = function(item,id){
    var storedItem = this.items[id];
    if(!storedItem){
      storedItem = this.items[id] = {item:item,qty:0,price:0}
    }
    storedItem.qty++;
    storedItem.price += item.discountedPrice;
    this.totalQty++;
    this.totalPrice += item.discountedPrice
  }
  this.change = function(id,change){
    var oldQty =   this.items[id].qty
    var oldPrice = this.items[id].price;
    this.items[id].qty = change;
    this.items[id].price = this.items[id].item.discountedPrice*change;
    if(oldQty > change){
      this.totalQty -= (oldQty - change);
      this.totalPrice -= (oldPrice - change*this.items[id].item.discountedPrice);
    }else{
      this.totalQty += (change - oldQty);
      this.totalPrice += (change*this.items[id].item.discountedPrice - oldPrice);
    }

  }
  this.remove = function(id){
    this.totalPrice -= this.items[id].price;
    this.totalQty -= this.items[id].qty;
    delete this.items[id]
  }
  this.genArray = function(){
    var arr = [];
    for(var id in this.items){
      arr.push(this.items[id])
    }
    return arr;
  }

}
