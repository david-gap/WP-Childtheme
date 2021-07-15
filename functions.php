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
  1.1 LOAD THE CONFIGURATION FILE
2.0 GUTENBERG BLOCK TEMPLATES
  2.1 BLOCK TEMPLATES
  2.2 PATTERNS
3.0 CUSTOM FUNCTIONS
  3.1 CUSTOM FUNCTIONS DEMO
=======================================================*/


/*==================================================================================
  1.0 THEME CONFIGURATION
==================================================================================*/

/* 1.1 LOAD THE CONFIGURATION FILE
/------------------------*/
require_once( get_stylesheet_directory() . '/configuration.php' );



/*==================================================================================
  2.0 GUTENBERG
==================================================================================*/

  /* 2.1 BLOCK TEMPLATES
  /------------------------*/
  add_action( 'register_post_type_args', 'GutenbergBlock_templates', 10, 2 );

  function GutenbergBlock_templates( $args, $post_type ) {
    // can be inserted inside register_post_type

    if( 'CPTname' === $post_type):
      // lock options: all, insert
      $args[ 'template_lock' ] = 'all';
      $args[ 'template' ] = [
        [
          'core/heading', [
            'placeholder' => __( 'Subheadline', 'gutenbergtheme' )
          ]
        ],
        [
          'core/image', [
            'align' => 'center',
          ]
        ],
        [
          'core/paragraph', [
            'align' => 'left',
            'placeholder' => __( 'Incididunt aliquip culpa dolore amet sunt voluptate excepteur aliqua deserunt in cillum ullamco est sit.', 'gutenbergtheme' )
          ]
        ],
        [
          'core/text-columns', [
            'columns' => '3'
          ]
        ],
        [
          'core/columns', [
            'align' => 'wide'
          ],
          [
            [
              'core/paragraph', [
                'layout' => 'column-1',
                'placeholder' => 'Ipsum tempor amet incididunt consectetur sunt labore nulla veniam. Ipsum tempor amet incididunt consectetur sunt labore nulla veniam.'
              ]
            ],
            [
              'core/quote', [
                'layout' => 'column-2'
              ]
            ],
          ]
        ],
        [
          'core/separator'
        ]
      ];
    endif;

    return $args;
  }


  /* 2.2 PATTERNS
  /------------------------*/
  register_block_pattern(
    'template-custom-pattern',
    array(
        'title'       => __( 'Custom Pattern', 'Template' ),
        'categories'  => array('text'),
        'content'     => "<!-- wp:paragraph {\"className\":\"democlass\"} --><p class=\"democlass\">Pattern demo content</p><!-- /wp:paragraph -->",
    )
  );



/*==================================================================================
  3.0 CUSTOM FUNCTIONS
==================================================================================*/

  /* 3.1 CUSTOM FUNCTIONS DEMO
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





  register_post_meta(
       'post',
       'WPoffersDateStart',
       array(
           'single'       => true,
           'type'         => 'string',
           'show_in_rest' => true,
       )
   );



// $object_type = 'post';
// $meta_args = array( // Validate and sanitize the meta value.
//     // Note: currently (4.7) one of 'string', 'boolean', 'integer',
//     // 'number' must be used as 'type'. The default is 'string'.
//     'type'         => 'string',
//     // Shown in the schema for the meta key.
//     'description'  => 'A meta key associated with a string meta value.',
//     // Return a single value of the type.
//     'single'       => true,
//     // Show in the WP REST API response. Default: false.
//     'show_in_rest' => true,
// );
// register_meta( $object_type, 'WPoffersDateStart', $meta_args );



add_action( 'add_meta_boxes', 'WPoffers_Metabox' );
add_action('save_post', 'WPoffers_Metabox_save',  10, 2 );

function WPoffers_Metabox() {
      // dates
      add_meta_box(
          'post',
          __( 'Zeiten', 'WPgalleries' ),
          'WPoffersMetabox_Dates',
          'post',
          'side',
          'high'
      );
    }

    function WPoffersMetabox_Dates($object) {
      // vars
      global $post;
      $getDate_start = get_post_meta($post->ID, 'WPoffersDateStart', true);
      $output = '';

      $output .= '<div class="components-panel__row edit-post-post-visibility">';
        $output .= '<label for="WPoffersDateStart">' . __( 'Start', 'WPoffers' ) . '</label>';
        $output .= '<input type="text" id="WPoffersDateStart" name="WPoffersDateStart" value="' . $getDate_start . '">';
      $output .= '</div>';

      echo $output;
    }

  function WPoffers_Metabox_save($post_id) {
    if(isset( $_POST['post'] )):
      //Not save if the user hasn't submitted changes
      if( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ):
        return;
      endif;
      // Making sure the user has permission
      if( 'post' == $_POST['post'] ):
        if( ! current_user_can( 'edit_post', $post_id ) ):
          return;
        endif;
      endif;
    endif;
    // save custom meta boxes
    $metaFields = array('WPoffersDateStart');
    foreach( $metaFields as $metafield ){
      if(isset($_POST[$metafield])):
        update_post_meta($post_id, $metafield, $_POST[$metafield]);
      endif;
    }
  }









add_action( 'init', 'register_blog_taxonomy' );
function register_blog_taxonomy() {
  $args_one = array(
    'label' => __('Kommunikationsmittel', 'WPSeed'),
    'hierarchical' => true,
    'show_ui' => true,
    'query_var' => true,
    'show_in_rest' => true,
    'rewrite' => array( 'slug' => 'kommunikationsmittel' )
  );
  $args_two = array(
    'label' => __('Mediengattungen', 'WPSeed'),
    'hierarchical' => true,
    'show_ui' => true,
    'query_var' => true,
    'show_in_rest' => true,
    'rewrite' => array( 'slug' => 'mediengattungen' )
  );
  $args_three = array(
    'label' => __('Kunden', 'WPSeed'),
    'hierarchical' => true,
    'show_ui' => true,
    'query_var' => true,
    'show_in_rest' => true,
    'rewrite' => array( 'slug' => 'kunden' )
  );
  $args_four = array(
    'label' => __('Beitragstyp', 'WPSeed'),
    'hierarchical' => true,
    'show_ui' => true,
    'query_var' => true,
    'show_in_rest' => true,
    'rewrite' => array( 'slug' => 'beitragstyp' )
  );
  $args_five = array(
    'label' => __('Kampagne', 'WPSeed'),
    'hierarchical' => true,
    'show_ui' => true,
    'query_var' => true,
    'show_in_rest' => true,
    'rewrite' => array( 'slug' => 'kampagne' )
  );
  register_taxonomy( 'kommunikationsmittel', 'post', $args_one );
  register_taxonomy( 'mediengattungen', 'post', $args_two );
  register_taxonomy( 'kunden', 'post', $args_three );
  register_taxonomy( 'Beitragstyp', 'post', $args_four );
  register_taxonomy( 'Kampagne', 'post', $args_five );
}








add_action( 'init', 'register_cpt_Rooms' );

function register_cpt_Rooms() {
  $labels = array(
      'name' => __( 'Zimmer', 'WProoms' )
  );
  $args = array(
    'labels' => $labels,
    'hierarchical' => true,
    'description' => 'Zimmer',
    'supports' => array( 'title', 'author', 'editor', 'excerpt', 'thumbnail' ),
    'public' => true,
    'show_ui' => true,
    'show_in_menu' => true,
    'show_in_rest' => true,
    'menu_position' => 8,
    'menu_icon' => 'dashicons-admin-home',
    'show_in_nav_menus' => true,
    'publicly_queryable' => true,
    'exclude_from_search' => false,
    'has_archive' => true,
    'query_var' => true,
    'can_export' => true,
    'rewrite' => true
  );
  register_post_type( 'zimmer', $args );
}
