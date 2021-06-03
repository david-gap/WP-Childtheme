/*!
 * All template base javascript functions
 *
 * @author      David Voglgsang
 * @version     1.2
 *
 */


/*==================================================================================
  SETTINGS
==================================================================================*/

'use strict';

/* Global values
/------------------------*/
const root = document.querySelector('html'),
      configuration = ajaxCall({action: 'configuration'}),
      language = root.getAttribute('lang'),
      isTouch = 'ontouchstart' in document.documentElement,
      body = root.querySelector('body'),
      header = body.querySelector('header'),
      mainMenu = header.querySelector('#menu-main-container'),
      hamburger = header.querySelector('.hamburger'),
      main = body.querySelector('main');

let position = root.scrollTop,
    scrollPosition = window.scrollY;


/* Touch Device
/------------------------*/
root.setAttribute('data-touch', isTouch);



/*==================================================================================
 BASE FUNCTIONS
==================================================================================*/

/* Debounce function
/------------------------*/
function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};


/* Unique id generator
/------------------------*/
let uniqueID = () => {
  return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}


/* Convert RGB color to HEX code
/------------------------*/
function rgb2hex(rgb) {
  rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  function hex(x) {
    return ("0" + parseInt(x).toString(16)).slice(-2);
  }
  return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}


/* Convert HEX code to RGB color
/------------------------*/
function hex2rgb(hex, opacity) {
  hex = hex.replace('#', '');
  r = parseInt(hex.substring(0,2), 16);
  g = parseInt(hex.substring(2,4), 16);
  b = parseInt(hex.substring(4,6), 16);
  result = 'rgba(' + r + ', ' + g + ', ' + b +', ' + opacity/100 + ')';
  return result;
}


/* Add css rule to stylesheet
/------------------------*/
// Example: addCSSRule(document.styleSheets[0], "header", "float: left");
function addCSSRule(sheet, selector, rules, index) {
  if("insertRule" in sheet) {
    sheet.insertRule(selector + "{" + rules + "}", index);
  }
  else if("addRule" in sheet) {
    sheet.addRule(selector, rules, index);
  }
}

/* Slugify string
/------------------------*/
function slugify(Text){
  return Text.toLowerCase()
  .replace(/ /g,'-')
  .replace(/ä/g,'ae')
  .replace(/Ä/g,'ae')
  .replace(/ö/g,'oe')
  .replace(/Ö/g,'oe')
  .replace(/ü/g,'ue')
  .replace(/Ü/g,'ue')
  .replace(/ß/g,'ss')
  .replace(/[^\w-]+/g,'');
}


/* Check if element is visible
/------------------------*/
function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}


/* AJAX function
Example of calling ajax:
var configuration = {
  action: 'action to run after ajax request is done',
  path: 'file_path/filename.php',
  other_vars: 'vars content'
};
ajaxCall(configuration);
/------------------------*/
function ajaxCall(getdata) {
  // function file path
  if(getdata.path){
    var ajaxFile = "/" + getdata.path;
  } else {
    var ajaxFile = "/ajax.php";
  }
  // ajax is active - disable reload
  if(event){
    event.preventDefault();
  }
  // get data ready for request
  var access = 'access=granted&';
  var sendData = Object.keys(getdata).map(function (key) {
    return "" + key + "=" + getdata[key]; // line break for wrapping only
  }).join("&");
  // start request
  var request = new XMLHttpRequest();
  request.open('POST', theme_directory + ajaxFile, true);
  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  request.onload = function() {
  if (this.status >= 200 && this.status < 400) {
      var results = JSON.parse(this.response);
      // console
      if(results.log){
        console.log(results.log);
      }
      // run function
      if(results.action){
        eval(results.action + '(' + this.response + ')');
      } else {
        // DEBUG: console.log("Action not defined in ajax function");
      }
    } else {
      // DEBUG: console.log("Ajax update failed");
    }
  };
  request.onerror = function() {
    // DEBUG: console.log("Ajax conection failed");
  };
  request.send(access + sendData);
}



/*==================================================================================
 THEME FUNCTIONS
==================================================================================*/

/* Settings from configuration file
/------------------------*/
function themeConfiguration(data){
  // check if file value exists and inline css are disabled
  if(data.content !== false && data.content.wp.HeaderCss !== "1"){
    // set color palette
    if(data.content.gutenberg && Array.isArray(data.content.gutenberg.ColorPalette)){
      // gutenberg is given and colors been added
      var colorPalette = data.content.gutenberg.ColorPalette;
      var keys = Object.keys(data.content.gutenberg.ColorPalette);
      for(var i=0; i<keys.length; i++){
        addCSSRule(document.styleSheets[0], 'body.frontend .has-' + slugify(colorPalette[i].key) + '-background-color', 'background-color: ' + colorPalette[i].value);
        addCSSRule(document.styleSheets[0], 'body.frontend .has-' + slugify(colorPalette[i].key) + '-color', 'color: ' + colorPalette[i].value);
      }
    }
  }
}


/* Sticky menu
/------------------------*/
function StickyMenu(action) {
  // get new scroll position and header height
  var scroll = window.scrollY,
      headerHeight = header.offsetHeight;
  if(action == "load" && body.classList.contains('stickyable') === false){
    // set main margin for sticky on load
    main.style.marginTop = headerHeight + 'px';
  } else {
    // check if header is stickyable
    if(body.classList.contains('stickyable') && scroll > scrollPosition){
      body.classList.add("sticky");
      // set main margin for sticky after scroll
      if(scroll > headerHeight || action == "load"){
        main.style.marginTop = headerHeight + 'px';
      }
    }
  }
  // reset sticky if sticky is not perminent
  if (scroll < headerHeight) {
    if(body.classList.contains('stickyable')){
      main.style.marginTop = '';
      body.classList.remove("sticky");
    }
  }
  // update main scroll position
  scrollPosition = scroll;
  // body css if page is not on top
  if(scrollPosition > 0){
    body.classList.add("scrolled");
  } else {
    body.classList.remove("scrolled");
  }
}
var debounceSticky = debounce(function() {
  StickyMenu();
}, 100);
var debounceStickyResize = debounce(function() {
  StickyMenu("load");
}, 100);
window.addEventListener('scroll', debounceSticky);
window.addEventListener('resize', debounceStickyResize);
window.onload = function() {
  StickyMenu("load");
};


/* Hamburger switch
/------------------------*/
function MenuToggler() {
  // show overlay
  mainMenu.classList.toggle("hidden_mobile");
  mainMenu.classList.toggle("hidden_desktop");
  // prevent content scrolling
  root.classList.toggle("noscroll");
  // identify active menu
  body.classList.toggle("active-menu");
}
if(hamburger) {
  hamburger.addEventListener('click', MenuToggler);
}


/* Action Links
/------------------------*/
// example: <span class="funcCall" data-ajax-action="true" data-action="DEMO" data-id="page">DEMO</span>
function funcCall(){
  // vars
  var get_ajax_action = this.getAttribute('data-ajax-action'),
      get_action = this.getAttribute('data-action'),
      get_id = this.getAttribute('data-id');
  // actions
  if(get_ajax_action){
    // run ajax function
    var config = {
      action: get_action,
      id: get_id
    };
    ajaxCall(config);
  } else if (get_action) {
    // run function
    eval(get_action + '()');
  }
}
var actionButtons = document.querySelectorAll('.funcCall');
if(actionButtons.length !== 0){
  Array.from(actionButtons).forEach(function(element) {
    element.addEventListener('click', funcCall);
    element.addEventListener('keypress', funcCall);
  });
}



/*==================================================================================
  THEME BLOCKS
==================================================================================*/

/* Toggle
/------------------------*/
function toggleBlock(){
  this.classList.toggle("active");
}
var toggleButtons = document.querySelectorAll('.toggle > .label');
if(toggleButtons.length !== 0){
  Array.from(toggleButtons).forEach(function(element) {
    element.addEventListener('click', toggleBlock);
    element.addEventListener('keypress', toggleBlock);
  });
}



/*==================================================================================
  FORM
==================================================================================*/

/* deselect radio button
/------------------------*/
function deselectRadioButtons(rootElement) {
  if(!rootElement) rootElement = document;
  if(!window.radioChecked) window.radioChecked = null;
  window.radioClick = function(e) {
    const obj = e.target;
    if(e.keyCode) return obj.checked = e.keyCode!=32;
    obj.checked = window.radioChecked != obj;
    window.radioChecked = obj.checked ? obj : null;
  }
  rootElement.querySelectorAll("input[type='radio']").forEach( radio => {
    radio.setAttribute("onclick", "radioClick(event)");
    radio.setAttribute("onkeyup", "radioClick(event)");
  });
}
deselectRadioButtons();



/*==================================================================================
  POP UP
==================================================================================*/

/* Create
/------------------------*/
function closePopUp(){
  // enable scrolling
  root.classList.remove('popup-noscroll');
  // hide and remove popup
  var popup = document.querySelector('.popup');
  popup.classList.add('closed');
  popup.remove();
}


/* Create
/------------------------*/
function loadPopUp(){
  const popup_close = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 24.9 24.9" style="enable-background:new 0 0 24.9 24.9;" xml:space="preserve"><rect x="-3.7" y="10.9" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -5.1549 12.4451)" fill="#fff" width="32.2" height="3"/><rect x="10.9" y="-3.7" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -5.1549 12.4451)" fill="#fff" width="3" height="32.2"/></svg>',
        popup_content = '<div class="popup closed" data-content="img-popup"><div class="popup-container"><span class="close">' + popup_close + '</span><div class="popup-content"></div></div></div>';
  // inser pop up
  body.insertAdjacentHTML('beforeend', popup_content);
  // disable scrolling and show popup
  setTimeout(function() {
    var popup = document.querySelector('.popup');
    root.classList.add('popup-noscroll');
    popup.classList.remove('closed');
    // add closing event
    var closePopUpButtons = document.querySelectorAll('.popup > .popup-container > .close');
    if(closePopUpButtons.length > 0){
      Array.from(closePopUpButtons).forEach(function(closeButton) {
        closeButton.addEventListener('click', closePopUp);
        closeButton.addEventListener('keypress', closePopUp);
      });
    }
  }, 500);
}
