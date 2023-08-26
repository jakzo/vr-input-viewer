import DOMPurify from "dompurify";
import { VirtualXRInputSource } from "../utils/utils.js";
import { layouts } from "./layouts.js";

export class IsolatedSvg extends HTMLElement {
  static get observedAttributes() {
    return ["svg-src"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.setSvg(this.getAttribute("svg-src") ?? "");
  }

  attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
    if (name === "svg-src") this.setSvg(newValue);
  }

  private setSvg(svgSrc: string) {
    this.shadowRoot!.innerHTML = DOMPurify.sanitize(svgSrc);
  }
}

if (!customElements.get("isolated-svg"))
  customElements.define("isolated-svg", IsolatedSvg);

export interface ControllerHudOpts {
  xrInputSource: VirtualXRInputSource;
  container: Element;
  layout?: string | undefined;
}

export class ControllerHud {
  layout: string;
  container = document.createElement("isolated-svg");
  buttonElements: {
    base: HTMLElement[];
    touched: HTMLElement[];
    pressed: HTMLElement[];
  }[];
  axisElements: {
    isX: boolean;
    factor: number;
    el: HTMLElement;
  }[][];
  isMirrored: boolean;

  constructor(public opts: ControllerHudOpts) {
    this.layout = opts.layout ?? "Generic";
    const svgSrcs = layouts[this.layout];
    const [svgSrcLeft, svgSrcRight] = Array.isArray(svgSrcs)
      ? svgSrcs
      : [svgSrcs];
    if (!svgSrcLeft)
      throw new Error(`Controller layout not found for: ${this.layout}`);
    this.isMirrored = opts.xrInputSource.handedness === "right" && !svgSrcRight;
    const svgSrc =
      opts.xrInputSource.handedness === "left" || this.isMirrored
        ? svgSrcLeft
        : svgSrcRight!;

    this.container.style.cssText = Object.entries({
      position: "absolute",
      bottom: "0",
      width: "40%",
      "max-width": "40%",
      "max-height": "50%",
      "aspect-ratio": "1/1",
      "pointer-events": "none",
      ...(opts.xrInputSource.handedness === "left"
        ? { left: "0" }
        : { right: "0" }),
      ...(this.isMirrored ? { transform: "scaleX(-1)" } : {}),
    })
      .map((entry) => entry.join(":"))
      .join(";");

    const svgSrcSanitized = DOMPurify.sanitize(svgSrc);
    this.container.setAttribute("svg-src", svgSrcSanitized);
    const svg = this.container.shadowRoot!.querySelector("svg");
    if (!svg)
      throw new Error("Controller layout does not contain an SVG element");
    svg.style.width = svg.style.height = "100%";
    opts.container.append(this.container);

    this.buttonElements = opts.xrInputSource.gamepad.buttons.map(
      (_button, idx) => ({
        base: [
          ...this.container.shadowRoot!.querySelectorAll<HTMLElement>(
            `.button${idx}`,
          ),
        ],
        touched: [
          ...this.container.shadowRoot!.querySelectorAll<HTMLElement>(
            `.button${idx}-touched`,
          ),
        ],
        pressed: [
          ...this.container.shadowRoot!.querySelectorAll<HTMLElement>(
            `.button${idx}-pressed`,
          ),
        ],
      }),
    );

    this.axisElements = opts.xrInputSource.gamepad.axes.map((_value, idx) => {
      const getAxisElements = (axis: string) =>
        [
          ...this.container.shadowRoot!.querySelectorAll<HTMLElement>(
            `.axis${idx}${axis}`,
          ),
        ].map((el) => ({
          isX: axis === "x",
          factor: +el.dataset["factor"]!,
          el,
        }));
      return [...getAxisElements("x"), ...getAxisElements("y")];
    });

    this.update();
  }

  remove() {
    this.container.remove();
  }

  update = () => {
    if (!this.container.parentNode) return;
    requestAnimationFrame(this.update);

    for (const [
      idx,
      button,
    ] of this.opts.xrInputSource.gamepad.buttons.entries()) {
      const buttonEls = this.buttonElements[idx];
      if (!buttonEls) continue;
      if (button.pressed) {
        for (const el of buttonEls.base) el.style.display = "none";
        for (const el of buttonEls.touched) el.style.display = "none";
        for (const el of buttonEls.pressed) el.style.display = "initial";
      } else if (button.touched) {
        for (const el of buttonEls.base) el.style.display = "none";
        for (const el of buttonEls.touched) el.style.display = "initial";
        for (const el of buttonEls.pressed) el.style.display = "none";
      } else {
        for (const el of buttonEls.base) el.style.display = "initial";
        for (const el of buttonEls.touched) el.style.display = "none";
        for (const el of buttonEls.pressed) el.style.display = "none";
      }
    }

    for (const [idx, axis] of this.opts.xrInputSource.gamepad.axes.entries()) {
      const axisEls = this.axisElements[idx];
      if (!axisEls) continue;
      for (const { isX, factor, el } of axisEls) {
        const translated: [number, number] = [0, 0];
        const translateMatch =
          el.style.transform.match(/translate\(([^)]+)\)/)?.[1];
        for (const [i, n] of translateMatch?.split(",").entries() ?? []) {
          const match = n.match(/-?\d+/)?.[0];
          if (!match) continue;
          translated[i] = +match;
        }
        translated[isX ? 0 : 1] =
          axis * (this.isMirrored && isX ? -factor : factor);
        el.style.transform = `translate(${translated
          .map((n) => `${n}px`)
          .join(", ")})`;
      }
    }
  };
}
