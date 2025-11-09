const InfoPanelView = (
    { info }
) => {
    return (
        <div className="section" style={{height:"100%", display: "flex", flexDirection: "column"}}>
            <h2>Trip Information</h2>
            <div style={{flex: 1, overflowY: "auto", overflowX: "hidden", marginBottom: "10px", marginRight: "10px"}}>
                <table className="info-table" style={{width: "100%"}}>
                    <tbody>
                        {Object.entries(info).map(([key, value]) => (
                        <tr key={key}>
                            <th>{ key }</th>
                            <td>{ value }</td>
                        </tr>
                        ))}
                    </tbody>
                </table>               
            </div>

        </div>
    );
};

export default InfoPanelView;