import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { GiCancel } from "react-icons/gi";

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

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center z-50 rounded">
      <div
        className="bg-black bg-opacity-80 absolute inset-0"
        onClick={onClose}
        role="button"
        tabIndex={-1}
        aria-label="Close modal"
      ></div>
      <div
        className="bg-white rounded-lg p-8 relative max-w-2xl mx-auto w-full max-h-[90vh] overflow-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button
          className="absolute top-2 right-2 bg-white rounded-full text-red-400"
          onClick={onClose}
          aria-label="Close"
        >
          <GiCancel size={35}/>
        </button>
        <h2 className="text-2xl font-bold mb-4" id="modal-title">
          {title}
        </h2>
        {children}
      </div>
    </div>,
    document.body // Portal target
  );
};

export default Modal;
