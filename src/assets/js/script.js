'use strict';

let checkoxes    = document.querySelectorAll('input[name="condition"]');
let currentSlide = 0;
let prev    = document.querySelectorAll('.prev');
let next    = document.querySelectorAll('.next');
let sliders = document.querySelectorAll('#units .slider');
let toggle  = document.querySelector('#toggle_menu');
let header  = document.querySelector('header');
let mobMenu = document.querySelector('.mob_menu');
let close   = document.querySelector('#close');


for (let i = 0; i <= sliders.length-1; i++) {
	sliders[i].setAttribute('data-slider', i);
	let prev = sliders[i].querySelector('.prev');
	let next = sliders[i].querySelector('.next');
	prev.setAttribute('data-prev', i);
	next.setAttribute('data-next', i);
};

let showMenu = () => {
	header.classList.toggle('open_menu');
	mobMenu.classList.toggle('open_menu');

	if (header.classList.contains('open_menu')) {
		document.body.style.overflowY = "hidden";
	}
	else{
		document.body.style.overflowY = "scroll";
	}
};

let closeMenu = () => {
	header.classList.toggle('open_menu');
	mobMenu.classList.toggle('open_menu');
	document.body.style.overflowY = "scroll";
}

let checkStatus = (e) => {
	for(let checkbox of checkoxes){
		checkbox.checked = false;
	};
	e.target.checked = true;
};

let nextSlide = (e) => {
	let numberOfSlider = e.target.getAttribute('data-next');
	let slider = document.querySelector('.slider[data-slider="' + numberOfSlider + '"]');
	slider     = slider.querySelectorAll('.slide')

	if (typeof currentSlide === 'undefined' || currentSlide == -1)
		currentSlide = slider.length-1;

	try {
	    slider[currentSlide].className = 'slide';
	    currentSlide = (currentSlide + 1) % slider.length;
	    slider[currentSlide].className = 'slide showing';
    } catch (e) {
    	console.log(e.message);
    }

    return currentSlide;
};

let prevSlide = (e) => {
	let numberOfSlider = e.target.getAttribute('data-prev');
	let slider 	= document.querySelector('.slider[data-slider="' + numberOfSlider + '"]');
	slider 	    = slider.querySelectorAll('.slide')

	if (typeof currentSlide === 'undefined' || currentSlide == -1)
		currentSlide = slider.length-1;
	
	try {
	    slider[currentSlide].className = 'slide';
	    currentSlide = (currentSlide - 1) % slider.length;
	    slider[currentSlide].className = 'slide showing';
    } catch (e) {
    	console.log(e.message);
    }

    return currentSlide;
};

for(let prevBtn of prev){
	prevBtn.addEventListener('click', prevSlide)
};
for(let nextBtn of next){
	nextBtn.addEventListener('click', nextSlide)
};
for (let checkbox of checkoxes) {
	checkbox.addEventListener('click', checkStatus)
};

toggle.addEventListener('click', showMenu);
close.addEventListener('click', closeMenu);


/* Манипуляции с ползунком диапазона цен */

let getCoords = (elem) => { 
   let box = elem.getBoundingClientRect();

  	return {
        top:  box.top + pageYOffset,
        left: box.left + pageXOffset,
        right: box.right + pageXOffset
  	};
}

let sliderElem = document.querySelector('#range');
let startRange = document.querySelector('.start .cls');
let endRange   = document.querySelector('.end .cls');
	let min 	   = document.querySelector('#min');
	let before 	   = document.querySelector('#before');
	let after 	   = document.querySelector('#after');
let max 	   = document.querySelector('#max');
	const SOME_NUMBER = 630; // коэффициент между пройденным путём ползунка и ценой
const DIFFERENT = 30;   // минимальная разница в пикселях между min и max

let defaultStartPosition = range.offsetWidth / 100 * 10;
let defaultEndPosition   = range.offsetWidth - (22 + 15);
startRange.style.left    = 22 + 'px';
endRange.style.right     = 22 + 'px';
before.style.width 		 = 22 + 15 + 'px';
after.style.width 		 = range.offsetWidth - defaultEndPosition + 'px';


let dragStartRange = (e) => {
  	let thumbCoords = getCoords(startRange);
  	let shiftX = e.pageX - thumbCoords.left;
  	let sliderCoords = getCoords(sliderElem);
  	let rangeWidth   = range.offsetWidth;
  	let percent      = rangeWidth / 100

  	document.onmousemove = function(e) {
    	let newLeft = e.pageX - shiftX - sliderCoords.left;

        // курсор ушёл вне слайдера
        if (newLeft < 0) {
          newLeft = 0;
        }
        let rightEdge = sliderElem.offsetWidth - startRange.offsetWidth;
        if (newLeft > rightEdge) {
          newLeft = rightEdge;
        }

        if (parseInt(endRange.style.left) <= (newLeft + DIFFERENT)) {
        	newLeft = +parseInt(endRange.style.left).toFixed() - DIFFERENT;
        }

        startRange.style.left = newLeft + 'px';
        before.style.width = (newLeft + 15) + 'px';

        let doneWayInPx 	 = parseInt(startRange.style.left)
        let doneWayInPercent = doneWayInPx / percent;

        let minPrice = (doneWayInPercent * SOME_NUMBER).toFixed(1);

        // Убираем лищние цифры при выводе в html
        if (minPrice.length >= 7) {
        	minPrice = (Math.floor(minPrice * 100) / 100000).toFixed(1) + "k";
        }
        min.innerHTML = minPrice;
  }

  document.onmouseup = function() {
    document.onmousemove = document.onmouseup = null;
  };

  return false; 
};

let dragEndRange = (e) => {
    let thumbCoords  = getCoords(endRange);
    let shiftX 	   = e.pageX - thumbCoords.left;
    let sliderCoords = getCoords(sliderElem);
    let rangeWidth   = range.offsetWidth;
    let percent 	   = rangeWidth / 100;

  	document.onmousemove = function(e) {
        let newLeft = e.pageX - shiftX - sliderCoords.left;

        // курсор ушёл вне слайдера
        if (newLeft < 0) {
          newLeft = 0;
        }
        let rightEdge = sliderElem.offsetWidth - endRange.offsetWidth;
        if (newLeft > rightEdge) {
          newLeft = rightEdge;
        }

        if (parseInt(startRange.style.left) >= (newLeft - DIFFERENT)) {
        	newLeft = +parseInt(startRange.style.left).toFixed() + DIFFERENT;
        }

      	let colorAfter = rangeWidth - newLeft;
        after.style.width = (colorAfter - 15) + 'px';
        endRange.style.left = newLeft + 'px';

        let doneWayInPx 	 = parseInt(endRange.style.left)
        let doneWayInPercent = doneWayInPx / percent;

        let minPrice = (doneWayInPercent * SOME_NUMBER).toFixed(1);

        // Убираем лищние цифры при выводе в html
        if (minPrice.length >= 7) {
        	minPrice = (Math.floor(minPrice * 100) / 100000).toFixed(1) + "k";
        }
        max.innerHTML = minPrice;

      }

  	document.onmouseup = function() {
        document.onmousemove = document.onmouseup = null;
		};

  	return false; 
};

startRange.addEventListener('mousedown', dragStartRange);
endRange.addEventListener('mousedown', dragEndRange);