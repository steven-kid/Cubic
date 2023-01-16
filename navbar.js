import {gsap} from "gsap";

const sizeState = {
  "BIG": 'big',
  "SMALL": "small"
};

class Navbar{
  sizeState = undefined;
  constructor(){
    this.sizeState = sizeState.BIG;
  }
  adjust = () => {
    let currentState = window.innerWidth > 880 ? sizeState.BIG : sizeState.SMALL;
    console.log(window.innerWidth);
    if(this.sizeState !== currentState){
      this.sizeState = currentState;
      this._navAdjust();
    }
  }
  _navAdjust = () => {
    switch(this.sizeState){
      case sizeState.SMALL:
        this._navBecomeSmall();
        break;
      case sizeState.BIG:
        this._navBecomeBig();
        break;
      default:
        break;
    }
  }
  _navBecomeSmall = () => {
    const tween = gsap.timeline();
    tween.to('.nav-container', {duration: 0.6, ease: "power2", opacity: 0, x: 300, display: "none"});
    tween.to('#menu', {duration: 0.3, opacity: 1, display: "flex"});
  }
  _navBecomeBig = () => {
    const tween = gsap.timeline();
    tween.to('.nav-container', {duration: 0.6, ease: "power2", opacity: 1, x: 0, display: "flex"});
    tween.to('#menu', {duration: 0.3, opacity: 0, display: "none"});
    gsap.to("#menu", {duration: 1, ease: "power2", opacity: 0, display: "none"});
  }
}

const navbar = new Navbar();

export {navbar}