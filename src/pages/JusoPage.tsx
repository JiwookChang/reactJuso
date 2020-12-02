import React, { useEffect, useState } from 'react';

import { Grid } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { jusoPageStyle } from "../styles";
import PageBase from "../components/PageBase";
import  List from "@material-ui/core/List";
import { ListItemText } from "@material-ui/core";

import axios from 'axios';

const styles = jusoPageStyle;

declare global {
  interface Window {
    kakao: any;
  }
}
// map elements
let container = null;
let options = null;
let map = null;
let marker = null;
let facilityMarkers = [];

// roadView elements
let rvContainer = null;
let rv = null;
let rc = null;
let rvResetValue = {"panoId":null, "pan":null, "tilt":null,"zoom":null};


const imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png',   // 이미지 주소 
      imageSize = new window.kakao.maps.Size(35, 38),                                         // 마커이미지의 크기입니다
      imageOption = {offset: new  window.kakao.maps.Point(27, 69)};                           // 마커이미지의 옵션

const facilityMarkerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

function onClick(query, ldongCd, stNmCd, bldMainNum, bldSubNum, jihaChk) {
  axios({
      method: 'get',
      url: 'https://dapi.kakao.com//v2/local/search/address.json?query='+query,
      headers: {'Authorization': 'KakaoAK ' + process.env.REACT_APP_KAKAO_REST_KEY }
    })
    .then(function (response) {
      let allRepos = Array.from(response.data.documents);
      mapSetting("change", allRepos[0]['x'], allRepos[0]['y']);
    });
    getFacilityInfo(ldongCd, stNmCd, bldMainNum, bldSubNum, jihaChk);
}

function mouseOver(e) {
  e.target.style.background = 'gray';
}
function mouseOut(e) {
  e.target.style.background = '#fff';
}

const jusoList = (props) => {
  const { repos } = props;
  if (!repos || repos.length === 0) return <p></p>;

  const lineStyle = {
    lineS :{
      lineHeight: 2,
      paddingLeft:'10px',
      fontWeight: 400,
    },
    
  };
  
  const listItems = repos.map((item) =>
    <ListItemText
          onMouseOver={mouseOver}
          onMouseOut={mouseOut}
          id={item.roadAddr}
          key={item.roadAddr}
          primary={item.roadAddr}
          primaryTypographyProps={{ style: lineStyle.lineS }}
          onClick ={() => onClick(item.roadAddr, item.admCd, item.rnMgtSn, item.buldMnnm, item.buldSlno, item.udrtYn)}
        />
  );  
  return (
    <List>
      <div>
        {listItems}
      </div>
    </List>
  );
};

const mapSetting = (mode, x, y) => {  
  if(mode === "start"){
    container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
    options = { //지도를 생성할 때 필요한 기본 옵션
      center: new window.kakao.maps.LatLng(37.405732, 127.098376), //지도의 중심좌표.
      level: 4 //지도의 레벨(확대, 축소 정도)
    };
    map = new window.kakao.maps.Map(container, options); //지도 생성 및 객체 리턴

    // 마커 생성
    marker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(37.405732, 127.098376),
        map: map
    });

    // 마커 표시
    marker.setMap(map);

  }else{
    marker.setMap(null);
    marker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(y, x),
        map: map,
    });
    marker.setMap(map);
    map.setCenter(new window.kakao.maps.LatLng(y, x));
    options.center = new window.kakao.maps.LatLng(y, x);
    
    roadViewSetting("change");
    getFacilityInfoByXY(y, x);
  }
};

const getFacilityInfo = (ldongCd, stNmCd, bldMainNum, bldSubNum, jihaChk) => {  
  console.log("ldongCd: "+ldongCd+"  &stNmCd: "+stNmCd+"  &bldMainNum: "+bldMainNum+"  &bldSubNum: "+bldSubNum+"  &jihaChk: "+jihaChk);
  // const params = "/findJusoContent&ldongCd="+ldongCd+"&roadNmCd="+stNmCd+"&bldMainNum="+bldSubNum+"&bldSubNum="+bldSubNum+"&jihaChk="+jihaChk;
  const params = "/findJusoContent?roadNmCd=111103100012&jihaChk=0&bldMainNum=94&bldSubNum=0&ldongCd=1111010100";
  
  axios.get('http://a2fb35f700d7c4890a4b9643dfc0a82b-464956859.ap-northeast-2.elb.amazonaws.com:8080/juso/content'+params)
    .then(res => {
      let allRepos = Array.from(res.data);  // axios를 통해 온 객체는 HTㅢCollection이다. Javascript Array로 변경해 map을 사용할 수 있다.
      console.log(allRepos);
    })  
};

const getFacilityInfoByXY = (x, y) => {
  clearMarkers();  

  const params = "/findPosContent?posX="+x+"&posY="+y;
  axios.get('http://a2fb35f700d7c4890a4b9643dfc0a82b-464956859.ap-northeast-2.elb.amazonaws.com:8080/juso/content'+params)
    .then(res => {
      let allRepos = Array.from(res.data);  // axios를 통해 온 객체는 HTㅢCollection이다. Javascript Array로 변경해 map을 사용할 수 있다.
      console.log(allRepos);
      
      for(var i=0;i<allRepos.length; i++){
        const mark = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(allRepos[i]['posX'], allRepos[i]['posY']),
          image: facilityMarkerImage
        });
        facilityMarkers.push(mark);
      }
      setMarkers();
    })  
};

const clearMarkers = () => { 
  if(facilityMarkers.length>0){
    for(var i=0;i<facilityMarkers.length; i++){
      facilityMarkers[i].setMap(null);        // Clear markers on map
    }
    facilityMarkers = [];                     // Clear markers
  }
}

const setMarkers = () => { 
  for (var i = 0; i < facilityMarkers.length; i++) {
    facilityMarkers[i].setMap(map);
  }  
}

const roadViewSetting = (mode) => {  
  if(mode === "start"){
    rvContainer = document.getElementById('roadview'); //지도를 담을 영역의 DOM 레퍼런스
    rv = new window.kakao.maps.Roadview(rvContainer); // 로드뷰 객체 생성
    rc = new window.kakao.maps.RoadviewClient(); // 좌표를 통한 로드뷰의 panoid를 추출하기 위한 로드뷰 help객체 생성
    
    rc.getNearestPanoId(options.center, 50, function(panoId) {
        rv.setPanoId(panoId, options.center);//좌표에 근접한 panoId를 통해 로드뷰를 실행합니다.
        rvResetValue.panoId = panoId;
    });
  }else{
    console.log("options.center > "+options.center);
    rc.getNearestPanoId(options.center, 50, function(panoId) {
      rv.setPanoId(panoId, options.center);//좌표에 근접한 panoId를 통해 로드뷰를 실행합니다.
      rvResetValue.panoId = panoId;
    });
  }

};
/*
const rvInit = () => {  
  // 로드뷰 마커가 중앙에 오도록 로드뷰의 viewpoint 조정 합니다.
  const projection = rv.getProjection(); // viewpoint(화면좌표)값을 추출할 수 있는 projection 객체를 가져옵니다.
  
  // 마커의 position과 altitude값을 통해 viewpoint값(화면좌표)를 추출합니다.
  const viewpoint = projection.viewpointFromCoords(marker.getPosition(), marker.getAltitude());
  rv.setViewpoint(viewpoint); //로드뷰에 뷰포인트를 설정합니다.

  //각 뷰포인트 값을 초기화를 위해 저장해 놓습니다.
  rvResetValue.pan = viewpoint.pan;
  rvResetValue.tilt = viewpoint.tilt;
  rvResetValue.zoom = viewpoint.zoom;
};
*/

const App: React.FC = () => {
  const ListLoading = jusoList;
  const [appState, setAppState] = useState({
    loading: false,
    repos: null,
  });
  const [jusoTxt, setJusoTxt] = useState({
    juso: null,
  });

  const searchJuso = () =>{
    // const apiUrl = '/juso/findJuso';
    // const apiParams = '?jusoId=1'
    const apiUrl = 'http://www.juso.go.kr/addrlink/addrLinkApi.do';
    const apiParams = '?confmKey='+process.env.REACT_APP_JUSO_KEY+'&currentPage=1&countPerPage=10&resultType=json&keyword='+jusoTxt.juso;
    
    axios.get(apiUrl+apiParams)
    .then(res => {
      let allRepos = Array.from(res.data.results.juso);  // axios를 통해 온 객체는 HTㅢCollection이다. Javascript Array로 변경해 map을 사용할 수 있다.
      setAppState({ loading: false, repos: allRepos });
    })
  }

  const keyPress = (e) =>{
    if(e.keyCode === 13){
      searchJuso();
    } 
  }

  useEffect(() => {
    mapSetting("start",'','');
    roadViewSetting("start");
  }, [])
  
  return (
    <PageBase
        title={"Address"}
        navigation="React Juso / SearchJuso"
      >      
      <div>
        <Grid container >
          <Grid item xs={12} md={6}>
            <div id="jusoSearch" style={{ width:'100%', height: "100%",paddingTop: "10px" }}>
                <Grid style={{ width:'100%', display: "flex" }}>
                  <TextField
                    // placeholder="Order Reference"
                    id="searchValue"
                    label="주소 검색"
                    fullWidth={true}
                    onChange={(evt) => {setJusoTxt({juso : evt.target.value})}}
                    name="reference"
                    onKeyDown={keyPress}
                    style={styles.searchField}/>
                  <Button
                    variant="contained"
                    style={styles.searchButton}
                    onClick={searchJuso}
                    color="secondary">
                    검색
                  </Button>
                </Grid>
                <div>
                  <ListLoading isLoading={appState.loading} repos={appState.repos} />
                </div>
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            <div id="map" style={{ width: "100%", height: "32vh"}} />
            <div id="roadview" style={{ width: "100%", height: "32vh"}} />
          </Grid>
        </Grid>
      </div>
    </PageBase>
  );
}

export default App;