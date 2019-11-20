import { Component, OnInit, ViewChild, AfterContentInit, ElementRef } from '@angular/core';

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
import { Router } from '@angular/router';

import { AngularFireAuth } from "angularfire2/auth";

declare var google:any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild("mapa", { read:ElementRef, static:false }) private mapaHTML:ElementRef;
  public map:GoogleMap;
  private miLatitud:number;
  private miLongitud:number;
  private distancia:string;
  public mapElement: ElementRef = this.mapaHTML;
  //public mapa:any;
  public email:string;
  public passw:string;
  

  constructor(private geo:Geolocation, private servicioMapa: MapServiceService,
              private router:Router, private auth:AngularFireAuth
  ) {
    this.distancia = '0';
    this.email = '';
    this.passw = '';
  }

  private registrarNuevoUsuario(){
    this.auth.auth.createUserWithEmailAndPassword(this.email, this.passw).then(credenciales=>{
      console.log(credenciales);
    }).catch(error=>{
      console.log(error);
    });
  }

  ngAfterViewInit(): void {
     
  }

  ngOnInit(): void {

     //obtengo la posicion actual del dispositivo: se almacena en la variable "geopos"
     this.geo.getCurrentPosition().then(geopos=>{
      //declaro variables locales con let y asigno latitud y longitud:
      this.miLatitud = geopos.coords.latitude;
      this.miLongitud = geopos.coords.longitude;
      //cargo el mapa:
      this.cargarMapa(this.miLatitud, this.miLongitud);
      console.log(this.map);
      //traigo la lista de canchas desde Firebase
      this.servicioMapa.getListadoCanchas().valueChanges().subscribe(lista=>{
        lista.forEach(cancha => {
         
          let _marker = new google.maps.Marker({
            position: new google.maps.LatLng(cancha.latitud,cancha.longitud),
            map:this.map,
            title: 'Dirección: ' + cancha.direccion,
            animation: google.maps.Animation.DROP,
            draggable: false
          });
          let miLat = geopos.coords.latitude;
          let miLng = geopos.coords.longitude;
          let _lat:number = _marker.getPosition().lat();
          let _lng:number = _marker.getPosition().lng();
          _marker.addListener('click', function(){
            let directionService = new google.maps.DirectionsService();
            let directionsRenderer = new google.maps.DirectionsRenderer();
    
            let miLatLng = new google.maps.LatLng(miLat, miLng);
            let makerLatLng = new google.maps.LatLng(_lat, _lng);
            directionsRenderer.setMap(this.map);
      
            let rutaConfig = {
              origin: makerLatLng,
              destination: miLatLng,
              travelMode: google.maps.TravelMode.WALKING,
            }
        
            directionService.route(rutaConfig, function(result, status){
              console.log(result);
              console.log(status);
              //verifico si la peticion fue resuelta con éxito y si lo fue entonces traza la ruta
              if (status == 'OK') {
                directionsRenderer.setDirections(result);
              }
            });
          });
  
          });
        });
    }).catch(error=>{
          console.log('Error al obtener coordenadas: ', error);
      });
  }

  private cargarMapa(_lat:number, _lng:number){
    //creo el mapa y configuro la posicion inicial con mi posicion actual
    this.map = new google.maps.Map(this.mapaHTML.nativeElement, {
      center: {lat: _lat, lng: _lng},
      zoom: 13
    });

    let marker = new google.maps.Marker({
      position: {lat: _lat, lng: _lng},
      map:this.map,
      title: 'Mi Ubicación',
      animation: google.maps.Animation.DROP,
    });
 
  }

  goToPush(){
    this.router.navigateByUrl('push');
  }


}
