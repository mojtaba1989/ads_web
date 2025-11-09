const ScenarioPanleView = (
    {sortedScenarios, onSelectScenario}
) => {
    return (
        <div className="section" style={{height:"100%", display: "flex", flexDirection: "column"}}>
            <h2>Scenarios</h2>
            <div style={{flex: 1, overflowY: "auto", overflowX: "hidden", marginBottom: "10px", marginRight: "10px"}}>
                <ul className="selectable-list" style={{overflowY:"auto"}}>
                    {sortedScenarios.map((sc) => (
                        <li key={sc.key} onClick={() => onSelectScenario(sc.key)}>
                            <span>{sc.timeStr} </span>
                            <span>&#8212;</span>
                            <span>{sc.description}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ScenarioPanleView;