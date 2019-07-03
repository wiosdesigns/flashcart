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
    inventory[items[i].Category].push(items[i])
  }
  
  app = new Vue({
    el: "#app",
    data: {
      categories: categories,
      inventory: inventory,
    }
  });
  
  hnav.init();
}
