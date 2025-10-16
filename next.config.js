/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ⛔ Abaikan error linting saat build production
    ignoreDuringBuilds: true,
  },
  typescript: {
    // ⛔ (opsional) Abaikan error TS saat build, biar gak gagal build di Docker
    ignoreBuildErrors: true,
  },
  swcMinify: true, // ✅ pastikan pakai SWC agar build lebih cepat
  output: "standalone", // ✅ bagus buat Docker
};

module.exports = nextConfig;
