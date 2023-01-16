import "./style.css";
import { Application } from "@splinetool/runtime";
// import {MathJax} from 'mathjax'
import { gsap } from "gsap/all";

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

const canvas = document.getElementById("canvas3d");
const leftPanel = document.querySelector('.left-panel');
const body = document.querySelector('body');
const app = new Application(canvas);

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
  gsap.from('.left-panel', {duration: 1, opacity:'1', ease: 'power2'});
  setTimeout(() => { 
    app.load(`./${model}.splinecode`).then(() => canvas.style.opacity = '1');
  }, 2010);
}

load(model);

const theme = document.querySelector("#theme");
theme.addEventListener("click", () => {
  model = (model === "wizard") ? "art" : "wizard";
  load(model);
});
