$(() => {
  $.ajaxSetup({
    crossDomain: true,
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json; charset=utf-8',
      // 'Authorization': `${localStorage.token}`
    }
  });
  // initialize()
  var wmStreetViewKey = 'AIzaSyCuPQR1KWE3uYIoml6bzBOTrA78iVIeaRI'
  var wmPlacesKey = 'AIzaSyDBNBysOcc4ZOhnnHVW_LSMSYBgn9p1YE4'
  var wmRegMapsKey = 'AIzaSyBWwNKenoShzQRdzvj8Ifobvl4fYzR4kXs'
  var wmGeocodingKey = 'AIzaSyDwVSMTSddT1ABkgp8YwzsH7qcqKms2U18'
  var rpSatKey = 'AIzaSyAiB8Q6zW5qm1u2d5LKrT98udr4wbQKEuk'

  let currentURL = window.location.href;
  let id = currentURL.slice(currentURL.indexOf("=") + 1);

  function antipode(coord) {
    return [-1 * coord[0], coord[1] - 180]
  }

  function initialize(coords) {
    const earth = new WE.map('earth_div_markers_user')
    WE.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(earth)

    for (let coord of coords) {
      let antip = antipode(coord)

      var markerCustom = WE.marker(coord, '/images/bullet_orange.png', 8, 8).addTo(earth)
      var markerCustom2 = WE.marker(antip, '/images/bullet_pink.png', 8, 8).addTo(earth)
    }

    earth.setView([39.7578, -105.0072], .8);
  }

  $.get({
    url: `https://dialoc-server.herokuapp.com/user/${id}/location`,
    headers: {
      Authorization: `${localStorage.token}`
    }
  }).then(res => {
    $("#userName").text(res[0].email);
    return res
  }).then((res) => res.reduce((acc, userObj) => {
  acc.push([userObj.latitude, userObj.longitude]);
  return acc;
},[])).then((acc) => {
  initialize(acc);
  acc.map(coords => addFavoriteImage([coords]));
});

  function addFavoriteImage(homeCoords, hero = "col s5 amber lighten-5") {
    let imgURL = [];
    let maxZoom = 9;

    homeCoords.push(antipode(homeCoords[0]));

    console.log("home", homeCoords);

    for (let i = 0; i < 2; i++) {
      let e = {
        lat: homeCoords[i][0],
        lng: homeCoords[i][1]
      };

      let maxZoomService = new google.maps.MaxZoomService();
      console.log(e);
      maxZoomService.getMaxZoomAtLatLng(e, function(response) {
        maxZoom = response.zoom;
        imgURL.push(`https://maps.googleapis.com/maps/api/staticmap?maptype=satellite&center=${homeCoords[i].toString()}&zoom=${maxZoom-1}&size=350x350&key=AIzaSyAiB8Q6zW5qm1u2d5LKrT98udr4wbQKEuk`);
        if (i == 1) {
          $("#favImage").append(`
            <a href="#modal1" class="roundedBorder lessImage ${hero} card-panel valign-wrapper activator">
                <div class="col s6">
                  <img src="${imgURL[0]}" alt="" class="circle responsive-img favorite-img">
                  <p class="red-text">${homeCoords[0]}</p>
                </div>
                <div class="col s6">
                  <img src="${imgURL[1]}" alt="" class="circle responsive-img favorite-img">
                  <p class="red-text">${homeCoords[1]}</p>
                </div>
              </a>`);
        }
      });
    }
    $('.modal').modal();

  $(".col").on("click", function() {
    console.log(this);
    $("#modalBody").html("");
    $("#modalBody").html(`Enter Info Here`);
  });
}
});
