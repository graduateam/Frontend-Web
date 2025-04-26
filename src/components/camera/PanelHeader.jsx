import React from "react";

const PanelHeader = ({ camera, onClose }) => {
  if (!camera) return null;

  return (
    <div className="panel-header">
      <button className="close-button" onClick={onClose}>
        ×
      </button>
      <h3 className="camera-name seoul-16-bold">
        {camera.name} (ID: {camera.id})
      </h3>
    </div>
  );
};

export default PanelHeader;
