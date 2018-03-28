import { MessageService } from './message.service';
import { Injectable } from '@angular/core';
import {Data} from './data';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs/Subscription';
import { timer } from 'rxjs/observable/timer';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/fromEvent';

declare const _paq:any;

@Injectable()
export class AnalyticsService {
    mousesubscription: Subscription;
  timersubscribe: Subscription;
  constructor(private messageService: MessageService, private cookieService: CookieService)
  {
  }
  ngOnInit() {
  }
   
    trackmouse() {
    let mouseTrackList: { x: number, y: number, t: number }[] = [];
        
    let triggertype:string = Data.CONFIG.track_mouse_movement_trigger;
          //let flag: boolean = true;
          this.mousesubscription = 
            Observable.fromEvent(document, 'mousemove')
                      .subscribe(e => {
                        let obj = e as any;
                        console.log(e);
                        
                        let mouseData = {"x": obj.clientX, "y": obj.clientY, "t": Math.round(obj.timeStamp)};
                        mouseTrackList.push(mouseData);
                       // console.log(mouseData);
                       
                       if (Data.CONFIG.track_mouse_movement_trigger  == "minitems")
                        {
                          let mintimes:number = Data.CONFIG.track_mouse_movement_minitems  as number;
                          if (mintimes>0 && mouseTrackList.length >= mintimes / 20) //it is divided by 20, because of Matomo's limitation of 255 chars
                          {
                                
                                //POST mouseTrackList to the server
                                //var dataStr = JSON.stringify(mouseTrackList);
                                var dataStr = mouseTrackList.map(function(val) {
                                  return val.x + ',' + val.y + ',' + val.t;
                                }).join(';');
                                this.messageService.log(dataStr);
                                _paq.push(['setCustomDimension', Data.CONFIG.track_mouse_customdimension_id, dataStr]); 

                                mouseTrackList.length = 0; //empty the list
                          }
                        }          
                      });
        
          // This section is commented out because of Matomo's 255 char limit: https://github.com/matomo-org/plugin-CustomDimensions/issues/79
          // if (triggertype=="interval") 
          // {
          //   let interval:number = Data.CONFIG.track_mouse_movement_interval as number;
          //   if (interval>0)
          //   {
          //     let timer = Observable.timer(0,interval*1000);
          //     this.timersubscribe = timer.subscribe(t=>
          //       {
          //         //this.ticks = t
          //         //POST mouseTrackList to the server
          //         console.log(mouseTrackList);
          //         mouseTrackList.length = 0; //empty the list
          //       });
          //   }
          
          
          // }
  }
    
  trackuser()  {
    _paq.push(['trackPageView']);
    _paq.push(['enableLinkTracking']);

    let userid = null;
    //read userid from local storage
    //this.localStorage.getItem<String>('userid').subscribe((data) => {userid=data;}); 
    userid = this.cookieService.get('userid');
    
    if ( userid == "") //new user?
    {
      userid = Math.random().toString(36).slice(2); //generate random string as userid
      //this.localStorage.setItem('userid', userid).subscribe(() => {});
      this.cookieService.set('userid', userid );
    }
    
    //set userid into matomo
    _paq.push(['setUserId', userid]);
  }
  
  //track an event into Matomo
  trackevent(category:String, actionName:String, eventName:String,  value?: Number)
  {
    if (Data.CONFIG.analytics_enabled)
        {  
            if (value != null) 
                _paq.push(['trackEvent', category, actionName, eventName, value]);
            else
                _paq.push(['trackEvent', category, actionName, eventName]);
        }
  }
  
  ngOnDestroy() {
    this.mousesubscription.unsubscribe();
    this.timersubscribe.unsubscribe();
  }
}
