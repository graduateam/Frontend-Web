import React from "react";

const CameraDropdown = ({ cameras, onSelectCamera, selectedCameraId }) => {
  const handleSelectChange = (e) => {
    const cameraId = parseInt(e.target.value);
    if (cameraId) {
      onSelectCamera(cameraId);
    }
  };

  return (
    <div className="camera-dropdown-container">
      <select
        onChange={handleSelectChange}
        className="camera-dropdown seoul-14-bold"
        value={selectedCameraId || ""}
      >
        <option value="">카메라 선택</option>
        {cameras.map((camera) => (
          <option key={camera.id} value={camera.id}>
            {camera.name} (ID: {camera.id})
          </option>
        ))}
      </select>
    </div>
  );
};

export default CameraDropdown;
