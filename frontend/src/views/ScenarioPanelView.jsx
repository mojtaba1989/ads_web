const ScenarioPanleView = (
    {sortedScenarios, onSelectScenario}
) => {
    return (
        <div 
            class="section"
            >
        <h2>Scenarios</h2>
        <ul class="selectable-list"
            style={{ maxHeight: "300px", overflowY: "auto" }}
            > {/* removes bullets */}
            {sortedScenarios.map((sc) => (
                <li
                key={sc.key}
                onClick={() => onSelectScenario(sc.key)}
                // className="cursor-pointer p-2 hover:bg-gray-700 rounded" // pointer and hover effect
                >
                <span className="text-lg font-semibold mr-2">{sc.timeStr}</span>
                <span>{sc.description}</span>
                </li>
            ))}
            </ul>
        </div>
    );
};

export default ScenarioPanleView;