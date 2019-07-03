hnav = {};
hnav.disp = 'block';
hnav.pages = {};
hnav.start = '';
hnav.init = function(){
  var pages = document.getElementsByClassName('hnav');
  for(var i=0;i<pages.length;i++){
    var page = pages[i];
    page.style.display = 'none';
    hnav.pages[page.id] = {};
    hnav.pages[page.id].el = page;
    if(page.hasAttribute('hnav:start')){
      hnav.page = page.id;
      hnav.start = page.id;
      if(page.hasAttribute('hnav:disp')){
        page.style.display = page.getAttribute('hnav:disp');
      }
      else{
        page.style.display = hnav.disp;
      }
    }
  }
  document.body.onhashchange = hnav.change;
  hnav.change();
}
hnav.change = function(){
  var hash = location.hash.slice(1);
  if(hash==''){
    hash = hnav.start;
  }
  if(hnav.pages[hash]){
    var oldpage = hnav.pages[hnav.page].el;
    var newpage = hnav.pages[hash].el;

    if(oldpage.hasAttribute('hnav:off')){
      eval(oldpage.getAttribute('hnav:off'));
    }
    oldpage.style.display = 'none';
    
    if(newpage.hasAttribute('hnav:disp')){
      newpage.style.display = newpage.getAttribute('hnav:disp');
    }
    else{
      newpage.style.display = hnav.disp;
    }
    if(newpage.hasAttribute('hnav:on')){
      eval(newpage.getAttribute('hnav:on'));
    }
    hnav.page = hash;

  }
}
