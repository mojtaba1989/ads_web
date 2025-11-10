import React, { useEffect, useState} from "react";
import InfoPanelView from "../views/InfoPanelView";

const InfoPanel = () => {
    const [info, setInfo] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8000/api/info/info")
            .then(res => res.json())
            .then(data => {
                setInfo(data);
            })
            .catch(err => console.error("Failed to fetch info:", err));
    }, []);

    return (
        <InfoPanelView
            info={info}
        />
    );
};

export default InfoPanel;