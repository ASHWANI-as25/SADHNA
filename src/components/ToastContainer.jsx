import useToastStore from '../services/toastService';
import Toast from './Toast';

export const ToastContainer = () => {
  const toasts = useToastStore((state) => state.toasts);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
      <div className="pointer-events-auto space-y-3">
        {toasts.map((t) => (
          <Toast key={t.id} id={t.id} message={t.message} type={t.type} />
        ))}
      </div>
    </div>
  );
};

export default ToastContainer;
