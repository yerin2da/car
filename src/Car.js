import {useLoader} from "@react-three/fiber";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {useEffect} from "react";
import {MeshReflectorMaterial} from "@react-three/drei";
import {Mesh} from "three";

export default function Car() {
    const gltf = useLoader(
        GLTFLoader,
        process.env.PUBLIC_URL + 'models/car/scene.gltf',
    );

    useEffect(() => {
        gltf.scene.scale.set(0.005, 0.005, 0.005);
        gltf.scene.position.set(0, -0.035, 0);
        // gltf.scene.position.set(0, 0, 5);

        gltf.scene.traverse((object) => {
            if (object instanceof Mesh) {
                object.castShadow = true;
                object.receiveShadow = true;
                object.material.envMapIntensity = 3;
            }
        });
    }, [gltf]);
    return <primitive object={gltf.scene} />;//3D 모델을 씬에 붙일 때
};