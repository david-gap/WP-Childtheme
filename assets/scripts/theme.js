/*!
 * All sorts javascript/jQuery functions
 *
 * @author      David Voglgsang
 * @version     0.3
 * @since       0.1
 *
 */


/*==================================================================================
  Functions
==================================================================================*/
jQuery(function ($) {

/* Touch Device
/------------------------*/
var $root = $('html');
var isTouch = 'ontouchstart' in document.documentElement;
if (isTouch) {
  $root.attr('data-touch', 'true');
} else {
  $root.attr('data-touch', 'false');
}

/* Global Settings
/------------------------*/
// custom vars that need to be global

  // get current language
  var active_lang = $('html').attr('data-lang');
  // get scroll position
  var position = $(window).scrollTop();


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
        var ajax_file = "/" + getdata.path;
      } else {
        var ajax_file = "/config/ajax.php";
      }
      // ajax is active - disable reload
      event.preventDefault();
      // ajax
      $.ajax({
        url: theme_directory + ajax_file,
        type: 'POST',
        data: getdata,
        success: function(data) {
          // DEBUG: console.log("Ajax update success");
          // DEBUG: console.log(data);
          var result = jQuery.parseJSON( data );
          // console
          if(result.log){
            console.log(result.log);
          }
          // run function
          if(getdata.action){
            eval(getdata.action + '("' + data + '")');
          } else {
            console.log("Action not defined in ajax function");
          }
        },
        error:function(){
          // DEBUG: console.log("Ajax update failed");
        }
      });
  }


  /* Click action
  /------------------------*/
  $(document).on('click', '.funcCall', function (e) {
    // vars
    var get_ajax_action = $(this).attr('data-ajax-action'),
        get_action = $(this).attr('data-action'),
        get_id = $(this).attr('data-id');
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
  });
  // accessibility
  $(".funcCall").keypress(function (e) {
    // vars
    var get_ajax_action = $(this).attr('data-ajax-action'),
        get_action = $(this).attr('data-action'),
        get_id = $(this).attr('data-id');
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
  });


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

  /* Sticky menu
  /------------------------*/
  function StickyMenu(action) {
    // get new scroll position
    var scroll = $(window).scrollTop(),
    header = $('header').outerHeight();
    if(scroll > position || action == "load") {
        if(scroll > header){
          $('body.stickyable').addClass('sticky');
          $("body.stickyable").css("padding-top",header);
        }
    } else {
      // $('body.stickyable').removeClass('sticky');
      if(scroll < header){
        $('body.stickyable').removeClass('sticky');
        $("body.stickyable").css("padding-top",'');
      }
    }
    // update main scroll position
    position = scroll;
  }
  var myEfficientFn = debounce(function() {
    StickyMenu();
  }, 100);
  window.addEventListener('scroll', myEfficientFn);


  /* Hamburger switch
  /------------------------*/
  // Menu toggler
  function MenuToggler() {
    // show overlay
    $('#menu-main-container').toggleClass('hidden_mobile');
    $('#menu-main-container').toggleClass('hidden_desktop');
    // prevent content scrolling
    $('html').toggleClass('noscroll');
    // identify active menu
    $('body').toggleClass('active-menu');
  }
  // execute hamburger click
  $(function(){
    $(document).on('click', '.hamburger', function (event) {
      // handle menu classes
      MenuToggler();
    });
  });


  /* PAGE READY
  /------------------------*/
  $(document).ready(function () {
    // reset sticky menu
    StickyMenu("load");
  });



  /*==================================================================================
    BLOCKS
  ==================================================================================*/

  /* Toggle
  /------------------------*/
  $(document).on('click', '.toggle > .label', function (event) {
    $(this).toggleClass('active');
  });
  // accessibility
  $(".toggle > .label").keypress(function (e) {
     if (e.which == 13) {
         $(this).toggleClass('active');
     }
  });

});
