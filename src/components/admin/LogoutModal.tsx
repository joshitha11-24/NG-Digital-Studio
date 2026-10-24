import React from 'react';
import { LogOut, AlertTriangle } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose }) => {
  const { logout } = useAdmin();

  if (!isOpen) return null;

  const handleConfirmLogout = () => {
    logout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-neutral-200 text-center space-y-4 font-sans-clean animate-in zoom-in-95">
        
        <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
          <LogOut className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-bold text-neutral-900 font-cinzel">
            Sign Out of Admin Portal?
          </h3>
          <p className="text-xs text-neutral-500">
            Are you sure you want to logout? You will need your credentials to access the studio dashboard again.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl border border-neutral-300 hover:bg-neutral-50 text-xs font-semibold text-neutral-700 transition-colors"
          >
            Cancel
          </button>
          
          <button
            onClick={handleConfirmLogout}
            className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            Logout
          </button>
        </div>

      </div>
    </div>
  );
};
