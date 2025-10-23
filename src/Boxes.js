import {useRef, useState} from "react";
import {Vector3} from "three";
import {useFrame} from "@react-three/fiber";

function Box({color}) {
    const box = useRef();

    //상자는 x축, y축에서 무작위로 회전
    const [xRotateSpeed] = useState(()=> Math.random());
    const [yRotateSpeed] = useState(()=> Math.random());
                                           //0 ~ 1 사이 랜덤 숫자(x)를 (y)만큼 제곱
                                                       // x	        y	    결과
                                                       // 2	        3        8 (2³)
    const [scale] = useState(() => Math.pow(Math.random(), 2.0) * 0.5 +  0.05);
                                                                //0 ~ 0.5사이의 난수 //최소값

    const [position, setPosition] = useState(resetPosition());//박스마다 각기 포지션 갖고있음

    function resetPosition(){
        // 3D 좌표(x, y, z)를 담는 객체, new Vector3(x, y, z) → x, y, z 값을 넣어서 3차원 벡터 생성

        //Math.random()은 0 이상 1 미만의 난수 생성
        //Math.random() * 2 => 0~1 범위를 2배 0~2
        // -1 => 중심을 0으로 옮김

        let v = new Vector3((Math.random() * 2 - 1) * 3, Math.random() * 2.5 + 0.1, (Math.random() * 2 - 1) * 15);

        //중심을 피하고, 어느 정도 강제로 양/음 쪽으로 밀기: -3~3사이면 미미해서 같은 위치에 있는 것처럼 보일 수 있음 그래서 1.75씩 간격준듯
        if(v.x < 0) v.x -= 1.75;//v.x가 음수면 1.75를 빼고
        if(v.x > 0) v.x += 1.75;//v.x가 양수면 1.75를 더한다

        // setPosition(v);
        return v;
    }

    useFrame((_state, delta) =>{//매 프레임마다 호출 //delta를 쓰면 프레임 속도에 상관없이 회전 속도를 일정하게 유지할 수 있어요.
        box.current.position.set(position.x, position.y, position.z);
        box.current.rotation.x += delta * xRotateSpeed;
        box.current.rotation.y += delta * yRotateSpeed;
    }, [xRotateSpeed, yRotateSpeed, position]);

    return (
        // 3D 오브젝트를 만들 때 쓰는 기본 단위
        <mesh ref={box} scale={scale} castShadow={true}>
            {/*모양(geometry) + 재질(material)**을 넣어줘야 화면에 보임*/}
            <boxGeometry args={[1,1,1]} />

            {/*이미 존재하는 환경맵(씬에 설정된 반사 텍스처)을 그냥 참조, 그래서 CubeCamera 안 씀*/}
            <meshStandardMaterial color={color} envMapIntensity={0.15} />
        </mesh>
    );
}

export function Boxes(){
    const [arr] = useState(()=>{
                        // === const [arr] = useState(() => Array(100).fill(0));
                        //useState 초기화 함수는 컴포넌트 첫렌더링 때 딱 한번 실행됨
        let a = [];
        for(let i=0; i < 100; i++){
            a.push(0); //100개 모두 0인 배열 만듦

        }
        return a;
    });

    return(
        <>
            {arr.map((item,i)=>{
                return <Box key={i} color={i % 2 === 0 ? [0.4, 0.1, 0.1] : [0.05, 0.15, 0.4]}/>
            })}
        </>
    )
}