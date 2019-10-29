import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList} from 'angularfire2/database';
//import { An } from "angularfire2/database";


@Injectable({
  providedIn: 'root'
})
export class MapServiceService {

  private listaCanchas;

  constructor(private db:AngularFireDatabase) { }


  public getListadoCanchas(): AngularFireList<any>{
    this.listaCanchas = this.db.list('canchas');
    console.info(this.listaCanchas);
    return this.listaCanchas;
  }

}
