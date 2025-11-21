import { NextRequest, NextResponse } from "next/server";

/**
 * API Route to handle MoMo payment callback redirect
 *
 * This route acts as a proxy when backend redirectUrl points to API endpoint.
 * MoMo redirects here with query params, then we redirect to frontend callback page.
 *
 * According to MoMo documentation:
 * - redirectUrl: Frontend URL where MoMo redirects user after payment (GET with query params)
 * - ipnUrl: Backend URL where MoMo sends POST notification (server-to-server)
 *
 * NOTE: Ideally, backend should configure redirectUrl directly to frontend:
 * https://your-frontend-domain.com/teachers/billing/callback
 *
 * This route is a fallback solution if backend cannot change redirectUrl.
 */
export async function GET(request: NextRequest) {
  try {
    // Get all query parameters from MoMo callback
    const searchParams = request.nextUrl.searchParams;

    // Extract key parameters for logging
    const errorCode = searchParams.get("errorCode");
    const orderId = searchParams.get("orderId");
    const transId = searchParams.get("transId");

    // Log callback for debugging
    console.log("MoMo callback received:", {
      errorCode,
      orderId,
      transId,
      hasParams: searchParams.toString().length > 0,
    });

    // Build the frontend callback URL with all query parameters
    const baseUrl = request.nextUrl.origin;
    const callbackUrl = new URL(`${baseUrl}/teachers/billing/callback`);

    // Copy all query parameters from MoMo callback to frontend callback URL
    searchParams.forEach((value, key) => {
      callbackUrl.searchParams.append(key, value);
    });

    // Redirect to frontend callback page with all query params
    return NextResponse.redirect(callbackUrl.toString(), {
      status: 302,
    });
  } catch (error) {
    console.error("Payment callback redirect error:", error);

    // On error, redirect to billing page with error flag
    const baseUrl = request.nextUrl.origin;
    return NextResponse.redirect(
      `${baseUrl}/teachers/billing?paymentResult=failed`,
      {
        status: 302,
      }
    );
  }
}

/**
 * POST handler for MoMo IPN (Instant Payment Notification)
 * This is optional - MoMo can send server-to-server notification here
 * if configured as ipnUrl in payment request
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Log IPN notification
    console.log("MoMo IPN received:", {
      orderId: body.orderId,
      transId: body.transId,
      errorCode: body.errorCode,
    });

    // If you need to process IPN, forward to backend API
    // For now, just redirect to frontend callback page with query params
    const baseUrl = request.nextUrl.origin;
    const callbackUrl = new URL(`${baseUrl}/teachers/billing/callback`);

    // Convert body to query params
    Object.entries(body).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        callbackUrl.searchParams.append(key, String(value));
      }
    });

    return NextResponse.redirect(callbackUrl.toString(), {
      status: 302,
    });
  } catch (error) {
    console.error("Payment IPN error:", error);

    const baseUrl = request.nextUrl.origin;
    return NextResponse.redirect(
      `${baseUrl}/teachers/billing?paymentResult=failed`,
      {
        status: 302,
      }
    );
  }
}
