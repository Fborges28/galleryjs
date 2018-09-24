(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
function galleryJS(id, loopControl){
  this.galleryNode = document.querySelector("#"+id);
  this.galleryId = id;
  this.content = null;
  this.thumbs = null;
  this.sliders = null;
  this.currentSlider = 1;
  this.numOfSliders = 0;
  this.loopControl = loopControl || false;
  this.init();
}

galleryJS.prototype = {
  init: function(){
    this.setGalleryContent(this.galleryNode);
    this.setGallerySliders(this.galleryNode);
    this.setGalleryThumbnails(this.galleryNode);
    this.setSlidersPositions(this.sliders);
    this.setThumbActive(1);
    this.mouseEvents();
    this.windowEvents();
    return this;
  },
  setGalleryContent: function(gallery){
    var content = gallery.querySelector(".content");
    this.content = content;
    return this;
  },
  setGallerySliders: function(gallery){
    var contentSliders = this.nodeListToArray(this.content.querySelectorAll(".content-slider"));
    this.sliders = contentSliders;
    this.numOfSliders = contentSliders.length;
    return this;
  },
  setGalleryThumbnails: function(gallery){
    var thumbContainer = gallery.querySelector(".thumbnails");
    this.thumbs = thumbContainer;
    return this;
  },
  nodeListToArray: function(nodeList){
    var arrayList = [];
    var i;
    for(i = 0; i < nodeList.length; i++){
      arrayList.push(nodeList[i]);
    }
    return arrayList;
  },
  setSliderPosition: function(slider, position){
    slider.style.left = position + "px";
  },
  setSlidersPositions: function(sliders){
    this.sliders.forEach(function(slider, index){
      this.setSliderPosition(slider, slider.offsetWidth * index);
    }, this);
    return this;
  },
  getCurrentSlider: function(){
    return this.currentSlider;
  },
  minMaxIndex: function(){
    var minimum = 1;
    var maximum = this.numOfSliders;
    return {
      minimum: minimum,
      maximum: maximum
    }
  },
  indexLimiter: function(index){
    var minMax = this.minMaxIndex();
    index = index < minMax.minimum ? minMax.minimum : (index > minMax.maximum ? minMax.maximum: index);
    return index;
  },
  setCurrentSlider: function(index){
    index = this.indexLimiter(index);
    this.currentSlider = index;
  },
  moveSlider: function(direction, moveCallback){
    var minMax = this.minMaxIndex();
    var currentIndex = this.getCurrentSlider();
    var willLoop = false;
    var goToParam = 0;

    if(direction == "prev"){
      willLoop = currentIndex == minMax.minimum;
      goToParam = minMax.maximum;
    }else{
      willLoop = currentIndex == minMax.maximum;
      goToParam = minMax.minimum;
    }

    if(willLoop == false){
      this.sliders.forEach(function(slider, index){
        moveCallback(slider, index)
      }, this);
    }else{
      if(this.loopControl){
        this.goTo(goToParam);
        return false;
      }
    }

    if(direction == "prev"){
      currentIndex -= 1;
    }else{
      currentIndex += 1;
    }

    this.setCurrentSlider(currentIndex);
    this.setThumbActive(currentIndex);
  },
  prev: function(){
    this.moveSlider("prev", function(slider, index){
      this.setSliderPosition(slider, parseInt(slider.style.left) + slider.offsetWidth);
    }.bind(this));

    return this;
  },
  next: function(){
    this.moveSlider("next", function(slider, index){
      this.setSliderPosition(slider, parseInt(slider.style.left) - slider.offsetWidth);
    }.bind(this));
    return this;
  },
  goTo: function(index){
    var currentSlider = this.getCurrentSlider();
    var diff = 0;
    var counter;

    if(index > currentSlider){
      diff = index - currentSlider;
      for(counter = 0; counter < diff; counter++){
        this.next();
      }
    }else{
      diff = currentSlider - index;
      for(counter = 0; counter < diff; counter++){
        this.prev();
      }
    }

    this.setCurrentSlider(index);
  },
  setThumbActive: function(index){
    var thumbsList = this.nodeListToArray(this.thumbs.children);
    index = this.indexLimiter(index);

    for(var i=0; i<thumbsList.length; i++){
      thumbsList[i].classList.remove("active");
    }

    this.thumbs.children.item(index-1).classList.add("active");
  },
  mouseEvents: function(){
    this.galleryNode.getElementsByClassName("prev")[0].addEventListener("click", this.prev.bind(this), false);
    this.galleryNode.getElementsByClassName("next")[0].addEventListener("click", this.next.bind(this), false);
    this.thumbs.addEventListener("click", function(event){
      var el = event.target;
      var index = Array.prototype.slice.call(el.parentElement.children).indexOf(el) + 1;
      this.goTo(index);
    }.bind(this), false);
  },
  windowEvents: function(){
    //On resize end
    var self = this;
    var doit;
    window.onresize = function(){
      clearTimeout(doit);
      doit = setTimeout(function(){
        //console.log("redimensionou")
        self.setSlidersPositions(self.sliders);
      }, 100);
    };
  }
}

var firstGallery = new galleryJS("first-gallery", true);
var secondGallery = new galleryJS("second-gallery", true);

},{}]},{},[1]);
