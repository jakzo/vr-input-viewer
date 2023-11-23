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
        // TODO: Bake these into the models
        gltf.scene.rotateY(Math.PI);
        makeMaterialsEmissive(gltf.scene);
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

const makeMaterialsEmissive = (parent: THREE.Object3D) => {
  for (const child of parent.children) {
    if (child instanceof THREE.Mesh) {
      if (child.material instanceof THREE.MeshStandardMaterial) {
        child.material.emissive = new THREE.Color(0.2, 0.2, 0.2);
      }
    }

    makeMaterialsEmissive(child);
  }
};
