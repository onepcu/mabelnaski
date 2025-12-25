import { useEffect } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { data: settings } = useSiteSettings();

  useEffect(() => {
    if (!settings) return;

    const root = document.documentElement;

    // Apply theme mode
    if (settings.theme_mode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Apply custom colors (only if set)
    if (settings.primary_color) {
      root.style.setProperty("--primary", settings.primary_color);
      root.style.setProperty("--ring", settings.primary_color);
    }
    if (settings.secondary_color) {
      root.style.setProperty("--secondary", settings.secondary_color);
    }
    if (settings.accent_color) {
      root.style.setProperty("--accent", settings.accent_color);
    }

    // Update document title
    if (settings.site_name) {
      document.title = settings.site_name;
    }

    return () => {
      // Clean up custom styles when unmounting
      root.style.removeProperty("--primary");
      root.style.removeProperty("--secondary");
      root.style.removeProperty("--accent");
      root.style.removeProperty("--ring");
    };
  }, [settings]);

  return <>{children}</>;
};
