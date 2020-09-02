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
2.0 GUTENBERG BLOCK TEMPLATES
  2.1 BLOCK TEMPLATES
  2.2 PATTERNS
3.0 CUSTOM FUNCTIONS
  3.1 CUSTOM FUNCTIONS DEMO
=======================================================*/


/*==================================================================================
  1.0 THEME CONFIGURATION
==================================================================================*/
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
