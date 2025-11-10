import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

const PlotPanelView = ({
  groups,
  selected,
  plotData,
  hovered,
  toggleSelection,
  handleClick
    }) => {return (
        <div className="section" style={{height:"100%", display: "flex", flexDirection: "column"}}>
            <h2>Plot</h2>
            <div style={{display: "flex", flex: "1", minHeight: "0"}}>
                <div style={{flex: "0 1 15%", overflowY:"auto"}}>
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
                <div style={{flex: "1", overflowY:"hidden", paddingRight: "1rem"}}>
                    {selected.length === 0 ? (
                        <h3> Select any variable to visualize it here.</h3>
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
                                    tick={true}
                                />
                                <YAxis/>
                                <Tooltip />
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
            {/* <dev style={{display: "flex", height: "100%", width: "100%"}}>
                <dev style={{display: "flex", flexDirection: "column", flex: "0 1 %10"}}>
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
                <dev style={{flex: "1 1 auto", overflowX: "hidden", overflowY: "auto"}}>
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
                                    tick={true}
                                />
                                <YAxis/>
                                <Tooltip />
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
            </dev> */}
        </div>
        );
    };

export default PlotPanelView;
