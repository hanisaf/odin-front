import { Injectable } from '@angular/core';
import {Data} from './data';
declare const _paq:any;

@Injectable()
export class AnalyticsService {

  constructor()
  {
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
  

}
