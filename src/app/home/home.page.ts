import { Component, OnInit } from '@angular/core';

import { GoogleMap, 
         GoogleMaps, 
         Marker, 
         GoogleMapOptions,
         Environment,
         GoogleMapControlOptions,
         GoogleMapsAnimation,
         MarkerOptions} from "@ionic-native/google-maps/ngx";

import { Geolocation } from "@ionic-native/geolocation/ngx";
import { MapServiceService } from './servicios/map-service.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  public map:GoogleMap;

  constructor(private geo:Geolocation, private servicioMapa: MapServiceService) {}

  ngOnInit(): void {
    this.servicioMapa.getListadoCanchas().valueChanges().subscribe(lista=>{
      lista.forEach(cancha => {
        let _markerOpts:MarkerOptions={
          title:cancha.direccion,
          position: {lat: cancha.latitud, lng:cancha.longitud}
        };
        this.map.addMarker(_markerOpts);
      });
    });
    //obtengo la posicion actual del dispositivo: se almacena en la variable "geopos"
    this.geo.getCurrentPosition().then(geopos=>{
      console.log(geopos);
      //declaro variables locales con let y asigno latitud y longitud:
      let lat = geopos.coords.latitude;
      let long = geopos.coords.longitude;
      //cargo el mapa:
      this.cargarMapa(lat, long);
    }).catch(error=>{
      console.log('Error al obtener coordenadas: ', error);
    });
    
    //this.cargarMapa();
  }


  private cargarMapa(_lat: number, _lng: number):void{
    console.log(_lat, '; ', _lng);
    Environment.setEnv({
      'API_KEY_FOR_BROWSER_RELEASE': 'AIzaSyCvpmyDG-x0iiI-DSiv9mFJnAik4K8_DJY',
      'API_KEY_FOR_BROWSER_DEBUG': 'AIzaSyCvpmyDG-x0iiI-DSiv9mFJnAik4K8_DJY'
    });
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

}
