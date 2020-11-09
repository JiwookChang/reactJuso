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

let container = null;
let options = null;
let map = null;
let marker = null;

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
    getFacilityInfo(ldongCd, stNmCd, bldMainNum, bldSubNum, jihaChk)
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
    map.setCenter(new window.kakao.maps.LatLng(y, x))
  }
};

const getFacilityInfo = (ldongCd, stNmCd, bldMainNum, bldSubNum, jihaChk) => {  
  console.log("ldongCd: "+ldongCd+"  &stNmCd: "+stNmCd+"  &bldMainNum: "+bldMainNum+"  &bldSubNum: "+bldSubNum+"  &jihaChk: "+jihaChk);
  // const params = "&ldongCd="+ldongCd+"&stNmCd="+stNmCd+"&bldMainNum="+bldMainNum+"&bldSubNum="+bldSubNum+"&jihaChk="+jihaChk;
  //const params = "?ldongCd=1111010100&stNmCd=111103100012&bldMainNum=94&bldSubNum=0&jihaChk=0";

    //axios.get('/corsApi/juso/content/findContent'+params)
    //.then(res => {
    //  let allRepos = Array.from(res.data.results.juso);  // axios를 통해 온 객체는 HTㅢCollection이다. Javascript Array로 변경해 map을 사용할 수 있다.
    //  console.log(allRepos);
    //})  


  axios({
    method: 'post',
    url: 'http://aa9469ffeb8574124b23b9b29a8cb11a-1176417964.ap-northeast-2.elb.amazonaws.com:8080/api/juso/content/findContent',
    //url: '/corsApi',
    headers: {"Access-Control-Allow-Origin": "*" },
    data: {
      roadNmCd: 111103100012,
      jihaChk: 0,
      bldMainNum: 94,
      bldSubNum: 0,
      ldongCd: 1111010100,
    }
  }).then(function (response) {
      let allRepos = Array.from(response.data.contentList);
      console.log(allRepos);
      //console.log("result contentTyp: "+allRepos[0]['& contentMemo']+""+allRepos[0]['contentMemo']);
   });
};

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
            <div id="map" style={{ width: "100%", height: "65vh"}} />
          </Grid>
        </Grid>
      </div>
    </PageBase>
  );
}

export default App;