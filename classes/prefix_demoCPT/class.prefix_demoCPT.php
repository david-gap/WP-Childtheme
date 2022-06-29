<?php
/**
 * CPT DEMO
 * https://github.com/david-gap/classes
 *
 * @author      David Voglgsang
 * @version     0.1
 *
*/

/*=======================================================
Table of Contents:
---------------------------------------------------------
1.0 INIT & VARS
  1.1 CONFIGURATION
  1.2 ON LOAD RUN
  1.3 BACKEND ARRAY
  1.4 CPT REWRITE RULE
  1.5 EXCERPT
2.0 FUNCTIONS
  2.1 GET SETTINGS FROM CONFIGURATION FILE
  2.2 CREATE CPT
  2.3 ADD TAXONOMY
  2.4 CREATE META BOX
  2.5 REGISTER META
  2.6 SAVE METABOXES
3.0 OUTPUT
  3.1 BACKEND - OVERVIEW COLUMNS
  3.2 OVERVIEW COLUMNS
=======================================================*/


class prefix_demoCPT {

  /*==================================================================================
    1.0 INIT & VARS
  ==================================================================================*/

    /* 1.1 CONFIGURATION
    /------------------------*/
    /**
      * default vars
      * @param static bool $cptName: CPT Slug
    */
    private static $active = 0;
    static $cptName = 'cpt-demo';
    static $labels = array(
      'cpt' => array(
        'name' => 'Demo',
        'singular_name' => 'Eintrag',
        'add_new_item' => 'Eintrag',
        'edit_item' => 'Eintrag'
      ),
      'tax' => array(
        'democategory' => 'Kategorie'
      )
    );
    static $metaFields = array(
      // Use "BlockUrl" as key, if you wish to customize the link in the posts block
      // 'metaKey' => array(
      //   'label' => 'Custom field demo',
      //   'type' => 'text'
      // )
    );
    static $taxonomies = array(
      'democategory' => array(
        'label' => 'Kategorie',
        'hierarchical' => true,
        'query_var' => true,
        'show_ui' => true,
        'show_in_quick_edit' => true,
        'show_in_rest' => true,
        'rewrite' => array( 'slug' => 'democategory' )
      )
    );
    static $cptSetting = array(
      'hierarchical' => false,
      'description' => 'Demo CPT',
      'supports' => array( 'title', 'custom-fields', 'excerpt', 'thumbnail', 'revisions', 'editor', 'post-formats'),
      'public' => true,
      'show_ui' => true,
      'show_in_menu' => true,
      'show_in_rest' => false,
      'menu_position' => 34,
      'menu_icon' => 'dashicons-portfolio',
      'show_in_nav_menus' => true,
      'publicly_queryable' => true,
      'exclude_from_search' => false,
      'has_archive' => true,
      'query_var' => true,
      'can_export' => true
    );
    static $cptRewrite = '';
    static $cptOverviewColumns = array(
      'metaKey'
    );


    /* 1.2 ON LOAD RUN
    /------------------------*/
    public function __construct() {
      // update default vars with configuration file
      SELF::updateVars();
      if(SELF::$active == 1):
        // register cpt and redirect pages
        if(SELF::$cptName !== ''):
          add_action( 'init', array( $this, 'registerCPT' ) );
        endif;
        // add taxanomies
        if(isset(SELF::$taxonomies) && is_array(SELF::$taxonomies) && !empty(SELF::$taxonomies)):
          add_action( 'init', array( $this, 'registerTAX' ) );
        endif;
        // metaboxes
        if(isset(SELF::$metaFields) && is_array(SELF::$metaFields) && !empty(SELF::$metaFields)):
          add_action( 'add_meta_boxes', array( $this, 'registerMetabox' ) );
          // update meta boxes
          add_action('save_post', array( $this, 'registerMetabox_save' ),  10, 2 );
        endif;
        // metaboxes taxonomies
        if(isset(SELF::$metaFieldsTax) && is_array(SELF::$metaFieldsTax) && !empty(SELF::$metaFieldsTax)):
          foreach (SELF::$metaFieldsTax as $tax => $taxonomy) {
            add_action( $tax. '_edit_form_fields', array( $this, 'taxonomyCustomFields'), 10, 2 );
            add_action( 'edited_' . $tax, array( $this, 'save_taxonomyCustomFields'), 10, 2 );
          }
        endif;
        // default excerpt
        add_filter ( 'get_the_excerpt', array( $this, 'addExcerpt' ), 10, 2 );
        // overview columns
        if(!empty(SELF::$cptOverviewColumns)):
          add_filter('manage_' . SELF::$cptName . '_posts_columns', array( $this, 'overviewColumnsTitle' ));
          add_action('manage_posts_custom_column' , array( $this, 'overviewColumnsValues' ), 10, 2);
          add_filter('manage_edit-' . SELF::$cptName . '_sortable_columns', array( $this, 'sortableColumns' ));
        endif;
        // add cpt rewrite
        if(SELF::$cptRewrite !== ''):
          add_filter( 'register_post_type_args', array( $this, 'cptRewriteRule' ), 10, 2 );
        endif;
      endif;
    }

    /* 1.3 BACKEND ARRAY
    /------------------------*/
    static $classtitle = 'Configurator title';
    static $classkey = 'configurator-key';
    static $backend = array(
      "active" => array(
        "label" => "CPT Aktivieren",
        "type" => "switchbutton"
      ),
    );


    /* 1.4 CPT REWRITE RULE
    /------------------------*/
    function cptRewriteRule( $args, $post_type ) {
      if ( SELF::$cptName === $post_type ) {
        $args['rewrite']['slug'] = _x( SELF::$cptRewrite, 'slug', 'WPcpt' );
      }
      return $args;
    }


    /* 1.5 EXCERPT
    /------------------------*/
    function addExcerpt($post_excerpt, $post){
      if( $post->post_type == SELF::$cptName ):
        $output = $post_excerpt;
      else:
        $output = $post_excerpt;
      endif;

      return $output;
    }



  /*==================================================================================
    2.0 FUNCTIONS
  ==================================================================================*/


    /* 2.1 GET SETTINGS FROM CONFIGURATION FILE
    /------------------------*/
    private function updateVars(){
      // get configuration
      global $configuration;
      // if configuration file exists && class-settings
      if($configuration && array_key_exists('configurator-key', $configuration)):
        // class configuration
        $myConfig = $configuration['configurator-key'];
        // update vars
        SELF::$active = array_key_exists('active', $myConfig) ? $myConfig['active'] : SELF::$active;
      endif;
    }


    /* 2.2 CREATE CPT
    /------------------------*/
    function registerCPT() {
      // add labels
      $cptLabels = array();
      if(is_array(SELF::$labels) && array_key_exists('cpt', SELF::$labels) && is_array(SELF::$labels['cpt'])):
        foreach (SELF::$labels['cpt'] as $key => $value) {
          $cptLabels[$key] = __( $value, 'WPcpt' );
        }
      else:
        $cptLabels['name'] = __( SELF::$cptName, 'WPcpt' );
      endif;
      // default settings
      $default = array(
        'labels' => $cptLabels,
        'rewrite'  => array(
          'slug' => _x( SELF::$cptName, 'slug', 'WPcpt' ),
        )
      );
      // merge all informations
      $args = array_merge(SELF::$cptSetting, $default);
      // register
      register_post_type( SELF::$cptName, $args );
    }


    /* 2.3 ADD TAXONOMY
    /------------------------*/
    function registerTAX() {
      foreach(SELF::$taxonomies as $taxkey => $taxValues):
        if(is_array($taxValues)):
          if(is_array(SELF::$labels) && array_key_exists('tax', SELF::$labels) && is_array(SELF::$labels['tax']) && array_key_exists($taxkey, SELF::$labels['tax'])):
            $taxValues["label"] = __( SELF::$labels['tax'][$taxkey], 'WPcpt' );
          endif;
          register_taxonomy( $taxkey, SELF::$cptName, $taxValues );
        endif;
      endforeach;
    }


    /* 2.4 CREATE META BOX
    /------------------------*/
    function registerMetabox() {
      // dates
      add_meta_box(
          SELF::$cptName,
          __( 'Options', 'WPcpt' ),
          array($this, 'metabox_Form'),
          SELF::$cptName,
          'normal',
          'high'
      );
    }


    /* 2.5 REGISTER META
    /------------------------*/
    function registerMeta() {
      foreach( SELF::$metaFields as $metafield => $metafeildValues ){
        if(array_key_exists('label', $metafeildValues) && array_key_exists('type', $metafeildValues)):
          register_post_meta(
             SELF::$cptName,
             $metafield,
             array(
                 'single'       => true,
                 'type'         => 'string',
                 'show_in_rest' => true,
            )
          );
        endif;
      }
    }


    /* 2.6 SAVE METABOXES
    /------------------------*/
    public function registerMetabox_save($post_id) {
      if(isset( $_POST[SELF::$cptName] )):
        //Not save if the user hasn't submitted changes
        if( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ):
          return;
        endif;
        // Making sure the user has permission
        if( 'post' == $_POST[SELF::$cptName] ):
          if( ! current_user_can( 'edit_post', $post_id ) ):
            return;
          endif;
        endif;
      endif;
      // save custom meta boxes
      foreach( SELF::$metaFields as $metafield => $metafeildValues ){
        if(isset($_POST[$metafield])):
          update_post_meta($post_id, $metafield, $_POST[$metafield]);
        endif;
      }
    }
    // taxonomies
    function save_taxonomyCustomFields( $term_id ) {
      if ( isset( $_POST['term_meta'] ) ) {
        $t_id = $term_id;
        $term_meta = get_option( "taxonomy_term_$t_id" );
        $cat_keys = array_keys( $_POST['term_meta'] );
          foreach ( $cat_keys as $key ){
          if ( isset( $_POST['term_meta'][$key] ) ){
            $term_meta[$key] = $_POST['term_meta'][$key];
          }
        }
        //save the option array
        update_option( "taxonomy_term_$t_id", $term_meta );
      }
    }



  /*==================================================================================
    3.0 OUTPUT
  ==================================================================================*/

    /* 3.1 METABOX
    /------------------------*/
    function metabox_Form($object) {
      // vars
      global $post;
      echo prefix_core_BaseFunctions::metaBoxes($post->ID, SELF::$metaFields);
    }
    // taxonomies
    function taxonomyCustomFields($tag) {
      echo prefix_core_BaseFunctions::metaBoxes($tag->term_id, SELF::$metaFieldsTax[$tag->taxonomy], 'tax');
    }

    /* 3.2 OVERVIEW COLUMNS
    /------------------------*/
    function overviewColumnsTitle($columns) {
      $date = $columns['date'];
      // remove not needed columns
      // unset($columns['title']);
      // unset($columns['date']);
      // unset($columns['author']);
      // add fields
      foreach (SELF::$cptOverviewColumns as $key => $single) {
        $columns[$single] = SELF::$metaFields[$single]['label'];
      }
      // reset date
      $columns['date'] = $date;
      return $columns;
    }
    // columns values
    function overviewColumnsValues($column, $post_id) {
      foreach (SELF::$cptOverviewColumns as $key => $single) {
        if($column === $single):
          $value = get_post_meta($post_id, $single, true);
          if($value):
            echo $value;
          endif;
        endif;
      }
    }
    // make columns sortable
    function sortableColumns( $columns ) {
      foreach (SELF::$cptOverviewColumns as $key => $single) {
        $columns[$single] = $single;
      }
      return $columns;
    }

}
