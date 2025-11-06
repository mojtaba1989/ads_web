import React, { useEffect, useState} from "react";
import ScenarioPanleView from "../views/ScenarioPanelView";


const ScenarioPanel = ({ jumpToTime, onSelectScenario, source}) => {
  const [scenarios, setScenarios] = useState({});

  useEffect(() => {
    fetch(`/api/scenario/scenario`)
      .then((res) => res.json())
      .then((data) => {
        setScenarios(data);
      })
      .catch((err) => console.error("Scenario load error:", err));
  }, []);
  
  const sortedScenarios = Object.entries(scenarios)
    .map(([key, value]) => {
      const [id, description, timeStr] = value;
      return { key, id, description, timeStr};
    })
    .sort((a, b) => a.key - b.key);

  return (
    <ScenarioPanleView
      sortedScenarios={sortedScenarios}
      onSelectScenario={onSelectScenario}
    />
  );
};

export default ScenarioPanel;
