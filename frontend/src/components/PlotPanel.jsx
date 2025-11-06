import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const PlotPanel = ({ jumpToTime, onSeek, source }) => {
  const [availablePlots, setAvailablePlots] = useState([]);
  const [selected, setSelected] = useState([]);
  const [plotData, setPlotData] = useState({}); // { "gps.latitude": [ ...data ] }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hovered, setHovered] = useState(null);

  // 🔹 Fetch plot list on mount
  useEffect(() => {
    const fetchPlots = async () => {
      try {
        const res = await fetch("/api/plots/list");
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        const data = await res.json();
        if (Array.isArray(data.list)) {
          setAvailablePlots(data.list);
        } else {
          throw new Error("Invalid data format: expected { list: [...] }");
        }
      } catch (err) {
        console.error("Failed to fetch plot list:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPlots();
  }, []);

  // 🔹 Fetch data when selection changes
  useEffect(() => {
    const fetchDataForSelected = async () => {
      for (const key of selected) {
        if (plotData[key]) continue; // already cached

        try {
          const res = await fetch(`/api/plots/data?topic=${encodeURIComponent(key)}`);
          if (!res.ok) throw new Error(`Failed to fetch ${key}: ${res.status}`);
          const json = await res.json();

          if (!Array.isArray(json.data)) throw new Error("Invalid data format");
          setPlotData((prev) => ({ ...prev, [key]: json.data }));
        } catch (err) {
          console.error("Error fetching plot data:", key, err);
        }
      }
    };
    if (selected.length > 0) fetchDataForSelected();
  }, [selected]);

  // 🔹 Group data by section
  const groups = {};
  let currentGroup = "General";
  for (const item of availablePlots) {
    if (item.startsWith("--")) {
      currentGroup = item.replace("--", "");
      groups[currentGroup] = [];
    } else {
      groups[currentGroup] = groups[currentGroup] || [];
      groups[currentGroup].push(item);
    }
  }

  // 🔹 Checkbox toggle
  const toggleSelection = (group, field) => {
    const key = `${group}.${field}`;
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleClick = (state) => {
    if (!state || !state.activeLabel) return;
    const clickedX = state.activeLabel; // this corresponds to your X-axis value (t)
    setHovered(Number(clickedX));
    onSeek(Number(clickedX));
  };

  useEffect(() => {
    if (jumpToTime && source !== "plot") {
      setHovered(Number(jumpToTime));
      console.log("Plot Jumping to time:", hovered);
    }
  }, [jumpToTime, source]);

  if (loading)
    return <div className="text-center text-gray-400 p-4">Loading plots...</div>;
  if (error)
    return <div className="text-red-400 p-4">Error fetching plots: {error}</div>;

  return (
    <div className="flex w-full h-[600px] bg-gray-900 text-white rounded-2xl shadow-md overflow-hidden">
      {/* LEFT: Plot list */}
      <div className="w-1/3 overflow-y-auto border-r border-gray-700 p-4">
        <h3 className="text-lg font-semibold mb-2">Select Plots</h3>
        {Object.entries(groups).map(([group, fields]) => (
          <div key={group} className="mb-3">
            <h4 className="font-bold text-blue-400 mb-1">📊 {group}</h4>
            <ul>
              {fields.map((field) => {
                const key = `${group}.${field}`;
                return (
                  <li key={key} className="flex items-center mb-1">
                    <input
                      type="checkbox"
                      checked={selected.includes(key)}
                      onChange={() => toggleSelection(group, field)}
                      className="mr-2 accent-blue-500"
                    />
                    <label>{field}</label>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* RIGHT: Active plots */}
      <div className="flex-1 p-4 overflow-y-auto">
        <h3 className="text-lg font-semibold mb-3">Active Plots</h3>

        {selected.length === 0 ? (
          <p className="text-gray-400">Select any variable to visualize it here.</p>
        ) : (
          selected.map((key) => (
            <div key={key} className="mb-6 bg-gray-800 p-3 rounded-lg shadow">
              <h4 className="text-md font-bold mb-2">{key}</h4>
              {plotData[key] ? (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart 
                    data={plotData[key]}
                    onClick={handleClick}>
                    
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="t"
                      type="number"
                      domain={['dataMin', 'dataMax']}
                      allowDataOverflow
                      label={"rostime"}
                      tick={false}
                    />
                    <YAxis/>
                    <Tooltip />
                    {/* <Legend /> */}
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#616ae4ff"
                      dot={false}
                    />
                    <ReferenceLine x={hovered} stroke="red" strokeDasharray="3 3" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500">Loading data...</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PlotPanel;
