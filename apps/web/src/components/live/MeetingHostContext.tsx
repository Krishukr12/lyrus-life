import { createContext, useContext, type ReactNode } from "react";

type MeetingHostContextValue = {
  hostUserId: string | null;
  hostName: string | null;
};

const MeetingHostContext = createContext<MeetingHostContextValue>({
  hostUserId: null,
  hostName: null,
});

export function MeetingHostProvider({
  hostUserId,
  hostName,
  children,
}: MeetingHostContextValue & { children: ReactNode }) {
  return (
    <MeetingHostContext.Provider value={{ hostUserId, hostName }}>{children}</MeetingHostContext.Provider>
  );
}

export function useMeetingHost() {
  return useContext(MeetingHostContext);
}
