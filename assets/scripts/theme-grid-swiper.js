/*!
 * Swiper & Grid gallery with popup
 *
 * @author      David Voglgsang
 * @version     1.2
 *
 */


/*==================================================================================
  SETTINGS
==================================================================================*/

/* Global values
/------------------------*/
const galleryArrow = '<svg xmlns="http://www.w3.org/2000/svg" width="60.043" height="113.137" viewBox="0 0 60.043 113.137"><path id="np_arrow_53562_FFFFFF" d="M30.457,114.121a3.473,3.473,0,0,1-4.912-4.912l50.635-50.64L25.545,7.929a3.475,3.475,0,0,1,4.917-4.912l53.089,53.1a3.476,3.476,0,0,1,0,4.917Z" transform="translate(84.57 115.138) rotate(180)" opacity="0.606"/></svg>',
      galleryArrowBefore = '<span class="arrow back hidden">' + galleryArrow + '</span>',
      galleryArrowAfter = '<span class="arrow next hidden">' + galleryArrow + '</span>';



/* Add ID to gallery
/------------------------*/
var activeGalleries = document.querySelectorAll('.gallery-swiper, .gallery-grid');
if(activeGalleries.length > 0){
  Array.from(activeGalleries).forEach(function(gallery) {
    // open pop-up
    gallery.setAttribute('data-id', uniqueID());
  });
}



/*==================================================================================
  SWIPER
==================================================================================*/

/* Add navigation arrows
/------------------------*/
function addNavArrows(gallery){
  gallery.insertAdjacentHTML('afterbegin', galleryArrowBefore);
  gallery.insertAdjacentHTML('beforeend', galleryArrowAfter);
  var getcolumnssum    = gallery.closest(".gallery-swiper").getAttribute('data-columns'),
      columnssum       = getcolumnssum === null ? 1 : parseInt(getcolumnssum);
  // show next arrow if more elements exist
  var galleryChildren = gallery.querySelectorAll('ul li');
  if (galleryChildren.length > 1 && columnssum < galleryChildren.length) {
    var arrowNext = gallery.querySelector('.next');
    arrowNext.classList.remove('hidden');
  }
  // add events to each arrow
  var arrows = document.querySelectorAll('.gallery-swiper .arrow');
  if(arrows.length > 0){
    Array.from(arrows).forEach(function(arrow) {
      arrow.addEventListener('click', clickArrow);
      arrow.addEventListener('keypress', clickArrow);
    });
  }
}


/* Click on arrow
/------------------------*/
function clickArrow(){
  // get values
  var parent           = this.closest(".gallery-swiper"),
      getcolumnssum    = this.closest(".gallery-swiper").getAttribute('data-columns'),
      getcolumnspacing = this.closest(".gallery-swiper").getAttribute('data-columnspace'),
      container        = parent.getElementsByTagName('ul'),
      arrowBack        = parent.querySelector('.back'),
      arrowNext        = parent.querySelector('.next');
  // do math
  var columnssum       = getcolumnssum === null ? 1 : parseInt(getcolumnssum),
      columnspacing    = columnspacing === null ? 0 : parseInt(getcolumnspacing),
      totalWidth       = container.[0].scrollWidth,
      stepSize         = container.[0].children.[0].clientWidth + (isNaN(columnspacing) ? 0 : columnspacing),
      backStep         = container.[0].scrollLeft - stepSize,
      nextStep         = container.[0].scrollLeft + stepSize,
      maxRight         = totalWidth - (stepSize * columnssum);
  // move slider
  if (this.classList.contains('back')) {
    var offset = backStep;
  } else if (this.classList.contains('next')) {
    var offset = nextStep;
  }
  container.[0].scroll({
    left: offset,
    behavior: 'smooth'
  })
  // toggle arrow visibility
  if(offset == 0 || offset < stepSize){
    arrowBack.classList.add('hidden');
  } else {
    arrowBack.classList.remove('hidden');
  }
  if(offset == maxRight || offset > maxRight){
    arrowNext.classList.add('hidden');
  } else {
    arrowNext.classList.remove('hidden');
  }
  // debug
  // console.log("columns: " + columnssum);
  // console.log("columns spacing: " + columnspacing);
  // console.log("step size: " + stepSize);
  // console.log("offset: " + offset);
  // console.log("max right: " + maxRight);
  // console.log("step size: " + stepSize);
}

/* Check for active swipers
/------------------------*/
var activeSwipers = document.querySelectorAll('.gallery-swiper');
if(activeSwipers.length > 0){
  Array.from(activeSwipers).forEach(function(swiper) {
    // add arrows to dom
    addNavArrows(swiper);
  });
}

/*==================================================================================
POP-UP
==================================================================================*/

/* Check arrows
/------------------------*/
function checkImgArrows(imgParent){
  var popupArrowBack = document.querySelector('.popup > .popup-container > .back');
  var popupArrowNext = document.querySelector('.popup > .popup-container > .next');
  // back
  if (imgParent.previousElementSibling === null) {
    popupArrowBack.classList.add('hidden');
  } else {
    popupArrowBack.classList.remove('hidden');
  }
  // next
  if (imgParent.nextSibling === null) {
    popupArrowNext.classList.add('hidden');
  } else {
    popupArrowNext.classList.remove('hidden');
  }
}

/* Get next image
/------------------------*/
function getNextImg(){
  // get current img
  var currentPopUp = document.querySelector('.popup > .popup-container > .popup-content'),
      currentPopUpID = currentPopUp.getAttribute('data-id'),
      currentImg = document.querySelector('.popup > .popup-container > .popup-content > img'),
      currentImgID = currentImg.getAttribute('data-id'),
      imgInGallery = document.querySelector('[data-id="' + currentPopUpID + '"] img[data-id="' + currentImgID + '"]'),
      imgInGalleryParent = imgInGallery.closest('li');
  // get next img
  if(this.classList.contains('next')){
    var newImgParent = imgInGalleryParent.nextSibling;

  } else if (this.classList.contains('back')) {
    var newImgParent = imgInGalleryParent.previousSibling;
  }
  var newImg = newImgParent.querySelector('img');
  document.querySelector('.popup > .popup-container > .popup-content').innerHTML = '';
  document.querySelector('.popup > .popup-container > .popup-content').appendChild(newImg.cloneNode());
  // update arrows
  checkImgArrows(newImgParent);
  // update preview images
  PreviewImages(newImg);
}

/* Get preview images
/------------------------*/
function PreviewImages(currentImg){
  // get images
  var imgInGalleryParent = currentImg.closest('li');
  var nextImg = imgInGalleryParent.nextSibling;
  var prevImg = imgInGalleryParent.previousSibling;
  // reset preview images
  document.querySelector('.popup > .popup-next-preview').innerHTML = '';
  document.querySelector('.popup > .popup-back-preview').innerHTML = '';
  // add preview images
  if (nextImg !== null) {
    document.querySelector('.popup > .popup-next-preview').appendChild(nextImg.querySelector('img').cloneNode());
  }
  if (prevImg !== null) {
    document.querySelector('.popup > .popup-back-preview').appendChild(prevImg.querySelector('img').cloneNode());
  }
}


/* Create
/------------------------*/
function loadGalleryPopUp(){
  // load pop up
  loadPopUp();
  // load content
  setTimeout(function(self) {
    // insert image and arrows
    var popupContainer = document.querySelector('.popup > .popup-container > .popup-content');
    popupContainer.insertAdjacentHTML('beforebegin', galleryArrowBefore);
    popupContainer.appendChild(self.cloneNode());
    popupContainer.insertAdjacentHTML('afterend', galleryArrowAfter);
    // add id of current gallery
    var currentGallery = self.closest('.add-popup');
    popupContainer.setAttribute('data-id', currentGallery.getAttribute('data-id'));
    // check for preview images
    if(currentGallery.classList.contains('popup-preview')){
      // insert container for preview images
      document.querySelector('.popup').insertAdjacentHTML('afterbegin', '<div class="popup-back-preview"></div>');
      document.querySelector('.popup').insertAdjacentHTML('beforeend', '<div class="popup-next-preview"></div>');
      // define popup to be with preview
      document.querySelector('.popup > .popup-container').classList.add('popup-preview');
      // get preview images
      PreviewImages(self);
    }
    // show arrows
    var parentLi = self.closest('li');
    // event for arrows
    var arrows = document.querySelectorAll('.popup > .popup-container > .arrow');
    if(arrows.length > 0){
      Array.from(arrows).forEach(function(arrow) {
        arrow.addEventListener('click', getNextImg);
        arrow.addEventListener('keypress', getNextImg);
      });
    }
    // update arrows
    checkImgArrows(parentLi);
  }, 100, this);
}


/* Check for active swipers/grid without url
/------------------------*/
var activeGalleryPopUps = document.querySelectorAll('.add-popup > ul > li > figure > img');
if(activeGalleryPopUps.length > 0){
  Array.from(activeGalleryPopUps).forEach(function(popup) {
    // open pop-up
    popup.addEventListener('click', loadGalleryPopUp);
    popup.addEventListener('keypress', loadGalleryPopUp);
  });
}
