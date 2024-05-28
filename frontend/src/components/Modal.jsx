import React, { useEffect } from "react";

const Modal = ({ title, children, onClose }) => {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="bg-black bg-opacity-50 absolute inset-0"
        onClick={onClose}
        role="button"
        tabIndex={-1}
        aria-label="Close modal"
      ></div>
      <div
        className="bg-white rounded-lg p-8 relative"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button
          className="absolute top-2 right-2"
          onClick={onClose}
          aria-label="Close"
        >
          X
        </button>
        <h2 className="text-2xl font-bold mb-4" id="modal-title">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
};

export default Modal;
