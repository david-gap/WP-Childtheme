/*!
 * All template base javascript functions
 *
 * @author      David Voglgsang
 * @version     1.0
 *
 */


/*==================================================================================
  SETTINGS
==================================================================================*/

/* Global values
/------------------------*/
var root = document.querySelector('html'),
    configuration = ajaxCall({action: 'configuration'}),
    language = root.getAttribute('lang'),
    isTouch = 'ontouchstart' in document.documentElement,
    position = root.scrollTop,
    body = root.querySelector('body'),
    header = body.querySelector('header'),
    mainMenu = header.querySelector('#menu-main-container'),
    hamburger = header.querySelector('.hamburger'),
    main = body.querySelector('main'),
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
        addCSSRule(document.styleSheets[0], '.has-' + slugify(colorPalette[i].key) + '-background-color', 'background-color: ' + colorPalette[i].value);
        addCSSRule(document.styleSheets[0], '.has-' + slugify(colorPalette[i].key) + '-color', 'color: ' + colorPalette[i].value);
      }
    }
  }
}


/* Sticky menu
/------------------------*/
function StickyMenu(action) {
  // check if sticky is active from load
  if (body.classList.contains('sticky_onload')) {
    var onload = true;
    window.removeEventListener('scroll', debounceSticky);
  } else {
    var onload = false;
  }
  // get new scroll position and header height
  var scroll = window.scrollY,
      headerHeight = header.offsetHeight
  // set sticky
  if(body.classList.contains('stickyable') && (scroll > scrollPosition && onload == false || action == "load")) {
    if(scroll > headerHeight || onload == true){
        body.classList.add("sticky");
        main.style.marginTop = headerHeight + 'px';
      }
  } else {
    if(body.classList.contains('stickyable') && scroll < headerHeight && onload == false){
      body.classList.remove("sticky");
      main.style.marginTop = '';
    }
  }
  // update main scroll position
  scrollPosition = scroll;
}
var debounceSticky = debounce(function() {
  StickyMenu();
}, 100);
window.addEventListener('scroll', debounceSticky);
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
hamburger.addEventListener('click', MenuToggler);


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
    var configuration = {
      action: get_action,
      id: get_id
    };
    ajaxCall(configuration);
  } else if (get_action) {
    // run function
    eval(get_action + '()');
  }
}
var actionButtons = document.querySelectorAll('.funcCall');
Array.from(actionButtons).forEach(function(element) {
  element.addEventListener('click', funcCall);
  element.addEventListener('keypress', funcCall);
});



/*==================================================================================
  THEME BLOCKS
==================================================================================*/

/* Toggle
/------------------------*/
function toggleBlock(){
  this.classList.toggle("active");
}
var actionButtons = document.querySelectorAll('.toggle > .label');
Array.from(actionButtons).forEach(function(element) {
  element.addEventListener('click', toggleBlock);
  element.addEventListener('keypress', toggleBlock);
});
