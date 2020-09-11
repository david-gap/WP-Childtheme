<?php
/**
 *
 *
 * Ajax actions
 *
 * @author      David Voglgsang
 * @version     1.1
 *
*/

// Get variables from ajax request
$access = isset($_POST['access']) ? $_POST['access'] : $_GET['access'];
$run_action = isset($_POST['action']) ? $_POST['action'] : $_GET['action'];

if($access == 'granted'):

  /* CONNECT TO DATABASE
  /===================================================== */
  $allow_connection = array('DEMO');
  if(in_array($run_action, $allow_connection)):
      $url = (!empty($_SERVER['HTTPS'])) ? "https://".$_SERVER['SERVER_NAME'].$_SERVER['REQUEST_URI'] : "http://".$_SERVER['SERVER_NAME'].$_SERVER['REQUEST_URI'];
      $url = $_SERVER['REQUEST_URI'];
      $my_url = explode('wp-content' , $url);
      $path = $_SERVER['DOCUMENT_ROOT']."/".$my_url[0];
      include_once $path . '/wp-config.php';
      include_once $path . '/wp-includes/wp-db.php';
      include_once $path . '/wp-includes/pluggable.php';
      include_once $path . '/wp-admin/includes/user.php';
  endif;



  /* DEMO FUNCTION
  /------------------------*/
  function DemoAjaxFunction(){
    $return = array(
      'action' => 'DEMO',  // run js function
      'log' => 'Log'       // return in the console
    );
    echo json_encode($return);
  }


  /* GET CONFIGURATION FILE
  /------------------------*/
  function getConfigurationFile(){
    // get file
    $configuration_file = 'configuration.json';
    // check if file exists or empty
    if(file_exists($configuration_file) && filesize($configuration_file) > 0):
      $configuration_content = file_get_contents($configuration_file);
      $configuration = json_decode($configuration_content,true);
    else:
      $configuration = false;
    endif;
    // output for js file
    $return = array(
      'action' => 'themeConfiguration',
      'content' => $configuration
    );
    echo json_encode($return);
  }



  /* RUN FUNCTIONS
  /===================================================== */
  switch ($run_action) {
    case "DEMO":
      DemoAjaxFunction();
      break;
    case "configuration":
      getConfigurationFile();
      break;

    default:
      echo "Keine Aktion definiert";
  }

else:
  $return = array(
    'log' => 'access denied'  // return in the console
  );
  echo json_encode($return);
endif;
