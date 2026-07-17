'use client';

import { createContext, useContext, useRef, useState } from 'react';

type PrefillRequest = {
  interest: string;
  note: string | null;
  requestId: number;
};

type PrefillContextValue = {
  request: PrefillRequest | null;
  requestPrefill: (interest: string, note?: string) => void;
};

const PrefillContext = createContext<PrefillContextValue | null>(null);

export function useConnectCardPrefill() {
  const ctx = useContext(PrefillContext);
  if (!ctx) {
    throw new Error('useConnectCardPrefill must be used within JoinPageProvider');
  }
  return ctx;
}

export function JoinPageProvider({ children }: { children: React.ReactNode }) {
  const [request, setRequest] = useState<PrefillRequest | null>(null);
  const counterRef = useRef(0);

  function requestPrefill(interest: string, note?: string) {
    counterRef.current += 1;
    setRequest({ interest, note: note ?? null, requestId: counterRef.current });
  }

  return (
    <PrefillContext.Provider value={{ request, requestPrefill }}>
      {children}
    </PrefillContext.Provider>
  );
}
