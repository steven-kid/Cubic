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
    themeBtnHoverColor: "#5e504c",
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
    themeBtnHoverColor: "#c98593",
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
const modelArtBtn = document.querySelector("#model-art");
const modelWizardBtn = document.querySelector("#model-wizard");
const loading = document.querySelector(".loading");
const teamLogo = document.querySelector(".team-logo");
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
  loading.innerHTML = 'Loading...<img id="load-gif" src="./img/load.gif" alt="">';
  setTimeout(() => {
    loading.innerHTML =
    'Loading Model...<img id="load-gif" src="./img/load.gif" alt="">';
  }, 600);

  setTimeout(() => {
    app.load(`/${model}.splinecode`).then(() => {
      // gsap.to(".loading", { duration: 1, display: "none", ease: "power2"});
      const tween = gsap.timeline({ delay: 0.8 });
      // loading
      tween.to(".loading", { duration: 0.5, display: "none", ease: "power2" });
      // header
      tween.from("header", { duration: 0.5, ease: "power2", y: -16 * 6 });
      tween.to("header", { duration: 0, y: 0, transition: 0.3 });
      // aside
      tween.from(".info", {
        duration: 0.5,
        ease: "power2",
        opacity: 0,
        x: -50,
        y: 50,
      });
      tween.from("#canvas3d", {
        duration: 1.5,
        ease: "power2",
        opacity: 0,
        x: 80,
      });
    });
  }, 500);
}

// follow system theme
if (
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
) {
  load(model);
} else {
  switchTheme();
}

modelArtBtn.addEventListener("click", () => {
  if (model !== "art") {
    switchTheme();
  }
});

modelWizardBtn.addEventListener("click", () => {
  if (model !== "wizard") {
    switchTheme();
  }
});

function switchTheme() {
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
  // show stats-1 on load
  let stats1 = document.querySelector("#stat-1");
  let statsTop1 = stats1.getBoundingClientRect().top;
  if (
    statsTop1 < windowHeight - elementVisible &&
    statsTop1 > windowHeight - 3 * elementVisible
  ) {
    console.log(stats1);
    let countUp1 = new CountUp(stats1, 182313);
    countUp1.start();
  }
  let stats2 = document.querySelector("#stat-2");
  let statsTop2 = stats2.getBoundingClientRect().top;
  if (
    statsTop2 < windowHeight - elementVisible &&
    statsTop2 > windowHeight - 3 * elementVisible
  ) {
    let countUp2 = new CountUp(stats2, 8119);
    countUp2.start();
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
menuBtn.addEventListener("click", () => {
  window.scrollTo(0, 0);
  document.querySelector("body").style.overflow = "hidden";
  const tween = gsap.timeline({ delay: 0.5 });
  menuBtn.style.display = "none";
  themeIcon.style.display = "none";
  nextPageBtn.style.display = "none";
  tween.from("header", { duration: 0, y: 0, transition: 0.3 });
  tween.to("header", { duration: 0.5, ease: "power2", y: -16 * 6 });
  tween.fromTo(
    ".menu",
    { y: -window.innerHeight, opacity: 0, display: "none" },
    { duration: 0.3, ease: "power2", opacity: 1, x: 0, y: 0, display: "flex" }
  );
});

const menuIcon = document.querySelector(".menu i");
menuIcon.addEventListener("click", () => {
  document.querySelector("body").style.overflow = "";
  const tween = gsap.timeline();
  tween.from("header", { duration: 0.5, ease: "power2", y: -16 * 6 });
  tween.to("header", { duration: 0, y: 0, transition: 0.3 });
  menuBtn.style.display = "flex";
  themeIcon.style.display = "flex";
  nextPageBtn.style.display = "flex";
  tween.to(".menu", { duration: 0.3, y: 30 });
  tween.to(".menu", {
    duration: 1,
    y: -window.innerHeight,
    opacity: 0,
    display: "none",
  });
});

// hover header bug fix
const hoverHeader = (e) => {
  if (e.clientY <= 90) {
    header.style.backgroundColor = colors[model].headerColor;
  } else {
    header.style.backgroundColor = colors[model].backgroundColor;
  }
};
window.onmousemove = throttle(hoverHeader, 1000);

// team logo move as mouse move
const domCenter = [
  teamLogo.getBoundingClientRect().left +
    teamLogo.getBoundingClientRect().width / 2,
  teamLogo.getBoundingClientRect().top +
    teamLogo.getBoundingClientRect().height / 2,
];
function followLogo(e){
  const domCenter = [
    teamLogo.getBoundingClientRect().left +
      teamLogo.getBoundingClientRect().width / 2,
    teamLogo.getBoundingClientRect().top +
      teamLogo.getBoundingClientRect().height / 2,
  ];
  let mouseCenter = [e.clientX, e.clientY];
  let delta = [domCenter[0] - mouseCenter[0], domCenter[1] - mouseCenter[1]];
  for (let i = 0;  i <= 1; i ++){
    if(delta[i] > 0) delta[i] = Math.min(delta[i], 100);
    else delta[i] = Math.max(delta[i], -100);
  }
  teamLogo.style.transform = 'translateX(' + delta[0] * 0.3 + 'px) translateY(' + delta[1] * 0.3 + 'px)';
  // transform: translateX(10px) translateY(10px);
  console.log(domCenter, mouseCenter);
  console.log(delta);
};
window.onmousemove = throttle(followLogo, 50);


