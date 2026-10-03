import { NextResponse } from 'next/server';

export async function GET() {
  const assetLinks = [
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: "app.vercel.mi_colon_er.twa",
        sha256_cert_fingerprints: [
          "E8:EE:03:F2:45:F8:27:3A:44:29:9A:F3:D6:56:59:22:C1:ED:FD:77:99:67:DD:2B:B2:74:2E:04:3F:BB:C7:D3"
        ]
      }
    }
  ];

  return NextResponse.json(assetLinks, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
