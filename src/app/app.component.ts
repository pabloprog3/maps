import { Component } from '@angular/core';

import { Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { OneSignal } from "@ionic-native/onesignal/ngx";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private oneSignal:OneSignal,
    private alertCtrl: AlertController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.setupNotificaciones();
    });
  }


  setupNotificaciones(){
      //this.oneSignal.setLogLevel({logLevel:5, visualLevel:5});
      this.oneSignal.startInit('2901385f-7eb0-4a21-9f87-575b90f38dab', '72891117645');
      this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
      this.oneSignal.handleNotificationOpened().subscribe(valor=>{
        this.presentAlert(valor);
      });
      this.oneSignal.endInit();
  }

  async presentAlert(valor) {
    const alert = await this.alertCtrl.create({
      header: valor.notification.payload.title,
      message: valor.notification.payload.body,
      buttons: ['Aceptar invitación', 'Rechazar']
    });
    await alert.present();
  }

}
