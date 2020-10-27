import React, { useEffect } from 'react';

import { grey } from "@material-ui/core/colors";
import { Grid } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { listPageStyle } from "../styles";

const grey600 = grey["600"];

const stylesL = listPageStyle;
const styles = {
  navigation: {
    fontSize: 15,
    fontWeight: 400, //TypographyStyle.fontWeightLight,
    color: grey600, 
    // paddingBottom: 15,
    display: "block",
  },
  container: {
    marginTop: "3em",
  },
  cell: {
    padding: "1em",
  },
  content:{
    paddingTop:60,
    padding:20,
  }
};

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
    <div className="App" style={styles.content}>
    <Grid container style={styles.container} spacing={3}>
      <Grid item style={styles.cell} xs={12} md={6}>
        <div id="jusoSearch" style={{ width: "50vw", height: "85vh" }}>
        <Grid item xs={12} style={stylesL.searchField}>
          <TextField
            // placeholder="Order Reference"
            label="주소 검색"
            fullWidth={true}
            name="reference"
          />
          </Grid>
          <Grid item xs={12} style={stylesL.searchField}>
          <Button
            variant="contained"
            style={stylesL.searchButton}
            //onClick={this.handleSearch}
            color="secondary"
          >
            검색
          </Button>
          </Grid>
        </div>
      </Grid>
      <Grid item style={styles.cell} xs={12} md={6}>
        <div id="map" style={{ width: "50vw", height: "85vh" }} />
      </Grid>
    </Grid>
  </div>
  );
}

export default App;