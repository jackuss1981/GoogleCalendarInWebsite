/* 
===================================================================================================================================
============================================= Script to get data from a Google Calendar  and  =====================================
==================================================== show it on an HTML page  =====================================================
======================================================== created by: Jack Reinieren  ============================================   
===================================================================================================================================
 */ 

 
 //check if IE 11 is the browser from which the user browses
function msieversion() {

			//var ms_ie = false;
			var ua = window.navigator.userAgent;
			var old_ie = ua.indexOf('MSIE ');
			var new_ie = ua.indexOf('Trident/');

			if ((old_ie > -1) || (new_ie > -1)) {
				return true
				
			} else {
				return false
				
			}
};
	// Als een gebruiker IE gebruikt, gaat dit script draaien, en komt er een scherm op die aangeeft dat er andere browsers gebruikt moeten worden.

// Deze functie maakt een Unsorted List  aan en vult deze met List Elements:
 function makeUL(array) {
    // Create the list element:
    var list = document.createElement('ul');

    for(var i = 0; i < array.length; i++) {
        // Create the list item:
        var item = document.createElement('li');

        // Set its contents:
        item.appendChild(array[i]);

        // Add it to the list:
        list.appendChild(item);
    };

    // Finally, return the constructed list:
    return list;
};


// function for what to do when IE 11 is the browser
function IECompat () {
	 var ShowDataEl = document.getElementById("ShowData");
	 var AllBrowsers = [];
	 var Browsers = {
		Titles: ["Chrome", "FireFox", "Opera", "Edge"],
		Hrefs: ['https://www.google.com/chrome/browser/desktop/index.html', 'https://www.mozilla.org/nl/firefox/new/', 'http://www.opera.com/nl', "https://www.microsoft.com/nl-nl/windows/microsoft-edge"]
	};
	
	// create arrays with hyperlinks and titles
	for (var i=0; i < Browsers.Titles.length; i++) {
			var a = document.createElement('a');
			var linkText = document.createTextNode(Browsers.Titles[i]);
			a.appendChild(linkText);
			a.title = linkText;
			a.href = Browsers.Hrefs[i];
		 AllBrowsers.push(a)
		 };
	
	// lose the tables which are in HTML
	var Element = document.getElementById('Upcoming')
	Element.parentNode.removeChild(Element)
	
	var Element1 = document.getElementById('Past')
	Element1.parentNode.removeChild(Element1)
	
	
	var node = "Please do not use IE 11" // create some nice text to show
	ShowDataEl.innerHTML = node
	ShowDataEl.appendChild(makeUL(AllBrowsers));	
	};
	
function CalendarItems(){
   
   $(document).ready(function() {
	    
		var calendarURL = "Google Calendar API Key"   //enter your own calendar API string here
		var ListItems = [];
		var i;
		
		
		// Function creates 2 arrays based on date
		function UpComingPast (items){
			

			var Upcoming = [];
			var Past = [];
			var i;
			var nnb = 'Not yet known'
			
			// This function removes the ", Nederland" string from the location key in the Google Calendar, change this if you want
			function LocationChanges() {
			
					
				if (typeof(items[i].location) !== 'undefined' && items[i].location.endsWith(', Nederland')){
					
					var NoHolland = items[i].location.replace(/, Nederland/g, '')
					items[i].location = NoHolland
				
				};
				// if undefined, enter 'not yet known' in table
				if (typeof(items[i].location) == 'undefined'){
			
					items[i].location = nnb

				}
			};
			
			for (i = 0; i < items.length; i++) {
				LocationChanges();
				
				var now = new Date();
				var CmpDate = new Date(items[i].start.dateTime || items[i].start.date);
				
				if (CmpDate.getTime() >= now.getTime()) {	
						
						Upcoming.push(items[i]);
			
				} else if (CmpDate.getTime() < now.getTime()) {	
					
					Past.push(items[i]);
				} else {
					
					console.log("Error in Functie UpComingPast");
				
				}; 
			};
			
			//sort objects based on date
			Upcoming.sort(function(a, b) {
						
						var dateA = new Date(a.start.dateTime || a.start.date), dateB = new Date(b.start.dateTime || b.start.date);

							return dateA - dateB;
					
					});
			
			Past.sort(function(a, b) {
						
						var dateA = new Date(a.start.dateTime || a.start.date), dateB = new Date(b.start.dateTime || b.start.date);
							
							return dateB - dateA;
					
					});
			
			// return objects Upcoming and Past. 
			return {Upcoming: Upcoming, Past: Past};
			
		}; 
		
	   
		
		// Check if IE is in use and if so, start the IECompat function
		if (msieversion()) {
			IECompat()
			
		}
		//Get data from JSON
	  
		jQuery.getJSON(calendarURL, function(data) {		    	
				// get all data and remove the cancelled items
				data.items.forEach(function RemoveCancelledEvents(item){

				if (item && item.hasOwnProperty('status')  && item.status !== 'cancelled'){			

						ListItems.push(item);
				
				}
			});
			
		// create header row from array "col"
		for (i = 0; i < ListItems.length; i++) {
			
			var col = [];				
		
			for (var key in ListItems[i]) {			
			
				if (col.indexOf(key) === -1) {
				
					col.push(key);
					
				}
			}
		};
		//add 1 column, named "Start Time"
		col.push('Start Time')
		
		// create dynamic table
		var tableU = document.getElementById('Upcoming');
		var tableP = document.getElementById('Past');
		
		var trU = tableU.insertRow(-1);
		var trP = tableP.insertRow(-1);
		
		// add headername to HTML and add them to the "Upcoming" table
		for (i = 0; i < col.length; i++) {
			
			var TH = document.createElement('th'); 			
					TH.innerHTML = col[i];
					trU.appendChild(TH);				
		
		};

					
	// add headername to HTML and add them to the "Previous" table
		for (i = 0; i < col.length; i++) {
			
			var TH = document.createElement('th'); 				  
				  TH.innerHTML = col[i];
					trP.appendChild(TH);

		};
		
		// Call function UpComingPast and add contents to variable Gigs
			var Gigs = UpComingPast(ListItems);
		 
		 // Upcoming Gigs
			if(Gigs.Upcoming.length != 0 ) {
			
				for (i = 0; i < Gigs.Upcoming.length; i++){
					
					var UpDates = new Date(Gigs.Upcoming[i].start.dateTime || Gigs.Upcoming[i].start.date);
					var Hour = UpDates.getHours();
					trU = tableU.insertRow(-1);
				
					for (var j = 0; j < col.length; j++) {	
						
						var tabCellU = trU.insertCell(-1);
						tabCellU.innerHTML = Gigs.Upcoming[i][col[j]]	
						
						if(col[j] === 'start'){
							
							tabCellU.innerHTML = UpDates.toLocaleString("nl-NL", {weekday: "long", day: "numeric", month: "long", year:"numeric"});
						} else if(col[j] === 'Start Time'){
							
							tabCellU.innerHTML = UpDates.toLocaleString("nl-NL", {hour: '2-digit', minute: '2-digit'});
							if (Hour === 2){
								tabCellU.innerHTML = "(Nog) Niet Bekend"
							}
						}
					};
			};
		
		} else {
	// add text if no there are no upcoming gigs
				var Element = document.getElementById('Upcoming');
				Element.parentNode.removeChild(Element)
				Element.deleteRow(0)
				Element.insertRow(0).insertCell(0).innerHTML = "No upcoming gigs at the moment"
				Element.style.width = "95%"
		};
		
		// Previous Gigs
		if (typeof(Gigs.Past) !== 'undefined') {
			
			for (i=0; i < Gigs.Past.length; i++) {
				
				
				var PastDates = new Date(Gigs.Past[i].start.dateTime || Gigs.Past[i].start.date);
				var Hour = PastDates.getHours();
				trP = tableP.insertRow(-1);

				for (var j = 0;j < col.length; j++){ 
					
					var tabCellP = trP.insertCell(-1);
					tabCellP.innerHTML = Gigs.Past[i][col[j]];

					if (col[j] === 'start'){
				
						tabCellP.innerHTML = PastDates.toLocaleString("nl-NL", {weekday: "long", day: "numeric", month: "long", year:"numeric"});
						
					} else if(col[j] === 'Start time'){
						
							tabCellP.innerHTML = PastDates.toLocaleString("nl-NL", {hour: '2-digit', minute: '2-digit'});
							if (Hour === 2){
								tabCellP.innerHTML = "Nog Niet Bekend"
							}
					}
				};
			};
		};
		  
				// make  only the columns:  "summary", "location" and "start" visible.
				for (var j = 0; j < col.length; j++) {
				
				if(col[j] === 'summary' || col[j] === 'location' || col[j] === 'start' || col[j] === 'Begin Tijd') {
					   
					   $('td:nth-child('+ (j+1) +'),th:nth-child('+ (j+1) +')').show(); //<-- laat ALLEEN de kolommen  "summary", "location" en "start" zien ...
						
						} else {
							
						$('td:nth-child('+ (j+1) + '),th:nth-child('+ (j+1) +')').hide();// <-- ... de rest is onzichtbaar. Ik moet er 1 bijdoen, omdat nth-child begint te tellen bij 1 ipv 0
					
					}
				}

			
			for (var j = 0; j < col.length; j++) {
				
				if(col[j] === 'summary' || col[j] === 'location' || col[j] === 'start'|| col[j] === 'Aanvangstijd') {
				
					$('td:nth-child('+ (j+1) +'),th:nth-child('+ (j+1) +')').show(); //<-- laat ALLEEN de kolommen  "summary", "location" en "start" zien ...

				} else {
				
					$('td:nth-child('+ (j+1) + '),th:nth-child('+ (j+1) +')').hide();// <-- ... de rest is onzichtbaar. Ik moet er 1 bijdoen, omdat nth-child begint te tellen bij 1 ipv 0
					
					}
				};
		
		// Add "th" elements to table
			$('#Upcoming').each(function(){
			$(this).prepend('<thead></thead>');
			$(this).find('thead').append($(this).find('tr:first-child'));
			
			})
			
			$('#Past').each(function(){
			$(this).prepend('<thead></thead>');
			$(this).find('thead').append($(this).find('tr:first-child'));
			
			})
						
			
			// This changes the headernames to dutch names, you can delete this if necessary
			$("th:contains('summary')").replaceWith("<th> Event</th>");
			$("th:contains('location')").replaceWith("<th> Locatie </th>");
			$("th:contains('start')").replaceWith("<th> Datum </th>");		
			

			
			var divContainer = document.getElementById('ShowData');	
			divContainer.innerHTML = '';
			divContainer.appendChild(tableU);
			divContainer.appendChild(tableP);
				
			
			});

		});
	};
  

	
