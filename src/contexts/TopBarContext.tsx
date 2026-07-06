import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export interface TopBarConfig {
  /** Title shown next to the back/menu button (e.g. the entity name). */
  title?: ReactNode
  /** Actions shown on the far right of the mobile top bar. */
  right?: ReactNode
}

interface TopBarContextValue {
  config: TopBarConfig
  setConfig: (c: TopBarConfig) => void
}

const TopBarContext = createContext<TopBarContextValue | null>(null)

export function TopBarProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<TopBarConfig>({})
  return (
    <TopBarContext.Provider value={{ config, setConfig }}>
      {children}
    </TopBarContext.Provider>
  )
}

/** Read the current top-bar config (used by AppShell). */
export function useTopBarConfig(): TopBarConfig {
  return useContext(TopBarContext)?.config ?? {}
}

/**
 * Set the mobile top-bar title/actions for the lifetime of a page.
 * Pass a deps array so the injected content updates when page state changes.
 */
export function useTopBar(config: TopBarConfig, deps: unknown[]) {
  const ctx = useContext(TopBarContext)
  useEffect(() => {
    ctx?.setConfig(config)
    return () => ctx?.setConfig({})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
