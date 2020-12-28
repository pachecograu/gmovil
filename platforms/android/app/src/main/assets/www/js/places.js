document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    var permissions = cordova.plugins.permissions;
    var list = [
        permissions.CAMERA
    ];

    permissions.checkPermission(list, function (status) {
        console.log(status);
        if (status.hasPermission) {
            alert("Yes :D ");
        } else {
            // alert("NO :(");
            permissions.requestPermissions(list, function (status) {
                if (!status.hasPermission) {
                    // $state.go('mode');
                    alert(status.hasPermission);
                } else {
                    // listDir("file:///storage/emulated/0", 'raiz');
                }
            }, function () {
                alert('Read Storage permission is not turned on');
            });
        }
    });
}


window.onload = () => {


    let method = 'dynamic';

    // if you want to statically add places, de-comment following line:
    method = 'static';
    if (method === 'static') {
        let places = staticLoadPlaces();
        return renderPlaces(places);
    }

    if (method !== 'static') {
        // first get current user location
        return navigator.geolocation.getCurrentPosition(function (position) {
                console.log(position);
                // than use it to load from remote APIs some places nearby
                dynamicLoadPlaces(position.coords)
                    .then((places) => {
                        renderPlaces(places);
                    })
            },
            (err) => console.error('Error in retrieving position', err), {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 27000,
            }
        );
    }
};




function staticLoadPlaces() {
    return [{
            name: "Donde el gray",
            location: {
                lat: 10.968064, // change here latitude if using static data
                lng: -74.772415, // change here longitude if using static data
            }
        },

        {
            name: 'Donde mami',
            location: {
                lat: 10.967583,
                lng: -74.774180,
            }
        },

        // {
        //     name: 'Bus',
        //     location: {
        //         lat: ,
        //         lng: ,
        //     }
        // },



    ];
}












// getting places from REST APIs
function dynamicLoadPlaces(position) {
    let params = {
        radius: 500, // search places not farther than this value (in meters)
        clientId: 'PTDLMJJ5ZOXQRYIZIZLMMWUHE4Z2TTYLJKXZJUJEYTMY21M5',
        clientSecret: 'XPLFMYWXF1IFG1J1IUQIRA0JM1O20AWMD3VZPZBBEWBBCGRY',
        version: '20300101', // foursquare versioning, required but unuseful for this demo
    };

    // CORS Proxy to avoid CORS problems
    let corsProxy = 'https://cors-anywhere.herokuapp.com/';

    // Foursquare API
    let endpoint = `${corsProxy}https://api.foursquare.com/v2/venues/search?intent=checkin
        &ll=${position.latitude},${position.longitude}
        &radius=${params.radius}
        &client_id=${params.clientId}
        &client_secret=${params.clientSecret}
        &limit=15
        &v=${params.version}`;
    return fetch(endpoint)
        .then((res) => {
            return res.json()
                .then((resp) => {
                    return resp.response.venues;
                })
        })
        .catch((err) => {
            console.error('Error with places API', err);
        })
};

function renderPlaces(places) {
    console.log(places);
    let scene = document.querySelector('a-scene');

    places.forEach((place) => {
        let latitude = place.location.lat;
        let longitude = place.location.lng;

        // add place name
        let text = document.createElement('a-link');
        text.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
        text.setAttribute('title', place.name);
        text.setAttribute('href', 'http://www.example.com/');
        text.setAttribute('scale', '20 20 20');


        // add place icon
        // const icon = document.createElement('a-image');
        // icon.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude}`);
        // icon.setAttribute('name', place.name);
        // icon.setAttribute('src', './map-marker.png');


        // icon.setAttribute('scale', '300, 300, 300');

        // icon.addEventListener('loaded', () => {window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
        //  });



        text.addEventListener('loaded', () => {
            window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
        });

        scene.appendChild(text);
        // scene.appendChild(icon);
    });
}