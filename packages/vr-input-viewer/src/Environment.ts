import * as THREE from "three";

export const createEnvironment = () => {
  const environment = new THREE.Group();

  const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
  environment.add(ambientLight);

  const directionalLightPositions: [number, number, number][] = [
    [2, 2, 0],
    [-2, 2, 0],
  ];
  for (const [x, y, z] of directionalLightPositions) {
    const light = new THREE.DirectionalLight(0xffffff, 0.4);
    light.position.set(x, y, z);
    environment.add(light);
  }

  return environment;
};
