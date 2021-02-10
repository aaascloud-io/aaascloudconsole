
import {
    trigger,  
    state, 
    style, 
    transition, 
    animate, 
    keyframes 
  } from "@angular/animations";
  
  export const bottom_flyIn = trigger('bottom_flyIn', [
    state('in', style({transform: 'translate(0)'})), 
  
    transition('void => *', [ // flyin
      animate(500, keyframes([
        style({opacity: 0, transform: 'translateY(20px)', offset: 0}),
        style({opacity: 1, transform: 'translateY(0px)',  offset: 1})
      ]))
    ]),
    transition('* => void', [ // flyout
      animate(300, keyframes([
        style({opacity: 1, transform: 'translateY(0)',     offset: 0}),
        style({opacity: 1, transform: 'translateY(20px)', offset: 1})
      ]))
    ])
  
  ]);