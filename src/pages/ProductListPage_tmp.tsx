import React, { useEffect, useState } from 'react';

import { Grid } from "@material-ui/core";
import PageBase from "../components/PageBase";
import  List from "@material-ui/core/List";
import { ListItemText } from "@material-ui/core";

import axios from 'axios';

// Mouse over event on address list
function mouseOver(e) {
  e.target.style.background = 'gray';
}
// Mouse out event on address list
function mouseOut(e) {
  e.target.style.background = '#fff';
}

// Making address list
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
          id={item.tpoCd}
          key={item.tpoCd}
          primary={item.tpoTypeNm}
          primaryTypographyProps={{ style: lineStyle.lineS }}
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



// Show the contents on body
const FacilityApp: React.FC = () => {
  const ListLoading = jusoList;
  const [appState, setAppState] = useState({
    loading: false,
    repos: null,
  });

  const searchJuso = () =>{
    const apiUrl = 'http://a32504571d1b0428bacc66fdb6b6ada0-158163165.ap-northeast-2.elb.amazonaws.com:8080/tpo/findTpoList';
    
    axios.get(apiUrl)
    .then(res => {
      let allRepos = Array.from(res.data);
      console.log(allRepos);
      setAppState({ loading: false, repos: allRepos });
    })
  }

  useEffect(() => {
    searchJuso();
    //roadViewSetting("start");
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
                <div>
                  <ListLoading isLoading={appState.loading} repos={appState.repos} />
                </div>
            </div>
          </Grid>
        </Grid>
      </div>
    </PageBase>
  );
}

export default FacilityApp;