import { NextResponse } from 'next/server';

export async function GET() {
  const assetLinks = [
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: "app.vercel.mi_colon_er.twa",
        sha256_cert_fingerprints: [
          "BB:D3:A2:07:BC:33:CE:93:48:1D:4B:58:35:EA:B8:E5:4F:BD:C9:1C:B3:54:DB:27:0B:77:58:18:99:F4:13:E5"
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
