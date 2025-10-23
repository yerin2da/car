// App.js
import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {CubeCamera, Environment, OrbitControls, PerspectiveCamera} from "@react-three/drei";
import Ground from "./Ground";
import "./style.css";
import Car from "./Car";
import Rings from "./Rings";
import {Boxes} from "./Boxes";
import {Bloom, ChromaticAberration, EffectComposer,} from "@react-three/postprocessing";
import { BlendFunction } from 'postprocessing';
import FloatingGrid from "./FloatingGrid";

function CarShow() {

    return (
        <>
            <OrbitControls target={[0, 0.35, 0]} maxPolarAngle={1.45}/>
            <PerspectiveCamera makeDefault fov={50} position={[3, 2, 5]}/>
            <color args={[0, 0, 0]} attach="background"/>
            {/*<directionalLight position={[5, 10, 5]} intensity={5}/>*/}


            {/*주변환경이 자동차에 재질에 반사되게 만들기*/}
            {/*실시간 - 주변 오브젝트가 움직이거나 자동차가 움직이면 → 반사도 계속 업데이트*/}
            <CubeCamera
                resolution={256} //256*256
                frames={Infinity}//매 프레임마다 계속 업데이트 (실시간 반사)
            >
                {(texture) => (//CubeCamera가 내부적으로 6방향을 렌더링하고, 그 결과로 나온 큐브맵 텍스처를 **texture**라는 변수로 넘겨줌

                    <>
                        {/*Drei 라이브러리 환경 맵 - cubeCamera가 찍은 실시간 반사 텍스처를 씬 전체 환경으로 사용*/}
                        <Environment map={texture} />

                        {/*Car 재질에 envMap이 있으면 실시간 반사가 적용됨*/}
                        <Car/>
                    </>
                )}
            </CubeCamera>
            <Rings/>
            <Boxes/>
            <FloatingGrid/>
            <Ground/>

            <spotLight
                color={[1, 0.25, 0.7]}
                intensity={300}           // 강하게
                distance={100}            // 영향 범위
                angle={Math.PI / 4}      // 넓게
                penumbra={0.5}
                position={[5, 10, 5]}    // 높이 올리되 거리 충분
                castShadow={true}
            />

            <spotLight
                color={[0.14, 0.5, 1]}
                intensity={300}//밝기
                angle={Math.PI / 4}
                penumbra={0.5}//빛의 가장자리 부드러움
                position={[-5, 10, 5]}
                castShadow={true}//그림자 생성
                shadow-bias={-0.0001}//그림자 정확도
            />

            {/*렌더링된 화면을 필터에 통과시키는 장치*/}
            <EffectComposer>
                {/*카메라 근처 / 원하는 위치만 선명
                나머지 물체들은 부드럽게 흐려짐
                영화/게임에서 아웃포커싱, 피사체 강조용*/}
                {/*<DepthOfField*/}
                {/*    focusDistance={0.0035}*/}
                {/*    focalLength={0.01}*/}
                {/*    bokehScale={3}*/}
                {/*    heigt={480}*/}
                {/*/>*/}

                {/*밝은 영역이 주변으로 퍼지는 느낌*/}
                <Bloom
                    blendFunction={BlendFunction.ADD}// 밝은 부분을 화면에 더함 → 빛 번짐 느낌
                    intensity={1.2}// 번짐 강도
                    width={300} height={300} // 블룸 렌더링 해상도 → 낮으면 퍼짐이 덜 정교함
                    kernelSize={5}// 블러 정도 → 커질수록 퍼짐(최대값 5)
                    luminanceThreshold={0.15}// 밝기 기준값 → 0.15보다 밝은 픽셀만 번짐
                    luminanceSmoothing={0.025}// 밝기 경계 부드럽게 → 자연스러운 퍼짐
                />

                {/*영화/게임에서 카메라 렌즈 느낌 내는 데 사용*/}
                <ChromaticAberration
                    blendFunction={BlendFunction.NORMAL}//두 이미지/효과를 섞는 방법, normal:그냥 덮어쓰기 → 색이 그대로 적용
                    offset={[0.0005, 0.0012]} // 화면이 약간 흐릿하고 빛 번짐과 섞이면 더 영화처럼 보임
                />
            </EffectComposer>

        </>
    );
}

export default function App() {
    return (
        <Canvas shadows>
            <Suspense fallback={null}>
                {/*<Environment files="/textures/studio_small_09_1k.hdr" background />*/}
                <CarShow/>
            </Suspense>
        </Canvas>
    );
}

