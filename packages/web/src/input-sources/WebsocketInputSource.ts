import { Builder } from "flatbuffers";
import { Serialized, processSerializedMessage } from "@jakzo/vr-input-viewer";
import { VrInputSource, type VrInputSourceConfig } from "./VrInputSource";

export interface WebsocketInputSourceOpts {
  hostOrUrl: string;
}

export class WebsocketInputSource extends VrInputSource<WebsocketInputSourceOpts> {
  static config: VrInputSourceConfig<WebsocketInputSourceOpts> = {
    name: "Websocket",
    opts: {
      hostOrUrl: {
        type: "string",
        defaultValue: "",
        placeholder: "127.0.0.1",
        tip: "IP address, hostname or Websocket URL of the machine sending the VR inputs (leave empty for this device).",
      },
    },
  };

  override type = WebsocketInputSource;

  ws: WebSocket | undefined;
  isOpen = false;
  retryDelay = 15_000;
  retryTimeout: number | undefined;

  override onOptsChanged(
    newOpts: WebsocketInputSourceOpts,
    prevOpts: WebsocketInputSourceOpts | undefined,
  ) {
    if (newOpts.hostOrUrl !== prevOpts?.hostOrUrl)
      this.connect(newOpts.hostOrUrl, true);
  }

  override onStart() {
    this.sendStart();
  }

  override onUpdate() {}

  override onStop() {
    this.sendStop();
  }

  override onDestroy() {
    this.close();
  }

  connect(hostOrUrl: string, isInitialConnection = false) {
    this.close();

    const hostHasProtocol = hostOrUrl.includes("://");
    const url = new URL(
      hostHasProtocol ? hostOrUrl : `ws://${hostOrUrl || "127.0.0.1"}`,
    );
    if (!url.port && !hostHasProtocol && url.pathname === "/")
      url.port = "6161";
    const urlStr = url.toString();
    this.ws = new WebSocket(url.toString());
    this.ws.binaryType = "arraybuffer";
    this.ws.addEventListener("open", () => {
      this.log.info("Connected");
      this.isOpen = true;
      this.setAvailable(true);
      if (this.isStarted) this.sendStart();
    });

    this.ws.addEventListener("error", () => {
      if (this.isOpen) this.log.warn("Connection error");
      else if (isInitialConnection) {
        this.log.warn(
          `Failed to connect to ${
            urlStr === "ws://127.0.0.1:6161/" ? "this device" : urlStr
          }, will retry in background...`,
        );
      }
    });

    this.ws.addEventListener("close", () => {
      if (this.isOpen) this.log.info("Connection closed");
      this.ws = undefined;
      if (!this.retryTimeout) {
        this.retryTimeout = window.setTimeout(
          () => this.connect(hostOrUrl),
          this.retryDelay,
        );
      }
      this.setAvailable(false);
    });

    this.ws.addEventListener(
      "message",
      (evt: MessageEvent<ArrayBuffer | string>) => {
        if (typeof evt.data === "string") {
        } else if (this.inputViewer) {
          processSerializedMessage(this.inputViewer, evt.data);
        }
      },
    );
  }

  sendStart() {
    if (!this.isOpen) return;
    const builder = new Builder();
    const start = Serialized.Start.createStart(builder);
    Serialized.Message.startMessage(builder);
    Serialized.Message.addStart(builder, start);
    builder.finish(Serialized.Message.endMessage(builder));
    this.ws.send(builder.dataBuffer().bytes());
  }

  sendStop() {
    if (!this.isOpen) return;
    const builder = new Builder();
    const stop = Serialized.Stop.createStop(builder);
    Serialized.Message.startMessage(builder);
    Serialized.Message.addStop(builder, stop);
    builder.finish(Serialized.Message.endMessage(builder));
    this.ws.send(builder.dataBuffer().bytes());
  }

  close() {
    try {
      this.ws?.close();
    } catch {}
    this.ws = undefined;
    clearTimeout(this.retryTimeout);
    this.retryTimeout = undefined;
    this.setAvailable(false);
  }
}
