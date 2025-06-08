import { NextResponse } from 'next/server';
import { shiplogicService } from '@/lib/shiplogic-service';

export async function GET() {
  try {
    console.log('Testing Shiplogic API connection...');

    // Check environment variables
    const apiKey = process.env.SHIPLOGIC_API_KEY;
    const accountId = process.env.SHIPLOGIC_ACCOUNT_ID;
    const baseUrl =
      process.env.SHIPLOGIC_BASE_URL || 'https://api.shiplogic.com';

    console.log('Environment check:', {
      hasApiKey: !!apiKey,
      hasAccountId: !!accountId,
      baseUrl,
      accountId: accountId ? Number.parseInt(accountId) : undefined,
    });

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'SHIPLOGIC_API_KEY environment variable is not set',
          debug: {
            hasApiKey: false,
            hasAccountId: !!accountId,
            baseUrl,
          },
        },
        { status: 500 }
      );
    }

    if (!accountId) {
      return NextResponse.json(
        {
          success: false,
          error: 'SHIPLOGIC_ACCOUNT_ID environment variable is not set',
          debug: {
            hasApiKey: true,
            hasAccountId: false,
            baseUrl,
          },
        },
        { status: 500 }
      );
    }

    // Create a test rate request
    const testRequest = {
      account_id: Number.parseInt(accountId),
      collection_address: {
        type: 'business' as const,
        company: 'Umi Candles',
        street_address: '123 Main Street',
        local_area: 'Sandton',
        city: 'Johannesburg',
        zone: 'Gauteng',
        country: 'ZA',
        code: '2196',
      },
      delivery_address: {
        type: 'residential' as const,
        street_address: '10 Midas Avenue',
        local_area: 'Olympus AH',
        city: 'Pretoria',
        zone: 'Gauteng',
        country: 'ZA',
        code: '0081',
      },
      parcels: [
        {
          submitted_length_cm: 30,
          submitted_width_cm: 20,
          submitted_height_cm: 15,
          submitted_weight_kg: 1,
        },
      ],
      declared_value: 500,
    };

    console.log('Making test request to Shiplogic API...');
    console.log('Test request:', JSON.stringify(testRequest, null, 2));

    // Test the API connection
    const response = await shiplogicService.getRates(testRequest);

    console.log('Test successful! Response:', response);

    return NextResponse.json({
      success: true,
      message: 'Shiplogic API connection successful',
      response: response,
      debug: {
        hasApiKey: true,
        hasAccountId: true,
        baseUrl,
        accountId: Number.parseInt(accountId),
      },
    });
  } catch (error) {
    console.error('Shiplogic API test failed:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        debug: {
          hasApiKey: !!process.env.SHIPLOGIC_API_KEY,
          hasAccountId: !!process.env.SHIPLOGIC_ACCOUNT_ID,
          baseUrl:
            process.env.SHIPLOGIC_BASE_URL || 'https://api.shiplogic.com',
        },
      },
      { status: 500 }
    );
  }
}
