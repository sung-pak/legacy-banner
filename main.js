var dynID = 10;
	var currentPage = 4; // start on blue
	var dyndivArray = new Array();
	var loadedDivs = new Array();
	var currentDiv;

	var initialized = false;

	var colorsArray = ["Super_White", "Classic_Silver_Metallic", "Slate_Metallic", "Barcelona_Red_Metallic", "Blue_Crush_Metallic", "Black_Sand_Pearl"];
	var carArray = ["images/car_white.png", "images/car_gray1.png", "images/car_gray2.png", "images/car_red.png", "images/car_blue.png", "images/car_black.png"];
	var spriteArray = ["images/smoke_white.png", "images/smoke_gray1.png", "images/smoke_gray2.png", "images/smoke_red.png", "images/smoke_blue.png", "images/smoke_black.png"];

	var spriteHeight = 7420; // height of smoke sprite image

	var animate = false;

	// animate fade
	(function() {
	  var FX = {
	      easing: {
	          linear: function(progress) {
	              return progress;
	          },
	          quadratic: function(progress) {
	              return Math.pow(progress, 2);
	          },
	          swing: function(progress) {
	              return 0.5 - Math.cos(progress * Math.PI) / 2;
	          },
	          circ: function(progress) {
	              return 1 - Math.sin(Math.acos(progress));
	          },
	          back: function(progress, x) {
	              return Math.pow(progress, 2) * ((x + 1) * progress - x);
	          },
	          bounce: function(progress) {
	              for (var a = 0, b = 1, result; 1; a += b, b /= 2) {
	                  if (progress >= (7 - 4 * a) / 11) {
	                      return -Math.pow((11 - 6 * a - 11 * progress) / 4, 2) + Math.pow(b, 2);
	                  }
	              }
	          },
	          elastic: function(progress, x) {
	              return Math.pow(2, 10 * (progress - 1)) * Math.cos(20 * Math.PI * x / 3 * progress);
	          }
	      },
	      animate: function(options) {
	          var start = new Date;
	          var id = setInterval(function() {
	              var timePassed = new Date - start;
	              var progress = timePassed / options.duration;
	              if (progress > 1) {
	                  progress = 1;
	              }
	              options.progress = progress;
	              var delta = options.delta(progress);
	              options.step(delta);
	              if (progress == 1) {
	                  clearInterval(id);
	                  //options.complete();
	              }
	          }, options.delay || 10);
	      },
	      fadeOut: function(element, options) {
	          var to = 1;
	          this.animate({
	              duration: options.duration,
	              delta: function(progress) {
	                  progress = this.progress;
	                  return FX.easing.swing(progress);
	              },
	              complete: options.complete,
	              step: function(delta) {
	                  element.style.opacity = to - delta;
	              }
	          });
	      },
	      fadeIn: function(element, options) {
	          var to = 0;
	          this.animate({
	              duration: options.duration,
	              delta: function(progress) {
	                  progress = this.progress;
	                  return FX.easing.swing(progress);
	              },
	              complete: options.complete,
	              step: function(delta) {
	                  element.style.opacity = to + delta;
	              }
	          });
	      }
	  };
	  window.FX = FX;
	})()

	// function to load pages
	var loadPage = function(pageNum) {

		preloadimages([carArray[pageNum], spriteArray[pageNum]]).done(function(images){
			 //call back
				loadedDivs.push(pageNum);
				if (pageNum == currentPage) { //make sure div is still on top
					onImageLoad();
				}
		});

		var carContainer = document.getElementById('carContainer');

		var element = document.createElement('div');
		element.id = "dyndiv" + dynID;
		carContainer.appendChild(element);

		var newDiv = document.getElementById('dyndiv' + dynID);

		newDiv.style.zIndex = dynID;
		newDiv.style.position = 'absolute';
		newDiv.style.top = '0px';
		newDiv.style.left = '0px';

		var contentstr = '<div class="ccontainer">';
				contentstr += '<div class="loader"><div class="dot dot1"></div><div class="dot dot2"></div><div class="dot dot3"></div><div class="dot dot4"></div></div>';
				contentstr += '<div class="cimageholder"><img class="cimage" src="';
				contentstr += carArray[pageNum];
				contentstr += '" /></div>';
				contentstr += '<div class="cspriteholder"><img class="csprite" src="';
				contentstr += spriteArray[pageNum];
				contentstr += '" width="320" height="' + (spriteHeight*2) +'" ></div></div>';

		newDiv.innerHTML = contentstr;

		// change color text y-position to match car color
		var ct = document.getElementById('colortxt');
		var cti = document.getElementById('colortxtimg');

		ct.style.opacity = 0;
		cti.style.top = -(pageNum * 20) + "px";

		setTimeout(function(){
			FX.fadeIn(ct, {
					duration: 300,
					complete: function(){
						//
					}
			});
		}, 0);


		// check to see if images have already been loaded and loader animation can be hidden
		for (i = 0; i < loadedDivs.length; i++) {
			if (pageNum == loadedDivs[i]) {
				newDiv.getElementsByClassName("loader")[0].style.visibility = "hidden";
				break;
			}
		}

		// add new div to list
		dyndivArray.push(newDiv);

		currentDiv = newDiv;

		dynID = ++dynID;

		// count how many total pages within the creative the user viewed
		//servo.report.data('Total Pages Viewed');
	};

	// function to preload images
	function preloadimages(arr){
			var newimages=[], loadedimages=0
			var postaction=function(){}
			var arr=(typeof arr!="object")? [arr] : arr
			function imageloadpost(){
					loadedimages++
					if (loadedimages==arr.length){
							postaction(newimages) //call postaction and pass in newimages array as parameter
					}
			}
			for (var i=0; i<arr.length; i++){
					newimages[i]=new Image()
					newimages[i].src=arr[i]
					newimages[i].onload=function(){
							imageloadpost()
					}
					newimages[i].onerror=function(){
							imageloadpost()
					}
			}
			return { //return blank object with done() method
					done:function(f){
							postaction=f || postaction //remember user defined callback functions to be called when images load
					}
			}
	}


	// transition to new content
	function onImageLoad() {
		currentDiv.getElementsByClassName("loader")[0].style.visibility = "hidden";

		var car = currentDiv.getElementsByClassName("cimage")[0];
		var spr = currentDiv.getElementsByClassName("csprite")[0];
		var wheel1 = document.getElementById("wheelFront");
		var wheel2 = document.getElementById("wheelRear");

		function move(element) {
			var oy = 0;
			var timer = setInterval(function () {
					if (oy <= -(spriteHeight*2)+(560)+140){
							oy = -(spriteHeight*2)+(560);
							clearInterval(timer);
							element.style.display = 'none';

							//clean up oldest visible loaded div to help ad run smoothly
							if (dyndivArray.length > 3) {
								dyndivArray[0].style.visibility = "hidden";
								carContainer.removeChild(dyndivArray[0]);
								dyndivArray.shift();
							}

					}
					element.style.top = oy + 'px';
					oy -= 280;
			}, 35);
		}

		setTimeout(function(){
			FX.fadeIn(car, {
					duration: 500//,
					//complete: function(){}
			});
		}, 200); //200 for lo, 400 for hi

		if (initialized == false) { //hide car wheels on first click
			initialized = true;

			setTimeout(function(){
				FX.fadeOut(wheel1, {
						duration: 100//,
						//complete: function(){}
				});
			}, 25); //25 for lo, 50 for hi

			setTimeout(function(){
				FX.fadeOut(wheel2, {
						duration: 100//,
						//complete: function(){}
				});
			}, 25); //25 for lo, 50 for hi
		}

		move(spr);
	}

	//
	function onStageLoad() {
		document.getElementById("container").style.display = "block";

		// background smoke loop
		if (animate==true) {
			var bgs = document.getElementById("bgimgholder");
			//bgs.innerHTML = '<img class="bsprite anim" src="images/bg_sprite.jpg" alt="" id="bgs">';

			var clickBGS = document.getElementById('bgs');
			clickBGS.addEventListener(tapEvent, function() {
					//servo.clickthrough('clickthroughBG');
			}, false);

			var spr = document.getElementsByClassName("bsprite anim")[0];

			function move(element) {
				var oyb = 0;
				var timerb = setInterval(function () {

						if (oyb <= -(12000)+(240)){
								oyb = 0;
						}
						element.style.top = oyb + 'px';
						oyb -= 240;
				}, 35);
			}

			setTimeout(function(){
				document.getElementById("bgimgholder").style.display = "block";
				move(spr);
			}, 2200);
		}

		// fade in other stage elements
		setTimeout(function(){

			var hiddenArr = ['txt2', 'txt3', 'txt4', 'logo', 'cta', 'colortxt'];// 'nav',

			for(var ii=0; ii < hiddenArr.length; ii++){
				var divObj;
						divObj = document.getElementById(hiddenArr[ii]);
						divObj.className = "disappear";

				FX.fadeIn(divObj, {
					duration: 800//,
					//complete: function(){}
				});
			}
		}, 2000);

 		// animate color swatches in
 		setTimeout(function(){
			// this loop starts with 1,  button id's
			for(var jj=1; jj <= 6; jj++) {
				var num = 80;
				if(jj==1) num = 0;

				(function(jj) {
					setTimeout(function(){
						var btnObj;

						btnObj = document.getElementById('button'+[jj]);
						btnObj.className = "appear";
					}, num * jj);
				})(jj);
			}
		}, 2000);
	};

	var removeActive = function(){
		for(var jj=1; jj <= 6; jj++) {
			var btnObj;

			btnObj = document.getElementById('button'+[jj]);
			btnObj.className = "";
		}
	};
	// clickthroughs
	var clickCTA = document.getElementById('linkcta');
	var clickHeadline = document.getElementById('linkheadline');
	var clickCorolla = document.getElementById('linkcorolla');
	var clickLogo = document.getElementById('linklogo');
	var clickCar = document.getElementById('clickScreen');
	var clickBG = document.getElementById('bg');
	var clickOptions = document.getElementById('linkoptions');
	var clickDeadspot = document.getElementById('deadspot');

	// define our own event
	var tapEvent = "ontouchend" in document.createElement("div") ? "touchend" : "click";

	clickCTA.addEventListener(tapEvent, function() {
			//servo.clickthrough('clickthroughCTA');
	}, false);

	clickHeadline.addEventListener(tapEvent, function() {
			//servo.clickthrough('clickthroughHeadline');
	}, false);

	clickCorolla.addEventListener(tapEvent, function() {
			//servo.clickthrough('clickthroughCorolla');
	}, false);

	clickLogo.addEventListener(tapEvent, function() {
			//servo.clickthrough('clickthroughLogo');
	}, false);

	clickCar.addEventListener(tapEvent, function() {
			//servo.clickthrough('clickthroughCar');
	}, false);

	clickBG.addEventListener(tapEvent, function() {
			//servo.clickthrough('clickthroughBG');
	}, false);

	clickOptions.addEventListener(tapEvent, function() {
			//servo.clickthrough('clickthroughBG');
	}, false);

	// color swatch clicks
	for(var jj=1; jj <= 6; jj++) {

		var btnObj;
		btnObj = document.getElementById('button'+[jj]);

		(function(jj) {
			btnObj.addEventListener(tapEvent, function(e) {

				e.preventDefault();

				if (currentPage != jj-1) {
					currentPage = jj-1;

					loadPage(currentPage);

					removeActive();
					this.className = "active";

					// *******
					var wheel1 = document.getElementById("wheelFront");
					var wheel2 = document.getElementById("wheelRear");

					setTimeout(function(){
						wheel1.style.visibility = "hidden";
					}, 125);

					setTimeout(function(){
						wheel2.style.visibility = "hidden";
					}, 125);

					// report color viewed
					//servo.report.engagement(colorsArray[currentPage] + '_Clicked');

				}
			}, false);

		})(jj);
	}


	//deadspot
	clickDeadspot.addEventListener(tapEvent, function() {
		//
	}, false);


	// detect platform
	var iOSversion = function () {
		if (/iP(hone|od|ad)/.test(navigator.platform)) {
			// supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
			var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
			return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
		}
	};

	// !!! INIT
	window.onload = (function() {

		preloadimages(["images/txt_colors.png", "images/car_blue_initial.png", "images/bg.jpg", "images/txt1.png"]).done(function(){
			 //call back

			var preLoader = document.getElementById('preLoader');
			preLoader.parentNode.removeChild(preLoader);

			if( navigator.userAgent.match(/iPad/i)
					|| navigator.userAgent.match(/iPhone/i) ){

						animate = true;

						var ver = iOSversion();
						if (ver[0] < 5) {
							animate = false; // ios 5 or below - no animation
						}

						if( navigator.userAgent.match(/iPhone OS 1/i)
								|| navigator.userAgent.match(/iPhone OS 2/i)
								|| navigator.userAgent.match(/iPhone OS 3/i)
								|| navigator.userAgent.match(/iPhone OS 4/i) ){
							// iPhone 4 or below - no animation
							animate = false;
						}
			}

			if( navigator.userAgent.match(/iPad/i)
					|| navigator.userAgent.match(/iPhone/i)
					|| navigator.userAgent.match(/BlackBerry/i)
					|| navigator.userAgent.match(/Android/i)
					|| navigator.userAgent.match(/webOS/i) ){

				// mobile
				if( navigator.userAgent.match(/Chrome/i)){
					animate = false;
				}

			}else{
				// desktop
				animate = true;
			}

			if(animate==true){
				document.getElementById('baseContainer').className = "commence anim";
			}else{
				document.getElementById('baseContainer').className = "commence";
			}

			onStageLoad();
		})

	});
