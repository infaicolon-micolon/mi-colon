import { NextResponse } from 'next/server';

export async function GET() {
  const assetLinks = [
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: process.env.ANDROID_PACKAGE_NAME || "app.vercel.mi_colon_er.twa",
        sha256_cert_fingerprints: [
          process.env.ANDROID_SHA256_FINGERPRINT || "A7:97:4F:BA:9E:26:83:48:23:C1:BB:1F:29:3C:91:9C:96:7F:65:3D:BC:A2:FF:50:E4:05:C1:EE:DA:D6:1A:F1"
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
