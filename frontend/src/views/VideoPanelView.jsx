const VideoPanelView = (
    { videoRef, videoUrl, isError }
) => {
    return (
        <div style={{
             display: "flex", 
             flexDirection: "column", 
             height:"100%", 
             aspectRatio: "16 / 9", 
             borderRadius: "8px"}}>
            {/* <h2>Front-View Camera</h2> */}
            <div style={{height:"100%", flex: 1, position: "relative", margin: "0px"}}>
                {isError ? (
                <p className="text-red-400">Failed to load video.</p>
                ) : (
                <>
                    <video
                    ref={videoRef}
                    src={videoUrl}
                    controls
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        // width: "auto",
                        height: "100%",
                        objectFit: "fill", // or "contain" if you prefer full view with letterboxing
                        borderRadius: "8px"
                    }}
                    />
                    <div
                        style={{
                        position: "absolute",
                        top: "10px",
                        left: "10px",
                        color: "white",
                        background: "rgba(0, 0, 0, 0.7)",
                        padding: "6px 10px",
                        borderRadius: "6px",
                        fontSize: "14px",
                        fontWeight: "600",
                        }}>
                        Front Camera
                    </div>
                </>
                )}   
            </div>
        </div>
    );
};

export default VideoPanelView;