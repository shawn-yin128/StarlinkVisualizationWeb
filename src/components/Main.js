import {Col, Row} from "antd";
import SatelliteSettingForm from "./SatSetting";
import SatelliteList from "./SatList";
import {useState} from "react";
import {NEARBY_SATELLITE, SAT_API_KEY, STARLINK_CATEGORY} from "../constants";
import WorldMap from "./WorldMap";

function Main() {
    const [satInfo, setSatInfo] = useState(null);
    const [settings, setSettings] = useState(null);
    const [satList, setSatList] = useState(null);
    const [isLoadingList, setIsLoadingList] = useState(false);

    const fetchSatellite = setting => {
        const {latitude, longitude, elevation, altitude} = setting;
        const url = `/api/${NEARBY_SATELLITE}/${latitude}/${longitude}/${elevation}/${altitude}/${STARLINK_CATEGORY}/&apiKey=${SAT_API_KEY}`;
        console.log("url -> ", url);
        setIsLoadingList(true);
        console.log("isLoadingList -> ", isLoadingList);

        fetch(url)
            .then(res => res.json())
            .then(res => {
                console.log(res.above);
                setSatInfo(res.above);
                console.log("satInfo -> ", satInfo);
                setIsLoadingList(false);
            })
            .catch(err => console.log("error in fetching satellite information -> ", err));
    }

    const searchSatellite = setting => {
        setSettings(setting);
        console.log("settings -> ", settings);
        fetchSatellite(setting);
    }

    const updateSelected = selected => {
        setSatList([...selected]);
        console.log("satList -> ", satList);
    }

    return (
        <Row className="main">
            <Col span={8} className="left-col">
                <SatelliteSettingForm onClickHandler={searchSatellite}/>
                <SatelliteList isLoad={isLoadingList} satInfo={satInfo} onClickHandler={updateSelected}/>
            </Col>
            <Col span={16} className="right-col">
                <WorldMap satData={satList} observerData={settings} />
            </Col>
        </Row>
    );
}

export default Main;