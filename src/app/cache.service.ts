import { Injectable } from '@angular/core';


@Injectable({providedIn: 'root'})
export class CacheService {



  constructor() {
  
  }


setCache(label: string, data: any): void {

    localStorage.setItem(label, JSON.stringify({data: data}))

}


getCache(label:string): any {
return JSON.parse(localStorage.getItem(label))
}

 
removeCache(label:string): void {
    localStorage.removeItem(label);
}



}
