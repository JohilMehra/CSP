// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;


import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ This ensures env variables are injected into your client-side build
  env: {
    NEXT_PUBLIC_AGORA_APP_ID: process.env.NEXT_PUBLIC_AGORA_APP_ID,
    NEXT_PUBLIC_AGORA_TEMP_TOKEN: process.env.NEXT_PUBLIC_AGORA_TEMP_TOKEN,
  },
};

export default nextConfig;
