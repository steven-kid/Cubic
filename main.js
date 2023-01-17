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
  },
};

const info = {
  wizard: {
    icon: "bi bi-moon",
  },
  art: {
    icon: "bi bi-brightness-high",
  },
};

const header = document.querySelector("header");
const canvas = document.getElementById("canvas3d");
const theme = document.querySelector("#theme");
const themeIcon = document.querySelector("#theme-icon");
const app = new Application(canvas);
const menu = document.querySelector("#menu");
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
      tween.from("canvas", {duration: 1.5, ease: "power2", opacity: 0, x: 80});
    }); 
  }, 500);
}

load(model);

theme.addEventListener("click", () => {
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
});

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
  menuBtn.style.display = 'inline';
  themeIcon.style.display = 'inline';
  nextPageBtn.style.display = 'inline';
  tween.to('.menu', {duration: 0.3, y: 30});
  tween.to('.menu', {duration: 1, y: -window.innerHeight, opacity: 0, display: "none"});
})

// echart
// var myChart = echarts.init(document.getElementById("stat-table"));
// // 绘制图表
// myChart.setOption({
//   title: {
//     text: "ECharts 入门示例",
//   },
//   toolbox: {
//     //工具栏
//     show: true, //是否显示
//     feature: {
//       //各工具配置项
//       mark: { show: true },
//       dataView: { show: true, readOnly: false }, //数据视图，可以展现当前图表数据，还可以动态修改更新
//       restore: { show: true }, //配置项还原
//       saveAsImage: { show: true }, //保存为图片
//     },
//   },
//   series: [
//     {
//       type: "pie",
//       data: [
//         {
//           value: 100,
//           name: "A",
//         },
//         {
//           value: 200,
//           name: "B",
//         },
//         {
//           value: 300,
//           name: "C",
//         },
//         {
//           value: 400,
//           name: "D",
//         },
//         {
//           value: 500,
//           name: "E",
//         },
//       ],
//       roseType: "area",
//     },
//   ],
// });
