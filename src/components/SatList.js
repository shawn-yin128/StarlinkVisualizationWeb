import {Avatar, Button, Checkbox, List, Spin} from "antd";
import satellite from "../assets/images/satellite.svg";
import {useState} from "react";

function SatelliteList(props) {
    const [selected, setSelected] = useState([]);

    const satList = props.satInfo ? props.satInfo.above : [];
    const {isLoad} = props.isLoad;

    const onChange = (e) => {
        const {dataInfo, checked} = e.target;
        const list = addOrRemove(dataInfo, checked, selected);
        setSelected(list);
    }

    const addOrRemove = (item, status, list) => {
        const found = list.find(entry => entry.satid === item.satid);
        // add
        if (status && !found) {
            list = [...list, item];
        }
        // remove
        if (!status && found) {
            list = list.filter(entry => {
                return entry.satid !== item.satid;
            });
        }
        return list;
    }

    const onShowSatMap = () => {
        props.onShowMap(selected);
    }

    return (
        <div className="sat-list-box">
            <div className="btn-container">
                <Button size="large" className="btn-add" disabled={selected.length === 0} onClick={onShowSatMap}>Track on map</Button>
            </div>
            <hr />
            {isLoad ?
                <div className="spin-box">
                    <Spin tip="Loading..." size="large"/>
                </div>
                :
                <List className="sat-list" itemLayout="horizontal" size="small" dataSource={satList}
                    renderItem={(item) => (
                        <List.Item actions={[<Checkbox dataInfo={item} onChange={onChange}/>]}>
                            <List.Item.Meta avatar={<Avatar size={50} src={satellite}/>} title={<p>{item.satname}</p>} description={`Launch Date: ${item.launchDate}`} />
                        </List.Item>
                    )} ></List>
            }
        </div>
    )
}

export default SatelliteList;