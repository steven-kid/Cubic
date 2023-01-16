import "./style.css";
import "animate.css"
import { Application } from "@splinetool/runtime";
// import {MathJax} from 'mathjax'
import { gsap } from "gsap/all";
import { navbar } from "./navbar";

const colors = {
  wizard: {
    headerColor: "#705f5a",
    backgroundColor: "#7b6863",
    headerTextColor: "black",
    textColor: "#221b19",
    primaryColor: "#482a2b",
    secondColor: "#db7e3e",
  },
  art: {
    headerColor: "#db91a0",
    backgroundColor: "#e698a8",
    headerTextColor: "#fff",
    textColor: "#fff",
    primaryColor: "#482a2b",
    secondColor: "#db7e3e",
  },
};

const info = {
  wizard: {
    icon: "bi bi-moon"
  },
  art: {
    icon: "bi bi-brightness-high"
  }
}

const canvas = document.getElementById("canvas3d");
const theme = document.querySelector("#theme");
const themeIcon = document.querySelector('#theme-icon')
const app = new Application(canvas);
const menu = document.querySelector('#menu');


let model = "wizard";

function load(model)
{
  canvas.style.opacity = '0';
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
  themeIcon.className = info[model].icon;
  setTimeout(() => { 
    app.load(`./${model}.splinecode`).then(() => canvas.style.opacity = '1');
  }, 2010);
}

load(model);

theme.addEventListener("click", () => {
  model = (model === "wizard") ? "art" : "wizard";
  load(model);
});

window.onload = () => {
  navbar.adjust();
  // loadAnimation();
}

window.onresize = () => {
  navbar.adjust();
}

menu.addEventListener('click', () => {
  const tween = gsap.timeline()
  tween.to('.menu', {duration: 0.3, y: 30});
  tween.to('.menu', {duration: 1, y: -window.innerHeight, opacity: 0, display: "none"});
})

// load content when scroll to it
function reveal() {
  var reveals = document.querySelectorAll(".reveal");

  for (var i = 0; i < reveals.length; i++) {
    var windowHeight = window.innerHeight;
    var elementTop = reveals[i].getBoundingClientRect().top;
    var elementVisible = 150;

    if (elementTop < windowHeight - elementVisible) {
      reveals[i].classList.add("active");
    } else {
      reveals[i].classList.remove("active");
    }
  }
}

window.addEventListener("scroll", reveal);