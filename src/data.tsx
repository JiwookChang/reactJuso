import React from "react";
import Assessment from '@material-ui/icons/Assessment';
// import PermIdentity from '@material-ui/icons/PermIdentity';
import SettingsPower from '@material-ui/icons/SettingsPower';
import VpnKey from '@material-ui/icons/VpnKey';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ChevronRight from '@material-ui/icons/ChevronRight';
// import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';
import { cyan, pink, purple } from '@material-ui/core/colors';
import StoreOutlinedIcon from '@material-ui/icons/StoreOutlined';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
const cyan600 = cyan['600'];
const pink600 = pink['600'];
const purple600 = purple['600'];

const data = {
  menus: [
    { text: "DashBoard", icon: <Assessment />, link: "/dashboard" },
    // { text: "고객", icon: <PermIdentity />, link: "/customers" },
    //{ text: "Product", icon: <StoreOutlinedIcon />, link: "/products" },
    { text: "국사", icon: <StoreOutlinedIcon />, link: "/tpo" },
    { text: "주소", icon: <InfoOutlinedIcon />, link: "/juso" }
  ],
  userMenus: [
    { text: "Sign out", icon: <SettingsPower />, link: "/login" },
    { text: "Change password", icon: <VpnKey />, link: "" }
  ],
  tablePage: {
    items: [
      { id: 1, name: "Product 1", price: "$50.00", category: "Category 1" },
      { id: 2, name: "Product 2", price: "$150.00", category: "Category 2" },
      { id: 3, name: "Product 3", price: "$250.00", category: "Category 3" },
      { id: 4, name: "Product 4", price: "$70.00", category: "Category 4" },
      { id: 5, name: "Product 5", price: "$450.00", category: "Category 5" },
      { id: 6, name: "Product 6", price: "$950.00", category: "Category 6" },
      { id: 7, name: "Product 7", price: "$550.00", category: "Category 7" },
      { id: 8, name: "Product 8", price: "$750.00", category: "Category 8" },
      { id: 9, name: "Product 6", price: "$950.00", category: "Category 6" },
      { id: 10, name: "Product 7", price: "$550.00", category: "Category 7" },
      { id: 11, name: "Product 8", price: "$750.00", category: "Category 8" }
    ]
  },
  dashBoardPage: {
    recentProducts: [
      {
        id: 1,
        title: "Samsung TV",
        text: "Samsung 32 1080p 60Hz LED Smart HDTV."
      },
      { id: 2, title: "Playstation 4", text: "PlayStation 3 500 GB System" },
      {
        id: 3,
        title: "Apple iPhone 6",
        text: "Apple iPhone 6 Plus 16GB Factory Unlocked GSM 4G "
      },
      {
        id: 4,
        title: "Apple MacBook",
        text: "Apple MacBook Pro MD101LL/A 13.3-Inch Laptop"
      }
    ],
    monthlySales: [
      { name: "Jan", uv: 3700 },
      { name: "Feb", uv: 3000 },
      { name: "Mar", uv: 2000 },
      { name: "Apr", uv: 2780 },
      { name: "May", uv: 2000 },
      { name: "Jun", uv: 1800 },
      { name: "Jul", uv: 2600 },
      { name: "Aug", uv: 2900 },
      { name: "Sep", uv: 3500 },
      { name: "Oct", uv: 3000 },
      { name: "Nov", uv: 2400 },
      { name: "Dec", uv: 2780 }
    ],
    newOrders: [
      { pv: 2400 },
      { pv: 1398 },
      { pv: 9800 },
      { pv: 3908 },
      { pv: 4800 },
      { pv: 3490 },
      { pv: 4300 }
    ],
    browserUsage: [
      { name: "유선", value: 800, color: cyan600, icon: <ExpandMore /> },
      { name: "바로가입", value: 300, color: pink600, icon: <ChevronRight /> },
      { name: "홈페이지", value: 300, color: purple600, icon: <ExpandLess /> }
    ],
    lineBarChart: [
      { name: "6월", 기타: 590, 속도: 800, 품질: 1400 },
      { name: "7월", 기타: 868, 속도: 967, 품질: 1506 },
      { name: "8월", 기타: 1397, 속도: 1098, 품질: 989 },
      { name: "9월", 기타: 1480, 속도: 1200, 품질: 1228 },
      { name: "10월", 기타: 1520, 속도: 1108, 품질: 1100 },
      { name: "11월", 기타: 1400, 속도: 680, 품질: 1700 }
    ]
  }
};

export default data;
