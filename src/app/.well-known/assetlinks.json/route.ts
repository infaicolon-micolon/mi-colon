import { NextResponse } from 'next/server';

export async function GET() {
  const assetLinks = [
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: process.env.ANDROID_PACKAGE_NAME || "app.vercel.mi_colon_er.twa",
        sha256_cert_fingerprints: [
          "A7:97:4F:BA:9E:26:83:48:23:C1:BB:1F:29:3C:91:9C:96:7F:65:3D:BC:A2:FF:50:E4:05:C1:EE:DA:D6:1A:F1",
          "E8:EE:03:F2:45:F8:27:3A:44:29:9A:F3:D6:56:59:22:C1:ED:FD:77:99:67:DD:2B:B2:74:2E:04:3F:BB:C7:D3"
        ]
      }
    }
  ];

  return NextResponse.json(assetLinks, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
