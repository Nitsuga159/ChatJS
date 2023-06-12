import CONST_ID from "@/types/const.type";

export default function loader(color: string): HTMLDivElement {
  const $divContainer = document.createElement("div");
  $divContainer.id = CONST_ID.LOADER;
  $divContainer.setAttribute(
    "style",
    "position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; background-color: rgb(10, 10, 10, .5); z-index: var(--maxIndex);"
  );

  const $svgElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );
  $svgElement.setAttribute("version", "1.1");
  $svgElement.setAttribute("id", "L6");
  $svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  $svgElement.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
  $svgElement.setAttribute("x", "0px");
  $svgElement.setAttribute("y", "0px");
  $svgElement.setAttribute("viewBox", "0 0 100 100");
  $svgElement.setAttribute("enable-background", "new 0 0 100 100");
  $svgElement.setAttribute("xml:space", "preserve");
  $svgElement.setAttribute("style", "height: 8rem");

  const $rect1 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  $rect1.setAttribute("fill", "none");
  $rect1.setAttribute("stroke", color);
  $rect1.setAttribute("stroke-width", "4");
  $rect1.setAttribute("x", "25");
  $rect1.setAttribute("y", "25");
  $rect1.setAttribute("width", "50");
  $rect1.setAttribute("height", "50");

  const $animateTransform = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "animateTransform"
  );
  $animateTransform.setAttribute("attributeName", "transform");
  $animateTransform.setAttribute("dur", "0.5s");
  $animateTransform.setAttribute("from", "0 50 50");
  $animateTransform.setAttribute("to", "180 50 50");
  $animateTransform.setAttribute("type", "rotate");
  $animateTransform.setAttribute("id", "strokeBox");
  $animateTransform.setAttribute("attributeType", "XML");
  $animateTransform.setAttribute("begin", "rectBox.end");

  $rect1.appendChild($animateTransform);

  const $rect2 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  $rect2.setAttribute("x", "27");
  $rect2.setAttribute("y", "27");
  $rect2.setAttribute("fill", color);
  $rect2.setAttribute("width", "46");
  $rect2.setAttribute("height", "50");

  const $animate = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "animate"
  );
  $animate.setAttribute("attributeName", "height");
  $animate.setAttribute("dur", "1.3s");
  $animate.setAttribute("attributeType", "XML");
  $animate.setAttribute("from", "50");
  $animate.setAttribute("to", "0");
  $animate.setAttribute("id", "rectBox");
  $animate.setAttribute("fill", "freeze");
  $animate.setAttribute("begin", "0s;strokeBox.end");

  $rect2.appendChild($animate);

  $svgElement.appendChild($rect1);
  $svgElement.appendChild($rect2);

  $divContainer.appendChild($svgElement);

  return $divContainer;
}
