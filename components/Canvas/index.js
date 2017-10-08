import React from "react";
import Head from "next/head";
import Voronoi from "voronoi";
import {uniqWith} from "lodash";

const renderStage = (img) => {
  const canvas = document.getElementById("stage");
  const ctx = canvas.getContext("2d");
  const width = document.getElementById("wrapper").clientWidth;
  const height = document.getElementById("wrapper").clientHeight;

  canvas.setAttribute("width", width);
  canvas.setAttribute("height", height);

  ctx.clearRect(0, 0, width, height);

  // set arc points
  let arcs = [];
  const div = 100;
  " ".repeat(width / div).split("").map((_, w) => {
    " ".repeat(height / div).split("").map((_, h) => {
      arcs.push([w * div, h * div]);
    });
  });

  // put image
  ctx.drawImage(img, 0, 0);

  // render voronoi diagram
  const voronoi = new Voronoi();
  const bbox = {xl: 0, xr: width, yt: 0, yb: height};
  const sites = arcs.map((arc) => {
    return {x: arc[0], y: arc[1]};
  });
  const diagram = voronoi.compute(sites, bbox);

  diagram.cells.forEach((cell) => {
    ctx.beginPath();
    const {halfedges} = cell;
    let points = [];
    halfedges.forEach((he) => {
      points = [
        ...points,
        [he.getStartpoint().x, he.getStartpoint().y],
        [he.getEndpoint().x, he.getEndpoint().y],
      ];
    });
    points = uniqWith(points, (l, r) => {
      return l[0] === r[0] && l[1] === r[1];
    });
    let basePoint = points[0];
    points.forEach((p) => {
      if (p[1] > basePoint[1]) {
        basePoint = p;
      }
    });
    const [x1, y1] = basePoint;
    const pointsWithDeg = points.map((point, i) => {
      const [x2, y2] = point;
      if (x1 === x2 && y1 === y2) {
        return {x: x1, y: y1, deg: Infinity};
      }
      const degree = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
      return {x: x2, y: y2, deg: degree};
    }).sort((l, r) => {
      return l.deg < r.deg;
    });

    pointsWithDeg.forEach((point, i) => {
      const {x, y} = point;

      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.closePath();

    // set color
    const canvasColor = ctx.getImageData(cell.site.x, cell.site.y, 1, 1).data;
    const r = canvasColor[0];
    const g = canvasColor[1];
    const b = canvasColor[2];
    const rgb = `rgb(${r}, ${g}, ${b})`;

    ctx.fillStyle = rgb;
    ctx.fill();

    ctx.stroke();
  });

  // const r = 5;
  // arcs.forEach((arc) => {
  //   ctx.beginPath();
  //   ctx.arc(...arc, r, 0, 360 * Math.PI / 180);
  //   ctx.stroke();
  // });
};

export default class extends React.Component {
  componentDidMount() {
    const {img} = this.props;

    renderStage(img);
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