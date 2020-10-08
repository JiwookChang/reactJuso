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

// import * as React from 'react';
// import styled from "styled-components";

// export interface KakaoMapProps {
//   apiKey: "6ad49b16690d6b339dc3c48c8668bec5";
//   lat: 37.506502;
//   lng: 127.053617;
// }

// interface KakaoMapState {
//   sdkLoaded: boolean;
// }

// class KakaoMap extends React.Component<KakaoMapProps, KakaoMapState> {
//   public state: KakaoMapState = {
//     sdkLoaded: false,
//   };

//   public loadKakaoSdk = () => {
//     const {
//       apiKey,
//       lng,
//       lat
//     } = this.props;

//     ((d, s, id, cb) => {
//       const element = d.getElementsByTagName(s)[0];
//       const fjs: any = element;
//       let js: any = element;

//       js = d.createElement(s);
//       js.id = id;
//       js.src =
//         `https://dapi.kakao.com/v2/maps/sdk.js?appKey=${apiKey}&libraries=services,clusterer,drawing&autoload=false`;
//       fjs.parentNode.insertBefore(js, fjs);
//       js.onload = cb;
//     })(document, 'script', 'kakaomap-sdk', () => {
//       const el = document.getElementById('kakao-map');
//       const daum = (window as any).daum;
//       daum.maps.load(function() {
//         const map = new daum.maps.Map(el, {
//           level: 3,
//           center: new daum.maps.LatLng(lat, lng)
//         });

//         // 마커가 표시될 위치입니다
//         const markerPosition  = new daum.maps.LatLng(lat, lng);

//         // 마커 생성
//         const marker = new daum.maps.Marker({
//             position: markerPosition
//         });

//         // 마커 표시
//         marker.setMap(map);

//         return map;
//       });
//     });
//   }

//   sdkLoaded() {
//     this.setState({sdkLoaded: true});
//   }

//   componentDidMount() {
//     if (document.getElementById('kakaomap-sdk')) {
//       this.sdkLoaded();
//     }
//     this.loadKakaoSdk();
//     let kakaoMapRoot = document.getElementById('kakao-map');
//     if (!kakaoMapRoot) {
//       kakaoMapRoot = document.createElement('div');
//       kakaoMapRoot.id = 'kakao-map';
//       document.body.appendChild(kakaoMapRoot);
//     }
//   }

//   public render() {
//     return (
//       <Wrapper id="kakao-map" />
//     );
//   }
// }

// const Wrapper = styled.div`
//   width: 100%;
//   height: 100%;
// `;

// export default KakaoMap;