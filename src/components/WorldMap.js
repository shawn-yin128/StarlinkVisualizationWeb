import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {SAT_API_KEY, SATELLITE_POSITION_URL, WORLD_MAP_URL} from "../constants";
import {feature} from "topojson-client";
import {schemeCategory10} from "d3-scale-chromatic";
import {geoKavrayskiy7} from "d3-geo-projection";
import {geoGraticule, geoPath} from "d3-geo";
import {select} from "d3-selection";
import * as d3Scale from "d3-scale";
import {timeFormat} from "d3-time-format";
import {Spin} from "antd";

const width = 960;
const height = 600;

function WorldMap(props) {
    const step = 60;

    const [isLoading, setIsLoading] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false);
    let [map, setMap] = useState(null);

    const color = d3Scale.scaleOrdinal(schemeCategory10);
    const refMap = useRef();
    const refTrack = useRef();
    const refInitialMount = useRef(true);
    const prevDrawing = useRef(isDrawing);
    const prevProps = useRef(props);

    useEffect(() => {
        if (refInitialMount.current) {
            console.log("world map initial mount");
            refInitialMount.current = false;
            axios.get(WORLD_MAP_URL)
                .then((res) => {
                        const {data} = res;
                        const land = feature(data, data.objects.countries).features;
                        generateMap(land);
                        console.log("success in fetching world map.");
                    }
                ).catch(e => {
                console.log("error in fetch world map data -> ", e);
            })
        } else {
            console.log("world map update");
            if (prevProps.current.satData !== props.satData) {
                prevProps.current = props;
                const {latitude, longitude, elevation, duration} = props.observerData;
                const endTime = duration * step;
                setIsLoading(true);
                const urls = props.satData.map(sat => {
                        const {satid} = sat;
                        const url = `/api/${SATELLITE_POSITION_URL}/${satid}/${latitude}/${longitude}/${elevation}/${endTime}&apiKey=${SAT_API_KEY}`;
                        return axios.get(url);
                    }
                );
                console.log("urls -> ", urls);
                Promise.all(urls).then(res => {
                        const arr = res.map(sat => sat.data);
                        setIsLoading(false);
                        setIsDrawing(true);
                        if (!prevDrawing.current) {
                            track(arr);
                        } else {
                            const oHint = document.querySelector(".hint");
                            oHint.innerHTML = "Please wait for these satellite animation to finish before selecting new ones.";
                        }
                    }).catch(e => {
                    console.log("error in fetching satellite position -> ", e.message);
                });
            }
        }
    }, [props.satData]);

    const track = (data) => {
        if (!data[0].hasOwnProperty("positions")) {
            throw new Error("no position data found");
        }

        const len = data[0].positions.length;
        const {context2} = map;
        let now = new Date();
        let i = 0;
        let timer = setInterval(() => {
            let ct = new Date();
            let timePassed = i === 0 ? 0 : ct - now;
            let time = new Date(now.getTime() + step * timePassed);

            context2.clearRect(0, 0, width, height);
            context2.font = "bold 14px sans-serif";
            context2.fillStyle = "#333";
            context2.textAlign = "center";
            context2.fillText(timeFormat(time), width / 2, 10);

            if (i >= len) {
                clearInterval(timer);
                setIsDrawing(false);
                const oHint = document.querySelector(".hint");
                oHint.innerHTML = "";
                return;
            }

            data.forEach(sat => {
                const {info, positions} = sat;
                drawSat(info, positions[i]);
            });

            i += step;
        }, 1000);
    }

    const drawSat = (sat, pos) => {
        const {satlongitude, satlatitude} = pos;
        if (!satlongitude || !satlatitude) {
            return;
        }
        const {satname} = sat;
        const nameWithNumber = satname.match(/\d+/g).join("");
        const {projection, context2} = map;
        const xy = projection([satlongitude, satlatitude]);

        context2.fillStyle = color(nameWithNumber);
        context2.beginPath();
        context2.arc(xy[0], xy[1], 4, 0, 2 * Math.PI);
        context2.fill();

        context2.font = "bold 11px sans-serif";
        context2.textAlign = "center";
        context2.fillText(nameWithNumber, xy[0], xy[1] + 14);
    }

    const generateMap = (land) => {
        const projection = geoKavrayskiy7().scale(170).translate([width/2, height/2]).precision(.1);
        const graticule = geoGraticule();
        const canvas = select(refMap.current).attr("width", width).attr("height", height);
        const canvas2 = select(refTrack.current).attr("width", width).attr("height", height);

        let context = canvas.node().getContext("2d");
        let context2 = canvas2.node().getContext("2d");

        let path = geoPath().projection(projection).context(context);

        land.forEach(elem => {
            context.fillStyle = "#B3DDEF";
            context.strokeStyle = "#000";
            context.globalAlpha = 0.7;
            context.beginPath();
            path(elem);
            context.fill();
            context.stroke();

            context.strokeStyle = "rgba(220,220,220,0.1)";
            context.beginPath();
            path(graticule());
            context.lineWidth = 0.1;
            context.stroke();

            context.beginPath();
            context.lineWidth = 0.5;
            path(graticule.outline());
            context.stroke();
        });

        setMap({
            projection: projection,
            graticule: graticule,
            context: context,
            context2: context2
        });
    }

    return (
        <div className="map-box">
            {isLoading ? (
                <div className="spinner">
                    <Spin tip="Loading..." size="large"/>
                </div>
            ) : null}
            <canvas className="map" ref={refMap}></canvas>
            <canvas className="track" ref={refTrack}></canvas>
            <div className="hint"></div>
        </div>
    );
}

export default WorldMap;