import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "bd.rajshahirentacar.driver",
  appName: "Rajshahi Driver",
  webDir: "www",
  // The driver screens are hosted by the dashboard app on Vercel. Swap in
  // https://dashboard.rajshahirentacar.bd once that domain's DNS is set.
  server: {
    url: "https://rajshahi-dashboard.vercel.app/driver",
  },
  android: {
    allowMixedContent: false,
  },
};

export default config;
