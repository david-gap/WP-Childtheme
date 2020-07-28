<?php
/**
 * Main Functions File - used for:
 * • including configuration file
 * • custom functions
 *
 * @author      David Voglgsang
 * @since       1.0
 *
*/

/*=======================================================
Table of Contents:
---------------------------------------------------------
1.0 THEME CONFIGURATION
2.0 CUSTOM FUNCTIONS
  2.1 CUSTOM FUNCTIONS DEMO
=======================================================*/


/*==================================================================================
  1.0 THEME CONFIGURATION
==================================================================================*/
require_once( get_stylesheet_directory() . '/configuration.php' );


/*==================================================================================
  2.0 CUSTOM FUNCTIONS
==================================================================================*/

  /* 2.1 CUSTOM FUNCTIONS DEMO
  /------------------------*/
  /**
    * do not forget to describe/document your function and parameters
    * @param array $array: used for...
    * @param string $string: used for...
    * @param bool $bool: used for...
  */
  function DemoFunction(array $array = array(), string $string = "", bool $bool = true){
    // Do something
  }
