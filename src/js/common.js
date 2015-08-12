var Events = {
	topMenu: function(){
		$('.mobile-menu').click(function(e){
			$(this).toggleClass('active');
			$('.nav-top').toggleClass('active');
		});

		$('.has-sub-nav').click(function(e){
			e.preventDefault();

			if($(this).parent('li').hasClass('active')) {
				$('.nav-top > li').removeClass('active');
			} else {
				$('.nav-top > li').removeClass('active');
				$(this).parent('li').addClass('active');
			}
		});
	},
	enquire: {
		map: function(){
			enquire.register('screen and (max-width:480px)', function(){
				Map.defaultZoom = 0;
			});

			enquire.register('screen and (max-width:767px)', function(){
				Map.defaultZoom = 1;
			});

			enquire.register('screen and (max-width:1024px)', function(){
				Map.defaultZoom = 2;
			});
			
			enquire.register('screen and (max-width:800px) and (-webkit-min-device-pixel-ratio: 1.5)', function(){
				Map.defaultZoom = 1;
			});
			
			Map.view.setZoom(Map.defaultZoom);
		}
	},
	contactForm: {
		init: function(){}
	}
}

var Menu = {
	init: function(){
		Events.topMenu();
	}
}

var Ajax = {
	getCountryList: function(){
		$.ajax({
			type: "GET",
			url: "countries.xml",
			dataType: "xml",
			success: function(xml){
				Ui.contactForm.showCountryList(xml);
			}
		});
	},
	formSubmit: function(){
		$('form').submit(function(e){
			e.preventDefault();

			$('.output').html('');

			$(this).ajaxSubmit({
				target: $('.output'),
				type: 'POST',
				url: 'mailer.php'
			});
		});
	}
}

var Map = {
	isLoaded: false,
	view: null,
	center: new google.maps.LatLng(42.0525, 0.14365),
	locations: [
		{'title': 'US West', 'position': new google.maps.LatLng(44.050826, -123.092073), 'zIndex': 2}, 
		{'title': 'US East', 'position': new google.maps.LatLng(42.582317, -70.831395), 'zIndex': 3}, 
		{'title': 'UK', 'position': new google.maps.LatLng(50.856136, -1.328015), 'zIndex': 1}, 
		{'title': 'Hong Kong', 'position': new google.maps.LatLng(22.280519, 114.156924), 'zIndex': 4}, 
		{'title': 'China', 'position': new google.maps.LatLng(31.541060, 120.270474), 'zIndex': 5}
	],
	counter: 0,
	layer: "toner",
	defaultZoom: 2,
	init: function(){
		var mapOptions = {
			//draggable: false,
			zoom: Map.defaultZoom,
			center: Map.center,
			mapTypeControl: false,
			//mapTypeId: Map.layer,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			scrollwheel: false,
			streetViewControl: false,
			zoomControl: true,
			zoomControlOptions: {
				style: google.maps.ZoomControlStyle.SMALL,
				position: google.maps.ControlPosition.TOP_RIGHT
			}
        };
		
        Map.view = new google.maps.Map(document.getElementById("map"), mapOptions);
		//Map.view.mapTypes.set(Map.layer, new google.maps.StamenMapType(Map.layer));
		
		Events.enquire.map();
		
		Map.showMarkers();
	},
	addMarker: function() {
		var image = new google.maps.MarkerImage('images/marker.png',
			new google.maps.Size(12, 20),
			new google.maps.Point(0,0),
			new google.maps.Point(6, 20)
		);
		  
		var shadow = new google.maps.MarkerImage('images/marker-shadow.png',
			new google.maps.Size(22, 20),
			new google.maps.Point(0,0),
			new google.maps.Point(5, 20)
		);
		
		var shape = {
			coord: [1, 1, 1, 20, 18, 20, 18 , 1],
			type: 'poly'
		};
		
		var markerData = Map.locations[Map.counter];
		
		var marker = new google.maps.Marker({
			position: markerData.position,
			map: Map.view,
			draggable: false,
			icon: image,
			shadow: shadow,
			title: markerData.title,
			zIndex: markerData.zIndex,
			animation: google.maps.Animation.DROP,
			optimized: false
		});
	
		google.maps.event.addListener(marker, 'click', Map.onMarkerClick);
		
		Map.counter++;
	},
	showMarkers: function() {
		for (var i = 0; i < Map.locations.length; i++) {
			setTimeout(function() {
				Map.addMarker();
			}, (i+1) * 200);
		}
	},
	showLocation: function(coords, zoomLevel) {
		Map.view.setCenter(coords);
		Map.view.setZoom(zoomLevel);
	},
	onMarkerClick: function() {
		if(Map.view.getZoom() == 7){
			Map.showLocation(Map.center, Map.defaultZoom);
			//$('ul a').removeClass('active');
		} else {
			Map.showLocation(this.position, 7);
			//$('ul li:eq('+ (this.zIndex-1) +') a').addClass('active');
		}
	}
}

var Ui = {
	contactForm: {
		init: function(){
			Events.contactForm.init();
		},
		showCountryList: function(xml) {			
			$(xml).find('country').each(function(){
				$('.form-country').append('<option>'+$(this).text()+'</option>');
			});			
		}
	}
}