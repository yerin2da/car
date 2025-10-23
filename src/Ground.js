// Ground.js
import { MeshReflectorMaterial } from "@react-three/drei";
import {useFrame, useLoader} from "@react-three/fiber";
import {LinearSRGBColorSpace, RepeatWrapping, TextureLoader} from "three";
import { useEffect } from "react";

export default function Ground() {
    const roughPath = process.env.PUBLIC_URL + "/textures/terrain-roughness.jpg";
    const normalPath = process.env.PUBLIC_URL + "/textures/terrain-normal.jpg";

    const [roughness, normal] = useLoader(TextureLoader, [roughPath, normalPath]);

    // 텍스처 반복 적용
    useEffect(() => {
        [normal, roughness].forEach((tex) => {
            tex.wrapS = tex.wrapT = RepeatWrapping;
            tex.repeat.set(5, 5);
        });
        normal.encoding = LinearSRGBColorSpace;
    }, [normal, roughness] );

    useFrame((state, delta)=>{// 매 프레임마다 실행, 애니메이션
        let time = -state.clock.getElapsedTime() * 0.128;// 씬이 시작되고 흐른 시간 확인
        normal.offset.set(0, time);
        roughness.offset.set(0, time);
    });

    return (
        <mesh rotation-x={-Math.PI / 2} castShadow={true} receiveShadow={true}>
            <planeGeometry args={[30, 30]} />
            <MeshReflectorMaterial
                normalMap={normal || null}
                roughnessMap={roughness || null}
                color="#111111"
                envMapIntensity={0.5}
                dithering={true}
                roughness={0.8}
                blur={[1000, 400]}
                mixBlur={30}
                mixStrength={80}
                mixContrast={1}
                resolution={1024}
                mirror={0.5}
                depthScale={0.01}
                minDepthThreshold={0.9}
                maxDepthThreshold={1}
                depthToBlurRatioBias={0.25}
                reflectorOffset={0.2}
            />
        </mesh>
    );
}
