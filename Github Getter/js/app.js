
(function(){
  console.log("I'm alive");
  function SearchHandler(inputUrl){
    this.inputUrl = inputUrl;
    this.element = document.getElementById("search");
    this.request = new XMLHttpRequest();
    this.container = document.getElementById("overlay-container");
    this.attachEventHandlers();
  }
  SearchHandler.prototype.handle = function(event){
    var key = event.key;
    if((key.length === 1 && key.match(/[a-z]/i)) || key === "Backspace"){
      console.log('we should search');
    }
    console.log("here is our url: ", this.inputUrl + this.element.value)
    this.request.open("GET",this.inputUrl + this.element.value,true);
    this.request.send();
  }

  SearchHandler.prototype.updateList = function(json){
    var items = json.items;
    var ul = document.getElementById("results-container");
    ul.innerHTML = "";
    var scope = this;
    console.log(items)
    items.forEach(function(item){
      // console.log(item.name, item.owner.login)
      var li = document.createElement("li");
      li.appendChild(document.createTextNode("Name: " + item.name + ", Owner: " + item.owner.login));
      li.onclick = scope.overlay(item);
      ul.appendChild(li);
    });
  }
  //closure magic
  SearchHandler.prototype.overlay = function(item){
    var scope = this;
    return function(){
      scope.container.style.display = 'block';
      document.getElementById("language").innerHTML = item.language?item.language:"None";
      document.getElementById("followers").innerHTML = item.owner.followers_url?item.owner.followers_url:"None";
      //git urls have to exist for a repo to exist.
      document.getElementById("url").innerHTML = item.git_url;
      document.getElementById("description").innerHTML = item.description?item.description:"None";
    }
  }

  SearchHandler.prototype.attachEventHandlers = function(){
    this.container.onclick = function(){
      this.style.display = 'none';
    }
    var scope = this;
    this.request.onreadystatechange = function(){
      try{
        if(this.responseText && this.readyState === 4 && this.status == 200){
          var json = JSON.parse(this.responseText);
          console.log('update:')
          scope.updateList(json);
        }
      } catch(e){
        console.log("oh shit waddup:");
        console.log(e);
      }
    }
  }

  document.addEventListener("DOMContentLoaded", function(){
    window.handler = new SearchHandler(" https://api.github.com/search/repositories?q=");
  });

})();
