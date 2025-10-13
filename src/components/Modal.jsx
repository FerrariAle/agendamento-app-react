export default function Modal({ isOpen, onClose, children }) {
    if (!isOpen) return null;

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center"
        >
            {/* Container Modal */}
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full"
            >
                {children}
            </div>
        </div>
    );
}