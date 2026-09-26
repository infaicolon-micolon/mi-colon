import { NextResponse } from 'next/server';

export async function GET() {
  const assetLinks = [
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: process.env.ANDROID_PACKAGE_NAME || "ar.gob.colon.micolon",
        sha256_cert_fingerprints: [
          process.env.ANDROID_SHA256_FINGERPRINT || "FA:26:13:83:81:4A:ED:DF:D3:52:16:D4:6F:E1:CA:58:BF:41:8D:18:2C:12:02:D5:19:5D:87:C7:E2:B0:02:83"
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
