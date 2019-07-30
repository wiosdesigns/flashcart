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
  
  categories = [];
  
  for(var i=0;i<items.length;i++){
    if(!categories.includes(items[i].Category)){
      categories.push(items[i].Category);
    }
    items[i].quantity = 0;
    items[i].match = false;
    items[i]['In Stock'] = items[i]['In Stock'].toLowerCase();
    items[i]['Featured'] = items[i]['Featured'].toLowerCase();
  }
  
  Vue.component('shop-item',{
    props: ['name','image','category','unitprice','unit','instock','description','quantity','compact'],
    template: `
      <div class="shopitem">
        <img v-if="!compact" src="/inventory/images/b1.jpg">
        <span class="name">{{name}}</span>
        <span class="price">{{$parent.settings.currency}}{{unitprice}}/{{unit}}</span>
        <button v-on:click="$emit('plus')" v-if="instock=='yes' && quantity<1">Add to cart</button>
        <div class="qctrl" v-else-if="instock=='yes' && quantity>0">
          <span class="icon" v-on:click="$emit('minus')">r</span>
          <span>{{quantity}}</span>
          <span class="icon" v-on:click="$emit('plus')">a</span>
        </div>
        <span v-else class="outofstock">Out of Stock</span>
        <details v-if="!compact">
          <summary>Description</summary>
          {{description}}
        </details>
      </div>
    `
  });
  
  app = new Vue({
    el: "#app",
    data: {
      categories: categories,
      items: items,
      settings: settings,
      cartpage: false,
      name: '',
    },
    computed: {
      carttotal: function(){
        var t = 0;
        for(var i=0;i<this.items.length;c++){
          t += this.items[i].quantity*this.items[i]['Unit Price'];
        }
        return t;
      },
      nitems: function(){
        var n = 0;
        for(var i=0;i<this.items.length;i++){
          if(this.items[i].quantity>0) n++;
        }
        return n;
      },
      ordertext: function(){
        var s = `${app.name} would like to order the following items: \n\n`;
        for(var i=0;i<this.items.length;i++){
          if(this.items[i].quantity>0){
            s += `\n\n${this.items[i].Name}\nQuantity: ${this.items[i].quantity}`
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
      },
      search: function(){
        var query = document.querySelector('#searchquery').value;
        query = query.trim().toLowerCase();
        for(var i=0;i<app.items.length;i++){
          var target = app.items[i].Name.toLowerCase();
          if(target.includes(query)){
            app.items[i].match = true;
          }
          else{
            app.items[i].match = false;
          }
        }
      }
    }
  });
  hnav.init();
}

function goToOrder(){
  document.getElementById('placeorder').scrollIntoView();
}


