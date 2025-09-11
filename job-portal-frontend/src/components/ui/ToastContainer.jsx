
const ToastContainer = ({ toasts }) => (
    <div className="fixed bottom-4 right-4 z-[100] space-y-3">
        {toasts.map(toast => {
            const colors = {
                success: 'bg-green-500',
                error: 'bg-red-500',
                info: 'bg-blue-500'
            };
            return (
                <div key={toast.id} className={`${colors[toast.type]} text-white py-2 px-4 rounded-lg shadow-lg animate-fade-in-up`}>
                    {toast.message}
                </div>
            )
        })}
    </div>
);

export default ToastContainer
