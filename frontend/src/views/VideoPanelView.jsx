const VideoPanelView = (
    { videoRef, videoUrl, isError }
) => {
    return (
        <div class="section">
            <h2>Front-View Camera</h2>
            {isError ? (
            <p className="text-red-400">Failed to load video.</p>
            ) : (
            <>
                <video
                ref={videoRef}
                src={videoUrl}
                controls
                style={{ width: "100%", objectFit:"fill" }}
                />
            </>
            )}
        </div>
    );
};

export default VideoPanelView;