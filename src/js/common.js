var App = App || {};

App.Events = {
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
				App.Map.defaultZoom = 0;
			});

			enquire.register('screen and (max-width:767px)', function(){
				App.Map.defaultZoom = 1;
			});

			enquire.register('screen and (max-width:1024px)', function(){
				App.Map.defaultZoom = 2;
			});
			
			enquire.register('screen and (max-width:800px) and (-webkit-min-device-pixel-ratio: 1.5)', function(){
				App.Map.defaultZoom = 1;
			});
			
			App.Map.view.setZoom(App.Map.defaultZoom);
		}
	}
}

App.Menu = {
	init: function(){
		App.Events.topMenu();
	}
}

App.Map = {
	isLoaded: false,
	view: null,
	center: null,
	locations: null,
	counter: 0,
	layer: "toner",
	defaultZoom: 2,
	init: function(){
		App.Map.setLocations();
        App.Map.setCenter();

		var mapOptions = {
			//draggable: false,
			zoom: App.Map.defaultZoom,
			center: App.Map.center,
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
		
        App.Map.view = new google.maps.Map(document.getElementById("map"), mapOptions);
		//Map.view.mapTypes.set(Map.layer, new google.maps.StamenMapType(Map.layer));
		
		App.Events.enquire.map();
		
		App.Map.showMarkers();
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
		
		var markerData = App.Map.locations[App.Map.counter];
		
		var marker = new google.maps.Marker({
			position: markerData.position,
			map: App.Map.view,
			draggable: false,
			icon: image,
			shadow: shadow,
			title: markerData.title,
			zIndex: markerData.zIndex,
			animation: google.maps.Animation.DROP,
			optimized: false
		});
	
		google.maps.event.addListener(marker, 'click', App.Map.onMarkerClick);
		
		App.Map.counter++;
	},
	setCenter: function(){
		App.Map.center = new google.maps.LatLng(42.0525, 0.14365);
	},
	setLocations: function(){
		App.Map.locations = 
		[
			{'title': 'US West', 'position': new google.maps.LatLng(44.050826, -123.092073), 'zIndex': 2}, 
			{'title': 'US East', 'position': new google.maps.LatLng(42.582317, -70.831395), 'zIndex': 3}, 
			{'title': 'UK', 'position': new google.maps.LatLng(50.856136, -1.328015), 'zIndex': 1}, 
			{'title': 'Hong Kong', 'position': new google.maps.LatLng(22.280519, 114.156924), 'zIndex': 4}, 
			{'title': 'China', 'position': new google.maps.LatLng(31.541060, 120.270474), 'zIndex': 5}
		]
	},
	showMarkers: function() {
		for (var i = 0; i < App.Map.locations.length; i++) {
			setTimeout(function() {
				App.Map.addMarker();
			}, (i+1) * 200);
		}
	},
	showLocation: function(coords, zoomLevel) {
		App.Map.view.setCenter(coords);
		App.Map.view.setZoom(zoomLevel);
	},
	onMarkerClick: function() {
		if(App.Map.view.getZoom() == 7){
			App.Map.showLocation(App.Map.center, App.Map.defaultZoom);
			//$('ul a').removeClass('active');
		} else {
			App.Map.showLocation(this.position, 7);
			//$('ul li:eq('+ (this.zIndex-1) +') a').addClass('active');
		}
	}
}

App.Ui = {
	contactForm: {
		init: function(){
			App.Events.contactForm.init();
		},
		showFormSection: function(){
			$('select[name=form-option').change(function(e){
				var val = $(this).val();

				$('.form-option').hide();
				$('.form-' + val).show();
				console.log(val);

			});
		},
		showCountryList: function(xml) {			
			$(xml).find('country').each(function(){
				$('.form-country').append('<option>'+$(this).text()+'</option>');
			});			
		}
	}
}

App.Ajax = {
	getCountryList: function(){
		$.ajax({
			type: "GET",
			url: "countries.xml",
			dataType: "xml",
			success: function(xml){
				App.Ui.contactForm.showCountryList(xml);
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