import React, { useState, useEffect } from "react";
import PlotPanelView from "../views/PlotPanelView";
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
    <PlotPanelView
      groups={groups}
      selected={selected}
      plotData={plotData}
      hovered={hovered}
      toggleSelection={toggleSelection}
      handleClick={handleClick}
    />
  );
};

export default PlotPanel;