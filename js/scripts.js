$(function () {

	var $body = $('body');
	var $wrapper = $('.wrapper');
	var i = 0;
	var erectionCount = 100;
	var erected = false;

	$body[0].addEventListener('mousedown', onMouseDown, false);
	$body[0].addEventListener('mouseup', onMouseUp, false);


	function onMouseDown () {
		if (erected) { return; }
		$body[0].addEventListener('mousemove', onMouseMove, false);
	}

	function onMouseMove () {
		i++;

		applyTransforms(10);

		if (i > erectionCount) {
			erected = true;
			$body.addClass('erected');
			onMouseUp();
		}
	}

	function onMouseUp () {
		$body[0].removeEventListener('mousemove', onMouseMove, false);
	}

	function applyTransforms(position) {
		console.log('transform -> ');
	  $wrapper.css({
	    '-webkit-transform': 'translate3d(' + getRandomInt(-position/4, position/4) + 'px, ' + getRandomInt(-position, position) + 'px, 0)',
      '-moz-transform': 'translate3d(' + getRandomInt(-position/4, position/4) + 'px, ' + getRandomInt(-position, position) + 'px, 0)',
      'transform': 'translate3d(' + getRandomInt(-position/4, position/4) + 'px, ' + getRandomInt(-position, position) + 'px, 0)'
	  });
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

 /* PrefixedEvent(anim, 'AnimationEnd', function () {
    climax();
  });*/

});
