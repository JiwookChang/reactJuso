import React, { useEffect } from 'react';

declare global {
  interface Window {
    kakao: any;
  }
}

const App: React.FC = () => {
  useEffect(() => {

    let container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
    let options = { //지도를 생성할 때 필요한 기본 옵션
      center: new window.kakao.maps.LatLng(37.405732, 127.098376), //지도의 중심좌표.
      level: 3 //지도의 레벨(확대, 축소 정도)
    };

    let map = new window.kakao.maps.Map(container, options); //지도 생성 및 객체 리턴

    // 마커가 표시될 위치입니다
    const markerPosition  = new window.kakao.maps.LatLng(37.405732, 127.098376);

    // 마커 생성
    const marker = new window.kakao.maps.Marker({
        position: markerPosition
    });

    // 마커 표시
    marker.setMap(map);

  }, [])

  return (
    <div className="App">
      <div id="map" style={{ width: "100vw", height: "100vh" }} />
    </div>
  );
}

export default App;