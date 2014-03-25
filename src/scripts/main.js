$(function () {
  'use strict';

  var $body = $('body');
  var $wrapper = $('.wrapper');
  var i = 0;
  var erectionCount = 100;
  var cumCount = 200;
  var finishedComing = false;
  var pfx = ['webkit', 'moz', 'MS', 'o', ''];
  var anim = document.getElementById('drop--main');
  var isTouch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0));
  var $tchau = $('#tchau');
  var lastX = 0;
  var lastY = 0;
  var tchauMessages = [
    'Thank you for coming.',
    'Please come again.',
    'Was it good for you?'
  ];

  function onMouseDown () {
    if (finishedComing) { return; }
    $body[0].addEventListener('mousemove', onMouseMove, false);
  }

  function onMouseMove () {
    i++;

    applyTransforms(10);
  }

  function onMouseUp () {
    $body[0].removeEventListener('mousemove', onMouseMove, false);
  }

  function clearMovements () {
    if (!isTouch) {
      onMouseUp();
    }

    else {
      window.removeEventListener('devicemotion', onMovements, false);
    }
  }

  function applyTransforms(position) {
    $wrapper.css({
      '-webkit-transform': 'translate3d(' + getRandomInt(-position*0.1, position*0.1) + 'px, ' + getRandomInt(-position, position) + 'px, 0)',
      '-moz-transform': 'translate3d(' + getRandomInt(-position*0.1, position*0.1) + 'px, ' + getRandomInt(-position, position) + 'px, 0)',
      'transform': 'translate3d(' + getRandomInt(-position*0.1, position*0.1) + 'px, ' + getRandomInt(-position, position) + 'px, 0)'
    });

    if (i > erectionCount) {
      $body.addClass('erected');

    }

    if (i > cumCount){
      $body.addClass('came');

      clearMovements();
    }
  }

  function onMovements () {
    var accelerationX = Math.floor(event.accelerationIncludingGravity.x);
    var accelerationY = Math.floor(event.accelerationIncludingGravity.y);

    if ( (lastX !== accelerationX) && lastY !== accelerationY ) {
      applyTransforms(10);
      lastX = accelerationX;
      lastY = accelerationY;
      i++;
    }
  }

  if (!isTouch) {
    $body[0].addEventListener('mousedown', onMouseDown, false);
    $body[0].addEventListener('mouseup', onMouseUp, false);
  }

  else {
    window.addEventListener('devicemotion', onMovements, false);
  }

  function climax () {
    finishedComing = true;
    $body.addClass('climax');
  }

  function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function prefixedEvent(element, type, callback) {
    for (var p = 0; p < pfx.length; p++) {
      if (!pfx[p]) { type = type.toLowerCase(); }
      element.addEventListener(pfx[p]+type, callback, false);
    }
  }

  prefixedEvent(anim, 'TransitionEnd', function () {
    climax();
  });

  $tchau.html(tchauMessages[getRandomInt (0, tchauMessages.length)]);

});
