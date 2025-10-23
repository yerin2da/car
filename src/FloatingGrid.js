import {useFrame, useLoader} from "@react-three/fiber";
import {RepeatWrapping, TextureLoader} from "three";
import {useEffect} from "react";

export default function FloatingGrid() {
    const diffuse = useLoader(TextureLoader, process.env.PUBLIC_URL + "textures/grid-texture.png");

    // 텍스처 반복 적용
    useEffect(() => {
        diffuse.wrapS = RepeatWrapping;//가로
        diffuse.wrapT = RepeatWrapping;//세로

        diffuse.anisotrop = 4;//숫자가 커질수록 빛이 더 길게 늘어남
        diffuse.repeat.set(30,30);
        diffuse.offset.set(0,0);// 원래 위치, x/y 움직일 때 사용
    }, [diffuse]);

    useFrame((state, delta)=>{// 매 프레임마다 실행, 애니메이션
        let time = -state.clock.getElapsedTime() * 0.68;// 씬이 시작되고 흐른 시간 확인
        diffuse.offset.set(0, time);
    });

    return (
        <mesh rotation-x={-Math.PI / 2} position={[0, 0.425, 0]}>
            <planeGeometry args={[35,35]} />

            {/*빛에 영향을 받지 않는 기본 재질*/}
            <meshBasicMaterial
                color={[1,1,1]}
                opacity={0.15}
                map={diffuse}//재질에 입힐 Diffuse 텍스처
                alphaMap={diffuse}//diffuse 텍스처의 흰색은 불투명 / 검정색은 투명이 됨
                transparent={true}//재질에서 투명도를 허용
            />
        </mesh>
    );
};