import {useRef} from "react";
import {useFrame} from "@react-three/fiber";
import { Color } from "three";

export default function Rings() {
    const itmesRef = useRef([]);//배열을 기억하는 상자
    //itmesRef.current → 실제 내용물, 여기서 14개의 링(mesh)을 저장할 거예요.
    // 특징: 컴포넌트가 리렌더돼도 값이 유지됨.

    useFrame((state)=>{//매 프레임 반복,렌더링 프레임마다 호출됨
        let time = state.clock.getElapsedTime();//+면 뒤로

        for (let i=0; i<itmesRef.current.length; i++){//배열에 있는 모든 mesh를 꺼내서 위치 설정
            let mesh = itmesRef.current[i];//배열의 i번째 요소를 꺼내는 것
            let z = (i - 7) * 3.5 +((time * 0.4) % 3.5) * 2;//중앙(mesh7)을 기준으로 좌우로 Z축 간격을 3.5 단위로 배치
            //값이 3.5를 넘어가면 다시 0부터 배치

            mesh.position.set(0,0,-z);

            let dist = Math.abs(z);//(절댓값) 함수:숫자의 부호를 무시하고 양수로 변환
            mesh.scale.set(1 - dist * 0.04, 1 - dist * 0.04, 1 - dist * 0.04);//거리마다 얼마나 작아질지//x, y, z 축 각각의 크기를 정함
            //dist = 5, 0.8이되고 80% 크기

        //거리에따라 색상밝기 설정
        let colorScale = 1;//기본값
        if(dist > 2){//2보다 크면
            colorScale = 1 - (Math.min(dist, 12) - 2) / 10;//a와 b 중 작은 값을 돌려준다.//12를 최대값으로 제한
        }
        colorScale *= 0.5;

        //홀짝에따라 링 색상 지정
        if(i % 2 === 0){
            mesh.material.emissive = new Color(0.1, 0.7, 3).multiplyScalar(colorScale);//multiplyScalar:밝기 50%로 줄임
        }else{
            mesh.material.emissive = new Color(6, 0.15,0.7).multiplyScalar(colorScale);
        }
    }});

    return (
        <>
            {[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map((_, i) =>(
                <mesh
                    castShadow={true}
                    receiveShadow={true}
                    position={[0, 0, 0]}
                    ref={(el)=>(itmesRef.current[i] = el)}//이 mesh를 배열에 i번째로 넣어라
                    //React 렌더링 → mesh0 생성 → el = mesh0
                    // itmesRef.current[0] = mesh0
                    key={i}
                >
                    {/*도넛 만들기 - 반지름 3.35, 두께 0.05, 세그먼트 16개 단면, 높을수록 원에 가깝게 매끈해짐100*/}
                    <torusGeometry args={[3.35, 0.05, 16, 100]} />

                    {/*표면은 검정이지만, 약한 청록빛으로 스스로 빛을 내는(PBR) 재질-조명 없이도 어둡게 빛나는 링을 만들 수 있다
                    -반지 자체가 광원이 되는 느낌을 원할 때:다른 물체를 밝히지 않음(0,0,0)
                    */}
                    <meshStandardMaterial emissive={[0.5, 0.5, 0.5]} color={[0 ,0, 0]}/>
                </mesh>
            ))}
        </>
    );
};