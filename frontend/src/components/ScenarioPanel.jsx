import React, { useEffect, useState} from "react";


const ScenarioPanel = ({ jumpToTime, onSelectScenario, source}) => {
  const [scenarios, setScenarios] = useState({});
  
  const sortedScenarios = Object.entries(scenarios)
    .map(([key, value]) => {
      const [id, description, timeStr] = value;
      return { key, id, description, timeStr};
    })
    .sort((a, b) => a.key - b.key);

  useEffect(() => {
    fetch(`/api/scenario/scenario`)
      .then((res) => res.json())
      .then((data) => {
        setScenarios(data);
      })
      .catch((err) => console.error("Scenario load error:", err));
  }, [sortedScenarios]);

  return (
    <div className="scenario-panel p-4 bg-gray-900 text-white rounded-lg shadow-md mt-4">
      <h3 className="text-lg font-semibold mb-2">Scenarios</h3>
      <ul className="space-y-1 max-h-80 overflow-y-auto">
        {sortedScenarios.map((sc) => (
          <li
            key={sc.key}
            className="p-2 hover:bg-gray-700 rounded cursor-pointer"
            onDoubleClick={() => onSelectScenario(sc.key)}
          >
            <span className="font-bold mr-2">{sc.timeStr}</span>
            <span>{sc.description}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScenarioPanel;
