import { Component, OnInit } from '@angular/core';

import { GoogleMap, 
         GoogleMaps, 
         Marker,
         GoogleMapOptions,
         PolylineOptions,
         LatLng,
         Spherical,
         GoogleMapsMapTypeId,
         Environment,
         GoogleMapControlOptions,
         GoogleMapsAnimation,
         MarkerOptions,
         GoogleMapsEvent,
         ILatLng,
         StreetViewPanorama,
         Polyline} from "@ionic-native/google-maps/ngx";

import { Geolocation } from "@ionic-native/geolocation/ngx";
import { MapServiceService } from './servicios/map-service.service';
import { Platform } from '@ionic/angular';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  public map:GoogleMap;
  private miLatitud:number;
  private miLongitud:number;
  private distancia:string;

  constructor(private geo:Geolocation, private servicioMapa: MapServiceService,
              private platform:Platform  
  ) {
    this.distancia = '0';
  }

  ngOnInit(): void {

    if (this.platform.ready().then(value=>{
      console.log(value);
              //obtengo la posicion actual del dispositivo: se almacena en la variable "geopos"
    this.geo.getCurrentPosition().then(geopos=>{
        //declaro variables locales con let y asigno latitud y longitud:
        this.miLatitud = geopos.coords.latitude;
        this.miLongitud = geopos.coords.longitude;
        //cargo el mapa:
        this.cargarMapa(this.miLatitud, this.miLongitud);    
    }).catch(error=>{
      console.log('Error al obtener coordenadas: ', error);
    });
    
 
    this.servicioMapa.getListadoCanchas().valueChanges().subscribe(lista=>{
      lista.forEach(cancha => {
        //console.log(cancha);  
        let _markerOpts:MarkerOptions={
          title: "Nombre: " + cancha.direccion,
          position: {lat: cancha.latitud, lng:cancha.longitud},
        };
  
          this.map.addMarker(_markerOpts).then((_marker:Marker)=>{
            //agrego el evento "click" al marcador recién agregado al mapa
            //cuando presiono la posicion, traza la ruta
            _marker.addEventListener(GoogleMapsEvent.MARKER_CLICK).subscribe((markerClicked)=>{
              //this.map.setMapTypeId(GoogleMapsMapTypeId.SATELLITE);
                let objLatLng: LatLng= markerClicked[0];
                this.trazarRuta(objLatLng.lat, objLatLng.lng, this.miLatitud, this.miLongitud);
            });
          });
        
      });
    });
    })) {}
  }


  private cargarMapa(_lat, _lng){
    //configuración inicial del mapa
    // documentación: https://github.com/ionic-team/ionic-native-google-maps/blob/master/documents/README.md
    const mapOptios:GoogleMapOptions = {
      camera: {
        target:{
          lat: _lat,
          lng: _lng
        },
        zoom: 18,
        tilt: 30
      }
    };

    //creo el mapa
    this.map = GoogleMaps.create('mapa', mapOptios);

    let markerOpts: MarkerOptions = {
      icon: {
        url: '../assets/icon/marker_usuario.jpg',
        size:{
          width: 32,
          height: 24
        }
      },
      title: 'Mi Ubicación',
      position: {lat: _lat, lng:_lng},
      animation: GoogleMapsAnimation.DROP
    }
    this.map.addMarker(markerOpts);
 
  }


  private trazarRuta(lat, long, miLat, miLng) {

    const promise = new Promise((resolve, reject) => {
        let miPos:ILatLng={
      lat:miLat,
      lng:miLng,
    }
    let posMarkerClicked:ILatLng={
      lat:lat,
      lng:long
    }
    let lineOptions: PolylineOptions = {
        points: [miPos, posMarkerClicked],
        visible: true,
        color: '#FF8100',
        width: 4,
        clickable: true,
    };

      this.map.addPolyline(lineOptions).then((polyline:Polyline)=>{
        console.info(polyline);
        //retorna la distancia en metros
        let _distancia = Spherical.computeDistanceBetween(miPos, posMarkerClicked);
        //redondeo
        _distancia = Math.round(_distancia);
        if (_distancia >= 1000) {
          //convierto a kms
           let km:number = Math.floor(_distancia / 1000);
           this.distancia = km + 'Kms.';
        }else{
            this.distancia = _distancia + 'Mts.';
        }
      });
    });
  
    
  }

}
