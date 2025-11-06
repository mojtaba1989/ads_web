const InfoPanelView = (
    { info }
) => {
    return (
        <div class="section">
            <h2>Trip Information</h2>
            <table class="info-table">
                <tbody>
                    {Object.entries(info).map(([key, value]) => (
                    <tr>
                        <th>{ key }</th>
                        <td>{ value }</td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default InfoPanelView;