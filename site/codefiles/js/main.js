let items;
let inventory;
let categories;

function init(){
  Papa.parse("/inventory/inventory.csv", {
	  download: true,
	  header: true,
	  complete: function(results) {
		  items = results.data;
		  items_loaded();
	  }
  });
}

function items_loaded(){
  document.getElementById("loading").style.display = "none";
  document.getElementById("app").style.display = "inline-block";
  if(items[items.length-1]['Name']==""){
    items.pop();
  }
  
  inventory = {};
  categories = [];
  
  for(var i=0;i<items.length;i++){
    if(!categories.includes(items[i].Category)){
      categories.push(items[i].Category);
      inventory[items[i].Category] = [];
    }
    items[i].quantity = 0;
    items[i]['In Stock'] = items[i]['In Stock'].toLowerCase();
    items[i].showDesc = false;
    if(items[i]['In Stock']=='yes'){
      inventory[items[i].Category].push(items[i])
    }
  }
  
  app = new Vue({
    el: "#app",
    data: {
      categories: categories,
      inventory: inventory,
      settings: settings,
      cartpage: false,
      name: '',
    },
    computed: {
      carttotal: function(){
        var t = 0;
        for(var c=0;c<this.categories.length;c++){
          var ca = this.inventory[this.categories[c]];
          for(var i=0;i<ca.length;i++){
            t += ca[i].quantity*ca[i]['Unit Price'];
          }
        }
        return t;
      },
      nitems: function(){
        var n = 0;
        for(var c=0;c<this.categories.length;c++){
          var ca = this.inventory[this.categories[c]];
          for(var i=0;i<ca.length;i++){
            if(ca[i].quantity>0) n++;
          }
        }
        return n;
      },
      ordertext: function(){
        var s = `${app.name} would like to order the following items: \n\n`;
        for(var c=0;c<this.categories.length;c++){
          var ca = this.inventory[this.categories[c]];
          for(var i=0;i<ca.length;i++){
            if(ca[i].quantity>0){
              s += `\n\n${ca[i].Name}\nQuantity: ${ca[i].quantity}`
            }
          }
        }
        return s
        
      } 
    },
    methods: {
      orderwa: function(){
        location.href = `https://wa.me/${app.settings.shopphone}/?text=${encodeURIComponent(app.ordertext)}`;
      },
      ordersms: function(){
        location.href = `sms:${app.settings.shopphone}?body=${encodeURIComponent(app.ordertext)}`;
      },
      orderemail: function(){
        location.href = `mailto:${app.settings.shopemail}?subject=Order%20from%20${name}&body=${encodeURIComponent(app.ordertext)}`;
      }
    }
  });
  
  hnav.init();
}

function goToOrder(){
  document.getElementById('placeorder').scrollIntoView();
}


