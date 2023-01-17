import "./style.css";
import "animate.css";
import { Application } from "@splinetool/runtime";
// import {MathJax} from 'mathjax'
import { gsap } from "gsap/all";
import { navbar } from "./navbar";
import { CountUp } from "countup.js";
import * as echarts from "echarts";

function throttle(fn, interval) {
  //该变量用于记录上一次函数的执行事件
  let lastTime = 0;

  const _throttle = function (...args) {
    // 获取当前时间
    const nowTime = new Date().getTime();

    // cd剩余时间
    const remainTime = nowTime - lastTime;
    // 如果剩余时间大于间隔时间，也就是说可以再次执行函数
    if (remainTime - interval >= 0) {
      fn.apply(this, args);
      // 将上一次函数执行的时间设置为nowTime，这样下次才能重新进入cd
      lastTime = nowTime;
    }
  };
  // 返回_throttle函数
  return _throttle;
}

const colors = {
  wizard: {
    headerColor: "#705f5a",
    backgroundColor: "#7b6863",
    headerTextColor: "black",
    textColor: "#221b19",
    primaryColor: "#482a2b",
    secondColor: "#705f5a",
    strongColor: "#D85F04",
    tableFontColor: "#000",
    tableHoverColor: "#e0e0e0",
    themeBtnHoverColor: '#5e504c'
  },
  art: {
    headerColor: "#db91a0",
    backgroundColor: "#e698a8",
    headerTextColor: "#fff",
    textColor: "#fff",
    primaryColor: "#482a2b",
    secondColor: "#ffb6c1",
    strongColor: "#B2EDCE",
    tableFontColor: "#6d85b3",
    tableHoverColor: "#e0e0e0",
    themeBtnHoverColor: '#c98593'
  },
};

const info = {
  wizard: {
    icon: "bi bi-brightness-high",
  },
  art: {
    icon: "bi bi-moon",
  },
};

const header = document.querySelector("header");
const canvas = document.getElementById("canvas3d");
const theme = document.querySelector("#theme");
const themeIcon = document.querySelector("#theme-icon");
const app = new Application(canvas);
const menu = document.querySelector("#menu");
const modelArtBtn = document.querySelector('#model-art');
const modelWizardBtn = document.querySelector('#model-wizard');
let firstPageBtn = document.querySelector("#first-page");
let nextPageBtn = document.querySelector("#next-page");

let model = "wizard";

function switchProperty() {
  header.style.backgroundColor = colors[model].headerColor;
  document.documentElement.style.setProperty(
    "--background-color",
    colors[model].backgroundColor
  );
  document.documentElement.style.setProperty(
    "--header-color",
    colors[model].headerColor
  );
  document.documentElement.style.setProperty(
    "--header-text-color",
    colors[model].headerTextColor
  );
  document.documentElement.style.setProperty(
    "--text-color",
    colors[model].textColor
  );
  document.documentElement.style.setProperty(
    "--strong-color",
    colors[model].strongColor
  );
  document.documentElement.style.setProperty(
    "--second-color",
    colors[model].secondColor
  );
  document.documentElement.style.setProperty(
    "--table-font-color",
    colors[model].tableFontColor
  );
  document.documentElement.style.setProperty(
    "--table-hover-color",
    colors[model].tableHoverColor
  );
  document.documentElement.style.setProperty(
    "--theme-btn-hover-color",
    colors[model].themeBtnHoverColor
  );
  themeIcon.className = info[model].icon;
}

function load(model) {
  setTimeout(() => {
    app.load(`./${model}.splinecode`).then(() => {
      // gsap.to(".loading", { duration: 1, display: "none", ease: "power2"});
      const tween = gsap.timeline({delay: 0.8});
      // loading
      tween.to(".loading", {duration: 0.5, display: "none", ease: "power2"});
      // header
      tween.from("header", {duration: 0.5, ease: "power2", y: -16*6});
      tween.to("header", {duration: 0, y: 0, transition: 0.3});
      // aside
      tween.from(".info", {duration: 0.5, ease: "power2", opacity: 0, x: -50, y: 50});
      tween.from("#canvas3d", {duration: 1.5, ease: "power2", opacity: 0, x: 80});
    }); 
  }, 500);
}

// follow system theme
if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches){
  load(model);
} else {
  switchTheme();
}

modelArtBtn.addEventListener('click', () => {
  if(model !== 'art'){
    console.log('art');
    switchTheme();
  }
})

modelWizardBtn.addEventListener('click', () => {
  if(model !== 'wizard'){
    console.log('wizard');
    switchTheme();
  }
})

function switchTheme(){
  let oldModel = model;
  model = model === "wizard" ? "art" : "wizard";
  gsap.fromTo(
    ".loading",
    {
      backgroundColor: colors[oldModel].backgroundColor,
      color: colors[oldModel].textColor,
    },
    {
      backgroundColor: colors[model].backgroundColor,
      color: colors[model].textColor,
      duration: 1,
      display: "flex",
      ease: "power2",
    }
    );
  switchProperty();
  load(model);
}

theme.addEventListener("click", switchTheme);

window.onload = () => {
  navbar.adjust();
  // loadAnimation();
};

window.onresize = () => {
  navbar.adjust();
};

menu.addEventListener("click", () => {
  const tween = gsap.timeline();
  tween.to(".menu", { duration: 0.3, y: 30 });
  tween.to(".menu", {
    duration: 1,
    y: -window.innerHeight,
    opacity: 0,
    display: "none",
  });
});

// load content when scroll to it
function reveal() {
  let reveals = document.querySelectorAll(".reveal");
  let windowHeight = window.innerHeight;
  const elementVisible = 150;
  for (let i = 0; i < reveals.length; i++) {
    let elementTop = reveals[i].getBoundingClientRect().top;

    if (elementTop < windowHeight - elementVisible) {
      reveals[i].classList.add("active");
    } else {
      reveals[i].classList.remove("active");
    }
  }
  // show stats on load
  let stats = document.querySelector("#stat");
  let statsTop = stats.getBoundingClientRect().top;
  if (
    statsTop < windowHeight - elementVisible &&
    statsTop > windowHeight - 2 * elementVisible
  ) {
    let countUp = new CountUp("stat", 8119);
    countUp.start();
  }
  // show and hide next-pade btn
  let nextPageBtn = document.querySelector("#next-page");
  let nextPageBtnTop = nextPageBtn.getBoundingClientRect().top;
  if (nextPageBtnTop < windowHeight - elementVisible) {
    nextPageBtn.classList.add("hide");
  } else {
    nextPageBtn.classList.remove("hide");
  }
  // show back to top btn
  if (
    document.documentElement.scrollTop >
    0.3 * document.documentElement.scrollHeight
  ) {
    firstPageBtn.classList.remove("hide");
  } else {
    firstPageBtn.classList.add("hide");
  }
}

firstPageBtn.addEventListener("click", () =>
  nextPageBtn.classList.remove("hide")
);

window.addEventListener("scroll", throttle(reveal, 100));
reveal();

// hover nav when scroll up
function scrollEvent() {
  window.onscroll = throttle(function (e) {
    scrollFunc();
    if (scrollDirection == "down") {
      header.style.backgroundColor = colors[model].backgroundColor;
    } else if (scrollDirection == "up") {
      header.style.backgroundColor = colors[model].headerColor;
    }
  }, 100);
}
scrollEvent();

var scrollAction = { x: "undefined", y: "undefined" },
  scrollDirection;
function scrollFunc() {
  if (typeof scrollAction.x == "undefined") {
    scrollAction.x = window.pageXOffset;
    scrollAction.y = window.pageYOffset;
  }
  var diffX = scrollAction.x - window.pageXOffset;
  var diffY = scrollAction.y - window.pageYOffset;
  if (diffX < 0) {
    // Scroll right
    scrollDirection = "right";
  } else if (diffX > 0) {
    // Scroll left
    scrollDirection = "left";
  } else if (diffY < 0) {
    // Scroll down
    scrollDirection = "down";
  } else if (diffY > 0) {
    // Scroll up
    scrollDirection = "up";
  } else {
    // First scroll event
  }
  scrollAction.x = window.pageXOffset;
  scrollAction.y = window.pageYOffset;
}

// mobile menu
const menuBtn = document.querySelector("#menu");
menuBtn.addEventListener('click', ()=>{
  window.scrollTo(0,0);
  document.querySelector('body').style.overflow = 'hidden';
  const tween = gsap.timeline({delay: 0.5});
  menuBtn.style.display = 'none';
  themeIcon.style.display = 'none';
  nextPageBtn.style.display = 'none';
  tween.from("header", {duration: 0, y: 0, transition: 0.3});
  tween.to("header", {duration: 0.5, ease: "power2", y: -16*6});
  tween.fromTo(".menu", {y:-window.innerHeight, opacity:0, display:"none"}, {duration:0.3, ease: "power2", opacity: 1, x: 0, y: 0, display: 'flex'})

})

const menuIcon = document.querySelector(".menu i");
menuIcon.addEventListener('click', () => {
  document.querySelector('body').style.overflow = '';
  const tween = gsap.timeline()
  tween.from("header", {duration: 0.5, ease: "power2", y: -16*6});
  tween.to("header", {duration: 0, y: 0, transition: 0.3});
  menuBtn.style.display = 'flex';
  themeIcon.style.display = 'flex';
  nextPageBtn.style.display = 'flex';
  tween.to('.menu', {duration: 0.3, y: 30});
  tween.to('.menu', {duration: 1, y: -window.innerHeight, opacity: 0, display: "none"});
})

// // echart
// var chartDom = document.getElementById('stat-table1');
// var myChart = echarts.init(chartDom);
// var option;

// // prettier-ignore
// const hours = [
//     '12a', '1a', '2a', '3a', '4a', '5a', '6a',
//     '12p', '1p', '2p', '3p', '4p', '5p',
//     '6p', '7p', '8p', '9p', '10p', '11p'
// ];
// // prettier-ignore
// const days = [
//     'Saturday', 'Friday', 'Thursday',
//     'Wednesday', 'Tuesday', 'Monday', 'Sunday'
// ];
// // prettier-ignore
// const data = [[0, 0, 5], [0, 1, 1], [0, 9, 0], [0, 10, 0], [0, 11, 2], [0, 12, 4], [0, 13, 1], [0, 14, 1], [0, 15, 3], [0, 16, 4], [0, 17, 6], [0, 18, 4], [0, 19, 4], [0, 20, 3], [0, 21, 3], [0, 22, 2], [0, 23, 5], [1, 0, 7], [1, 1, 0], [1, 2, 0], [1, 3, 0], [1, 4, 0], [1, 5, 0], [1, 6, 0], [1, 7, 0], [1, 8, 0], [1, 9, 0], [1, 10, 5], [1, 11, 2], [1, 12, 2], [1, 13, 6], [1, 14, 9], [1, 15, 11], [1, 16, 6], [1, 17, 7], [1, 18, 8], [1, 19, 12], [1, 20, 5], [1, 21, 5], [1, 22, 7], [1, 23, 2], [2, 0, 1], [2, 1, 1], [2, 2, 0], [2, 3, 0], [2, 4, 0], [2, 5, 0], [2, 6, 0], [2, 7, 0], [2, 8, 0], [2, 9, 0], [2, 10, 3], [2, 11, 2], [2, 12, 1], [2, 13, 9], [2, 14, 8], [2, 15, 10], [2, 16, 6], [2, 17, 5], [2, 18, 5], [2, 19, 5], [2, 20, 7], [2, 21, 4], [2, 22, 2], [2, 23, 4], [3, 0, 7], [3, 1, 3], [3, 2, 0], [3, 3, 0], [3, 4, 0], [3, 5, 0], [3, 6, 0], [3, 7, 0], [3, 8, 1], [3, 9, 0], [3, 10, 5], [3, 11, 4], [3, 12, 7], [3, 13, 14], [3, 14, 13], [3, 15, 12], [3, 16, 9], [3, 17, 5], [3, 18, 5], [3, 19, 10], [3, 20, 6], [3, 21, 4], [3, 22, 4], [3, 23, 1], [4, 0, 1], [4, 1, 3], [4, 2, 0], [4, 3, 0], [4, 4, 0], [4, 5, 1], [4, 6, 0], [4, 7, 0], [4, 8, 0], [4, 9, 2], [4, 10, 4], [4, 11, 4], [4, 12, 2], [4, 13, 4], [4, 14, 4], [4, 15, 14], [4, 16, 12], [4, 17, 1], [4, 18, 8], [4, 19, 5], [4, 20, 3], [4, 21, 7], [4, 22, 3], [4, 23, 0], [5, 0, 2], [5, 1, 1], [5, 2, 0], [5, 3, 3], [5, 4, 0], [5, 5, 0], [5, 6, 0], [5, 7, 0], [5, 8, 2], [5, 9, 0], [5, 10, 4], [5, 11, 1], [5, 12, 5], [5, 13, 10], [5, 14, 5], [5, 15, 7], [5, 16, 11], [5, 17, 6], [5, 18, 0], [5, 19, 5], [5, 20, 3], [5, 21, 4], [5, 22, 2], [5, 23, 0], [6, 0, 1], [6, 1, 0], [6, 2, 0], [6, 3, 0], [6, 4, 0], [6, 5, 0], [6, 6, 0], [6, 7, 0], [6, 8, 0], [6, 9, 0], [6, 10, 1], [6, 11, 0], [6, 12, 2], [6, 13, 1], [6, 14, 3], [6, 15, 4], [6, 16, 0], [6, 17, 0], [6, 18, 0], [6, 19, 0], [6, 20, 1], [6, 21, 2], [6, 22, 2], [6, 23, 6]]
//     .map(function (item) {
//     return [item[1], item[0], item[2] || '-'];
// });
// option = {
//   tooltip: {
//     position: 'top'
//   },
//   grid: {
//     height: '50%',
//     top: '10%'
//   },
//   xAxis: {
//     type: 'category',
//     data: hours,
//     splitArea: {
//       show: true
//     }
//   },
//   yAxis: {
//     type: 'category',
//     data: days,
//     splitArea: {
//       show: true
//     }
//   },
//   visualMap: {
//     min: 0,
//     max: 10,
//     calculable: true,
//     orient: 'horizontal',
//     left: 'center',
//     bottom: '15%'
//   },
//   series: [
//     {
//       name: 'Punch Card',
//       type: 'heatmap',
//       data: data,
//       label: {
//         show: true
//       },
//       emphasis: {
//         itemStyle: {
//           shadowBlur: 10,
//           shadowColor: 'rgba(0, 0, 0, 0.5)'
//         }
//       }
//     }
//   ]
// };

// option && myChart.setOption(option);