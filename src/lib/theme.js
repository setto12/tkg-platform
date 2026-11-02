import themeConfig from "@/config/theme.json";

export function getThemeColors(mode = "light") {
  return themeConfig.colors[mode] || themeConfig.colors.light;
}