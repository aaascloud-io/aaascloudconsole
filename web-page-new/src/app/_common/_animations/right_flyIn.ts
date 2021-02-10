
import {
    trigger,  
    state, 
    style, 
    transition, 
    animate, 
    keyframes 
  } from "@angular/animations";
  export const right_flyIn = trigger('right_flyIn', [
    state('in', style({transform: 'translate(0)'})), 
  
    transition('void => *', [ // flyin
      animate(500, keyframes([
        style({opacity: 0, transform: 'translateX(20px)', offset: 0}),
        style({opacity: 1, transform: 'translateX(0px)',  offset: 1})
      ]))
    ]),
    transition('* => void', [ // flyout
      animate(300, keyframes([
        style({opacity: 1, transform: 'translateX(0)',     offset: 0}),
        style({opacity: 0, transform: 'translateX(20px)', offset: 1})
      ]))
    ])
  
  ]);