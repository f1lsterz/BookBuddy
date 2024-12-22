const LoadingSpinner = () => {
  const spinnerStyle = {
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #3498db",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    animation: "spin 2s linear infinite",
  };

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    position: "absolute",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    zIndex: "1000",
  };

  return (
    <div style={containerStyle}>
      <div style={spinnerStyle}></div>
    </div>
  );
};

export default LoadingSpinner;
