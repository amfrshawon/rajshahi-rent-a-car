import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "bd.rajshahirentacar.driver",
  appName: "Rajshahi Driver",
  webDir: "www",
  // The driver screens are hosted by the dashboard app. Replace this with the
  // production dashboard URL once M3's deploy step is done.
  server: {
    url: "https://dashboard.rajshahirentacar.bd/driver",
  },
  android: {
    allowMixedContent: false,
  },
};

export default config;
