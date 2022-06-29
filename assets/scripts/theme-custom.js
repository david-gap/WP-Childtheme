/*!
 * All template custom javascript functions
 *
 * @author      David Voglgsang
 * @version     1.1
 *
*/


/*==================================================================================
  AJAX FUNCTIONS
==================================================================================*/

  /* DEMO
  /------------------------*/
  function DEMO(){
    console.log("DEMO FUNC");
  }



/*==================================================================================
  ADDITIONAL FUNCTIONS
==================================================================================*/



/*==================================================================================
  FUNCTIONS TO REUSE
==================================================================================*/

  /* MENU
  /* close all open submenus by closing the menu
  /------------------------*/
  function subMenuToggler(){
    if(mainMenu) {
      var getSubmenu = mainMenu.querySelectorAll('.menu-item-has-children.active');
      if(getSubmenu.length !== 0){
        Array.from(getSubmenu).forEach(function(submenu) {
          submenu.classList.remove("active");
        });
      }
    }
  }
  hamburger.addEventListener('click', subMenuToggler);
  hamburgertitle.addEventListener('click', subMenuToggler);


  /* MENU
  /* open menu toggle of active page
  /------------------------*/
  function openAncestorsToggle(){
    if(mainMenu){
      var getAncestors = mainMenu.querySelectorAll('li.current_page_ancestor');
      if(getAncestors.length !== 0){
        Array.from(getAncestors).forEach(function(ancestor) {
          ancestor.classList.add("active");
        });
      }
    }
  }
  openAncestorsToggle();
