import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

export const CustomAlert = ({ message, type = 'error' }) => (
  <div className={`${
    type === 'error' ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-green-500/10 border-green-500 text-green-500'
  } border px-4 py-3 rounded-lg flex items-center gap-2 mb-8`}>
    {type === 'error' ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
    <p>{message}</p>
  </div>
);