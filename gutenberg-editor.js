wp.blocks.registerBlockStyle( 'core/group', [{
  name: 'fullheight',
  label: 'Full height',
  isDefault: false,
},
{
  name: 'content-container',
  label: 'Content centered',
  isDefault: false,
},{
  name: 'content-wide-container',
  label: 'Content centered wide',
  isDefault: false,
}] );

wp.blocks.registerBlockStyle( 'core/cover', [{
  name: 'content-container',
  label: 'Content centered',
  isDefault: false,
},{
  name: 'content-wide-container',
  label: 'Content centered wide',
  isDefault: false,
},{
  name: 'no-spacing',
  label: 'Witout spacing',
  isDefault: false,
},{
  name: 'cover-zoomer',
  label: 'Zoom Animation',
  isDefault: false,
}] );

wp.blocks.registerBlockStyle( 'core/list', [{
  name: 'default',
  label: 'Customizer'
}] );

wp.blocks.registerBlockStyle( 'core/paragraph', [{
  name: 'lead',
  label: 'Lead'
}] );

wp.blocks.registerBlockStyle( 'core/heading', [{
  name: 'post-title',
  label: 'Seiten Titel',
  isDefault: false,
},{
  name: 'title-one',
  label: 'Title 1',
  isDefault: false,
},{
  name: 'title-two',
  label: 'Title 2',
  isDefault: false,
},{
  name: 'title-three',
  label: 'Title 3',
  isDefault: false,
}] );

wp.blocks.registerBlockStyle( 'core/columns', [{
  name: 'columns-has-background-gap',
  label: 'Abstand wie mit Hintergrundfarbe'
}] );

wp.blocks.registerBlockStyle( 'core/buttons', [{
  name: 'buttons-absolute-top',
  label: 'Absolute to top'
},{
  name: 'buttons-absolute-bottom',
  label: 'Absolute to bottom'
},{
  name: 'buttons-absolute-right',
  label: 'Absolute to right'
},{
  name: 'buttons-absolute-left',
  label: 'Absolute to left'
}] );


// wp.blocks.registerBlockStyle( 'core/image', {
//   name: 'css-name',
//   label: 'CSS Label',
//   isDefault: false,
// } );
