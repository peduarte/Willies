$(function () {

  var $body = $('body');
  var $wrapper = $('.wrapper');
  var i = 0;
  var erectionCount = 100;
  var cumCount = 300;
  var finishedComing = false;
  var pfx = ['webkit', 'moz', 'MS', 'o', ''];
  var anim = document.getElementById('drop--main');

  $body[0].addEventListener('mousedown', onMouseDown, false);
  $body[0].addEventListener('mouseup', onMouseUp, false);


  function onMouseDown () {
    if (finishedComing) { return; }
    $body[0].addEventListener('mousemove', onMouseMove, false);
  }

  function onMouseMove () {
    i++;

    applyTransforms(10);

    if (i > erectionCount) {
      $body.addClass('erected');

    }

    if (i > cumCount){
      console.log('cuuuum -> ');
      $body.addClass('came');
      onMouseUp();
    }
  }

  function onMouseUp () {
    $body[0].removeEventListener('mousemove', onMouseMove, false);
  }

  function applyTransforms(position) {
    $wrapper.css({
      '-webkit-transform': 'translate3d(' + getRandomInt(-position*0.1, position*0.1) + 'px, ' + getRandomInt(-position, position) + 'px, 0)',
      '-moz-transform': 'translate3d(' + getRandomInt(-position*0.1, position*0.1) + 'px, ' + getRandomInt(-position, position) + 'px, 0)',
      'transform': 'translate3d(' + getRandomInt(-position*0.1, position*0.1) + 'px, ' + getRandomInt(-position, position) + 'px, 0)'
    });
  }

  function climax () {
    console.log('climax -> ');
    finishedComing = true;
  }

  function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function PrefixedEvent(element, type, callback) {
    for (var p = 0; p < pfx.length; p++) {
      if (!pfx[p]) type = type.toLowerCase();
      element.addEventListener(pfx[p]+type, callback, false);
    }
  }

  PrefixedEvent(anim, 'AnimationEnd', function () {
    climax();
  });

});
