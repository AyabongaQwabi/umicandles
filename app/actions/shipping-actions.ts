'use server';

import {
  shiplogicService,
  type ShiplogicRateRequestV2,
  type ShiplogicShipmentRequestV2,
} from '@/lib/shiplogic-service';
import { supabase } from '@/lib/supabase';
import { products } from '@/config/index';

export async function getShippingRates(formData: FormData) {
  try {
    console.log('=== Starting shipping rate calculation ===');

    // Check if API key is available
    const apiKey = process.env.SHIPLOGIC_API_KEY;
    if (!apiKey) {
      console.error('SHIPLOGIC_API_KEY environment variable is not set');
      return {
        success: false,
        error: 'Shipping service is not configured. Please contact support.',
      };
    }

    // Extract address data from form
    const address = formData.get('address') as string;
    const city = formData.get('city') as string;
    const postalCode = formData.get('postalCode') as string;
    const country = (formData.get('country') as string) || 'South Africa';

    console.log('Form data received:', { address, city, postalCode, country });

    // Validate required fields
    if (!address || !city || !postalCode) {
      return {
        success: false,
        error: 'Please fill in all required address fields.',
      };
    }

    // Get cart items from form data
    const cartItemsJson = formData.get('cartItems') as string;
    let cartItems = [];

    try {
      cartItems = cartItemsJson ? JSON.parse(cartItemsJson) : [];
      console.log('Cart items parsed:', cartItems.length, 'items');
    } catch (e) {
      console.error('Error parsing cart items:', e);
      return {
        success: false,
        error: 'Invalid cart data. Please refresh the page and try again.',
      };
    }

    // Convert country name to ISO code
    const countryCode =
      country === 'South Africa'
        ? 'ZA'
        : country === 'Namibia'
        ? 'NA'
        : country === 'Botswana'
        ? 'BW'
        : country === 'Zimbabwe'
        ? 'ZW'
        : 'ZA';

    console.log('Country mapping:', { country, countryCode });

    // Calculate parcel dimensions and weight based on cart items
    const parcelDimensions = calculateParcelDimensions(cartItems);
    console.log('Calculated parcel dimensions:', parcelDimensions);

    // Create a basic rate request using v2 format
    const rateRequest: ShiplogicRateRequestV2 = {
      collection_address: {
        type: 'business',
        company: 'Umi Candles',
        street_address: '123 Main Street', // Your warehouse address
        local_area: 'Sandton',
        city: 'Johannesburg',
        zone: 'Gauteng',
        country: 'ZA',
        code: '2196',
      },
      delivery_address: {
        type: 'residential',
        street_address: address,
        local_area: '',
        city: city,
        zone: '', // Province/state
        country: countryCode,
        code: postalCode,
      },
      parcels: [
        {
          submitted_length_cm: parcelDimensions.length,
          submitted_width_cm: parcelDimensions.width,
          submitted_height_cm: parcelDimensions.height,
          submitted_weight_kg: parcelDimensions.weight,
        },
      ],
      declared_value: calculateTotalValue(cartItems), // Calculate value based on cart items
    };

    console.log('Rate request prepared:', JSON.stringify(rateRequest, null, 2));

    try {
      console.log('Calling Shiplogic API...');
      // Get rates from Shiplogic v2 API
      const response = await shiplogicService.getRates(rateRequest);
      console.log('Shiplogic API response received:', response);

      if (response && response.rates && response.rates.length > 0) {
        // Transform the response to match our component's expected format
        const transformedRates = response.rates.map((rate) => ({
          id: `${rate.service_level.id}`,
          courier: {
            id: rate.service_level.code,
            name: rate.service_level.name,
            logo_url: '', // Shiplogic v2 doesn't provide logo URLs
          },
          service_level: {
            id: `${rate.service_level.id}`,
            name: rate.service_level.name,
            code: rate.service_level.code,
          },
          collection_min_date: rate.service_level.collection_date,
          delivery_min_date: rate.service_level.delivery_date_from,
          delivery_max_date: rate.service_level.delivery_date_to,
          total: {
            amount: rate.rate,
            currency: 'ZAR',
          },
          valid_until: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
        }));

        console.log('Transformed rates:', transformedRates);
        return { success: true, rates: transformedRates };
      } else {
        console.log('No rates returned in response:', response);
        return {
          success: false,
          error:
            'No shipping rates available for this address. Please verify your address details.',
        };
      }
    } catch (apiError) {
      console.error('Shiplogic API error:', apiError);

      // Provide more specific error messages based on the error
      let errorMessage =
        "We're having trouble calculating shipping rates at the moment.";

      if (apiError instanceof Error) {
        if (
          apiError.message.includes('401') ||
          apiError.message.includes('Unauthorized')
        ) {
          errorMessage =
            'Shipping service authentication failed. Please contact support.';
        } else if (
          apiError.message.includes('400') ||
          apiError.message.includes('Bad Request')
        ) {
          errorMessage =
            'Invalid address information. Please check your address details and try again.';
        } else if (apiError.message.includes('404')) {
          errorMessage = 'Shipping service not found. Please contact support.';
        } else if (apiError.message.includes('500')) {
          errorMessage =
            'Shipping service is temporarily unavailable. Please try again later.';
        }
      }

      return {
        success: false,
        error: errorMessage,
        debug:
          process.env.NODE_ENV === 'development' ? apiError.message : undefined,
      };
    }
  } catch (error) {
    console.error('General error in getShippingRates:', error);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
      debug:
        process.env.NODE_ENV === 'development'
          ? error instanceof Error
            ? error.message
            : 'Unknown error'
          : undefined,
    };
  }
}

export async function createShipment(
  orderId: string,
  serviceLevelCode: string
) {
  try {
    console.log(
      `Creating shipment for order ${orderId} with service level ${serviceLevelCode}`
    );

    // Fetch the order from the database
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();
    console.log('Fetched order:', order);
    if (error || !order) {
      throw new Error(`Order not found: ${error?.message || 'Unknown error'}`);
    }

    // Calculate parcel dimensions and weight based on order items
    const parcelDimensions = calculateParcelDimensionsFromOrder(order.items);
    console.log('Calculated parcel dimensions for order:', parcelDimensions);

    // Create a shipment request
    const shipmentRequest: ShiplogicShipmentRequestV2 = {
      collection_address: {
        type: 'business',
        company: 'Umi Candles',
        street_address: '123 Main Street', // Your warehouse address
        local_area: 'Sandton',
        city: 'Johannesburg',
        zone: 'Gauteng',
        country: 'ZA',
        code: '2196',
      },
      collection_contact: {
        name: 'Umi Candles',
        email: 'orders@umicandles.com', // Your business email
        mobile_number: '0123456789', // Your business phone
      },
      delivery_address: {
        type: 'residential',
        street_address: order.shipping_address,
        local_area: '',
        city: order.shipping_city,
        zone: '',
        country: 'ZA', // Default to South Africa
        code: order.shipping_postal_code,
      },
      delivery_contact: {
        name: order.customer_name,
        email: order.customer_email,
        mobile_number: order.customer_phone || '',
      },
      parcels: [
        {
          submitted_length_cm: parcelDimensions.length,
          submitted_width_cm: parcelDimensions.width,
          submitted_height_cm: parcelDimensions.height,
          submitted_weight_kg: parcelDimensions.weight,
          parcel_description: `Umi Candles Order #${order.order_number}`,
        },
      ],
      service_level_code: serviceLevelCode,
      declared_value: order.total,
      customer_reference: `Order #${order.order_number}`,
      special_instructions_delivery: order.shipping_notes || '',
    };

    console.log(
      'Creating shipment with request:',
      JSON.stringify(shipmentRequest, null, 2)
    );

    // Create the shipment
    const shipment = await shiplogicService.createShipment(shipmentRequest);
    console.log('Shipment created:', shipment);

    // Update the order with tracking information
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        tracking_number: shipment.short_tracking_reference,
        shipping_provider: 'Shiplogic',
        shipping_status: shipment.status,
        estimated_delivery_date: shipment.estimated_delivery_to,
      })
      .eq('id', orderId);

    if (updateError) {
      console.error('Error updating order with tracking info:', updateError);
    }

    return {
      success: true,
      message: `Shipment created for order ${orderId}`,
      trackingNumber: shipment.short_tracking_reference,
      shipmentId: shipment.id,
      status: shipment.status,
      estimatedDelivery: {
        from: shipment.estimated_delivery_from,
        to: shipment.estimated_delivery_to,
      },
    };
  } catch (error) {
    console.error('Error creating shipment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Helper function to calculate parcel dimensions based on cart items
function calculateParcelDimensions(cartItems: any[]) {
  if (!cartItems || !cartItems.length) {
    // Default dimensions if no items
    return {
      length: 30,
      width: 20,
      height: 15,
      weight: 1,
    };
  }

  let totalVolume = 0;
  let totalWeight = 0;
  let maxLength = 0;
  let maxWidth = 0;
  let maxHeight = 0;

  // Process each cart item
  cartItems.forEach((item) => {
    // Find the product in the config
    const product = products.find((p) => p.id === item.id);

    if (product) {
      // Use product dimensions from config
      const length = product.boxLengthInCm || 15;
      const width = product.boxWidthInCm || 10;
      const height = product.boxHeightInCm || 5;
      const weight = (product.boxWeightInGrams || 500) / 1000; // Convert grams to kg

      // Update max dimensions
      maxLength = Math.max(maxLength, length);
      maxWidth = Math.max(maxWidth, width);
      maxHeight = Math.max(maxHeight, height);

      // Add to total volume and weight
      totalVolume += length * width * height * item.quantity;
      totalWeight += weight * item.quantity;
    } else {
      // Use default values if product not found
      totalVolume += 15 * 10 * 5 * item.quantity;
      totalWeight += 0.5 * item.quantity;
    }
  });

  // Calculate dimensions for a single box that could contain all items
  // This is a simple approximation - for more complex packing, you might need a more sophisticated algorithm
  const cubeRoot = Math.cbrt(totalVolume);

  return {
    length: Math.max(maxLength, Math.ceil(cubeRoot)),
    width: Math.max(maxWidth, Math.ceil(cubeRoot * 0.8)),
    height: Math.max(maxHeight, Math.ceil(cubeRoot * 0.6)),
    weight: Math.max(0.5, totalWeight), // Ensure minimum weight of 0.5kg
  };
}

// Helper function to calculate parcel dimensions based on order items from database
function calculateParcelDimensionsFromOrder(orderItems: any[]) {
  if (!orderItems || !orderItems.length) {
    // Default dimensions if no items
    return {
      length: 30,
      width: 20,
      height: 15,
      weight: 1,
    };
  }

  let totalVolume = 0;
  let totalWeight = 0;
  let maxLength = 0;
  let maxWidth = 0;
  let maxHeight = 0;

  // Process each order item
  orderItems.forEach((item) => {
    // Find the product in the config
    const product = products.find((p) => p.id === item.id);

    if (product) {
      // Use product dimensions from config
      const length = product?.boxLengthInCm || 15;
      const width = product.boxWidthInCm || 10;
      const height = product.boxHeightInCm || 5;
      const weight = (product.boxWeightInGrams || 500) / 1000; // Convert grams to kg

      // Update max dimensions
      maxLength = Math.max(maxLength, length);
      maxWidth = Math.max(maxWidth, width);
      maxHeight = Math.max(maxHeight, height);

      // Add to total volume and weight
      totalVolume += length * width * height * item.quantity;
      totalWeight += weight * item.quantity;
    } else {
      // Use default values if product not found
      totalVolume += 15 * 10 * 5 * item.quantity;
      totalWeight += 0.5 * item.quantity;
    }
  });

  // Calculate dimensions for a single box that could contain all items
  const cubeRoot = Math.cbrt(totalVolume);

  return {
    length: Math.max(maxLength, Math.ceil(cubeRoot)),
    width: Math.max(maxWidth, Math.ceil(cubeRoot * 0.8)),
    height: Math.max(maxHeight, Math.ceil(cubeRoot * 0.6)),
    weight: Math.max(0.5, totalWeight), // Ensure minimum weight of 0.5kg
  };
}

// Helper function to calculate total value of cart items
function calculateTotalValue(cartItems: any[]) {
  if (!cartItems || !cartItems.length) return 500; // Default value

  return cartItems.reduce((total, item) => {
    const product = products.find((p) => p.id === item.id);
    const price = product ? product.price : 0;
    return total + price * item.quantity;
  }, 0);
}
