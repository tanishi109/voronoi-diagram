import React from "react";
import Head from "next/head";
import Voronoi from "voronoi";

const renderStage = (x = 200, division = 5) => {
  const canvas = document.getElementById("stage");
  const ctx = canvas.getContext("2d");
  const width = document.getElementById("wrapper").clientWidth;
  const height = document.getElementById("wrapper").clientHeight;

  canvas.setAttribute("width", width);
  canvas.setAttribute("height", height);

  ctx.clearRect(0, 0, width, height);

  const arcs = [
    [50, 50],
    [50, 100],
    [100, 50],
    [100, 100],
  ];

  const voronoi = new Voronoi();
  const bbox = {xl: 0, xr: width, yt: 0, yb: height};
  const sites = arcs.map((arc) => {
    return {x: arc[0], y: arc[1]};
  });
  const diagram = voronoi.compute(sites, bbox);

  diagram.cells.forEach((cell, ii) => {
    ctx.beginPath();
    cell.halfedges.forEach((he, i) => {
      const {x: ax, y: ay} = he.edge.va;
      const {x: bx, y: by} = he.edge.vb;

      i === 0 ? ctx.moveTo(ax, ay) : ctx.lineTo(ax, ay);
      ctx.lineTo(bx, by);
    });
    ctx.closePath();
    ctx.fillStyle = ["red", "blue", "green", "yellow"][ii];
    ctx.fill();
    ctx.stroke();
  });

  const r = 5;
  arcs.forEach((arc) => {
    ctx.beginPath();
    ctx.arc(...arc, r, 0, 360 * Math.PI / 180);
    ctx.stroke();
  });
};

export default class extends React.Component {
  componentDidMount() {
    this.initDatGUI();

    renderStage();
  }

  initDatGUI() {
    const gui = new dat.GUI();
    const params = {
    };
  }

  render() {
    return (
      <div id="wrapper" className="wrapper">
        {this.head()}
        <canvas id="stage" className="stage" />
        <style jsx>{`
          div {
            width: calc(100vw - 50px);
            height: 100vh;
            margin: 25px;
          }
          canvas {
            width: calc(100vw - 25px - 25px);
            height: calc(100vh - 25px - 25px);
            border: 1px solid #000;
            border-radius: 2px;
          }
        `}</style>
        <style jsx global>{`
          html,
          body {
            margin: 0;
            padding: 0;
          }
        `}</style>
      </div>
    );
  }

  head() {
    return (
      <Head>
        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.6.5/dat.gui.min.js"></script>
      </Head>
    );
  }
}