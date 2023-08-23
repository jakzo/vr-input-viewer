import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const CDN_BASE_URL =
  "https://cdn.jsdelivr.net/npm/@jakzo/vr-input-viewer/assets/";

export const createHeadset = (headsetName: string, assetsBaseUrl?: string) => {
  const group = new THREE.Group();
  const loader = new GLTFLoader();

  const loadWithUrl = (baseUrl: string, onError: (evt: ErrorEvent) => void) => {
    loader.load(
      new URL(`headsets/${headsetName}.glb`, baseUrl).toString(),
      (gltf) => {
        // TODO: Bake this into the model
        gltf.scene.rotateY(Math.PI);
        const mesh = gltf.scene.children[0] as THREE.Mesh;
        const material = mesh.material as THREE.MeshStandardMaterial;
        material.emissive = new THREE.Color(0.1, 0.1, 0.1);
        group.add(gltf.scene);
      },
      undefined,
      onError,
    );
  };

  const loadFromCdn = () =>
    loadWithUrl(CDN_BASE_URL, (err) => {
      console.error("Failed to load HMD model:", err);
    });

  if (assetsBaseUrl) loadWithUrl(assetsBaseUrl, loadFromCdn);
  else loadFromCdn();

  return group;
};
