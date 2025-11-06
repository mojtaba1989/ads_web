import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

const PlotPanelView = ({
  groups,
  selected,
  plotData,
  hovered,
  toggleSelection,
  handleClick
    }) => {return (
        <div class="section">
            <h2>Plots</h2>
            <dev style={{display: "grid", gridTemplateColumns: "15% 85%", gap: ".1rem"}}>
                <dev style={{overflowY: "auto", maxHeight: "300px"}}>
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
                </dev>
                <dev style={{overflowY: "auto", maxHeight: "300px"}}>
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
                                    // label={"rostime"}
                                    tick={true}
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
                </dev>
            </dev>
        </div>
        );
    };

export default PlotPanelView;
