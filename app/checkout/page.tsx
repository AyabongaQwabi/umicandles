'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CreditCard,
  Truck,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useCart } from '@/context/cart-context';
import {
  getShippingRates,
  createShipment,
} from '@/app/actions/shipping-actions';
import { Skeleton } from '@/components/ui/skeleton';
import {
  initializeYoco,
  createYocoCheckout,
  type YocoPaymentResult,
} from '@/lib/yoco-service';
import {
  generateOrderNumber,
  saveOrder,
  saveOrderToLocalStorage,
} from '@/lib/supabase';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [shipping, setShipping] = useState(0);
  const total = subtotal + shipping;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'South Africa',
  });

  const [paymentStatus, setPaymentStatus] = useState<
    'idle' | 'processing' | 'success' | 'error'
  >('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [sdkLoaded, setSdkLoaded] = useState(false);

  // Shipping states
  const [shippingRates, setShippingRates] = useState<any[]>([]);
  const [selectedRate, setSelectedRate] = useState<string | null>(null);
  const [loadingRates, setLoadingRates] = useState(false);
  const [addressComplete, setAddressComplete] = useState(false);
  const [addressTouched, setAddressTouched] = useState({
    address: false,
    city: false,
    postalCode: false,
    country: false,
  });

  // Initialize Yoco SDK
  useEffect(() => {
    const loadYocoSDK = async () => {
      try {
        await initializeYoco();
        setSdkLoaded(true);
        console.log('Yoco SDK initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Yoco SDK:', error);
        setErrorMessage(
          'Payment gateway is currently unavailable. Please try again later.'
        );
      }
    };

    loadYocoSDK();
  }, []);

  // Redirect to cart if empty
  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items, router]);

  // Check if address is complete
  useEffect(() => {
    const isComplete =
      formData.address.trim() !== '' &&
      formData.city.trim() !== '' &&
      formData.postalCode.trim() !== '' &&
      formData.country.trim() !== '';

    setAddressComplete(isComplete);

    // Fetch shipping rates if address is complete
    if (
      isComplete &&
      addressTouched.address &&
      addressTouched.city &&
      addressTouched.postalCode
    ) {
      fetchShippingRates();
    }
  }, [formData, addressTouched]);

  const fetchShippingRates = async () => {
    setLoadingRates(true);
    setErrorMessage('');

    try {
      // Create form data for shipping rate request
      const rateFormData = new FormData();
      rateFormData.append('address', formData.address);
      rateFormData.append('city', formData.city);
      rateFormData.append('postalCode', formData.postalCode);
      rateFormData.append('country', formData.country);

      // Add cart items to form data
      const cartItemsFormatted = items.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
      }));
      rateFormData.append('cartItems', JSON.stringify(cartItemsFormatted));

      const result = await getShippingRates(rateFormData);

      if (result.success && result.rates && result.rates.length > 0) {
        setShippingRates(result.rates);

        // Auto-select the cheapest rate
        const cheapestRate = result.rates.reduce((prev, current) =>
          prev.total.amount < current.total.amount ? prev : current
        );
        setSelectedRate(cheapestRate.id);
        setShipping(cheapestRate.total.amount);
      } else {
        setErrorMessage(
          result.error || 'No shipping options available for your address'
        );
        setShippingRates([]);
        // Set default shipping cost
        setShipping(75);
      }
    } catch (error) {
      console.error('Error fetching shipping rates:', error);
      setErrorMessage(
        'Failed to calculate shipping rates. Using standard shipping rate.'
      );
      setShippingRates([]);
      // Set default shipping cost
      setShipping(75);
    } finally {
      setLoadingRates(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Mark address fields as touched when user interacts with them
    if (['address', 'city', 'postalCode', 'country'].includes(name)) {
      setAddressTouched((prev) => ({
        ...prev,
        [name]: true,
      }));
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleShippingSelect = (rateId: string, amount: number) => {
    setSelectedRate(rateId);
    setShipping(amount);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentStatus('processing');

    // Validate form
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.address
    ) {
      setErrorMessage('Please fill in all required fields');
      setPaymentStatus('error');
      return;
    }

    // Validate shipping selection
    if (!selectedRate && shippingRates.length > 0) {
      setErrorMessage('Please select a shipping option');
      setPaymentStatus('error');
      return;
    }

    // Check if SDK is loaded
    if (!sdkLoaded) {
      setErrorMessage(
        'Payment gateway is not ready. Please refresh the page and try again.'
      );
      setPaymentStatus('error');
      return;
    }

    // Generate order number
    const generatedOrderNumber = generateOrderNumber();
    setOrderNumber(generatedOrderNumber);

    try {
      // Process payment with Yoco Checkout
      await createYocoCheckout({
        amount: total,
        currency: 'ZAR',
        name: 'Umi Candles',
        description: `Order #${generatedOrderNumber}`,
        callback: (result) =>
          handlePaymentComplete(result, generatedOrderNumber),
      });
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('error');
      setErrorMessage('Failed to initialize payment. Please try again.');
    }
  };

  const handlePaymentComplete = async (
    result: YocoPaymentResult,
    orderNum: string
  ) => {
    if (result.status === 'success') {
      setPaymentStatus('success');

      // Create order data object
      const orderData = {
        order_number: orderNum,
        customer_name: `${formData.firstName} ${formData.lastName}`,
        customer_email: formData.email,
        customer_phone: formData.phone,
        shipping_address: formData.address,
        shipping_city: formData.city,
        shipping_postal_code: formData.postalCode,
        shipping_country: formData.country,
        items: items.map((item) => ({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.image,
        })),
        subtotal,
        shipping_cost: shipping,
        total,
        payment_id: result.id,
        status: 'pending' as const,
        shipping_service_level: selectedRate
          ? shippingRates.find((rate) => rate.id === selectedRate)
              ?.service_level?.code
          : null,
      };

      try {
        console.log('Saving order:', orderNum);

        // Always save to localStorage first as a backup
        saveOrderToLocalStorage(orderData);

        // Try to save order to Supabase
        const { data, error } = await saveOrder(orderData);

        if (error) {
          console.error('Error saving order to Supabase:', error);
          console.log('Order saved to localStorage as fallback');
        } else {
          console.log('Order saved successfully:', data?.order_number);

          // Create shipment if we have a selected shipping rate
          if (selectedRate && data?.id) {
            try {
              const selectedRateData = shippingRates.find(
                (rate) => rate.id === selectedRate
              );
              console.log('Creating shipment for rate:', selectedRateData);
              if (selectedRateData?.service_level?.code) {
                const shipmentResult = await createShipment(
                  data.id,
                  selectedRateData.service_level.code
                );
                console.log('Shipment created:', shipmentResult);
              }
            } catch (shipmentError) {
              console.error('Error creating shipment:', shipmentError);
            }
          }
        }
      } catch (error) {
        console.error('Exception when saving order:', error);
        console.log('Order saved to localStorage as fallback');
      }

      // Clear cart regardless of database success
      clearCart();

      // Redirect to success page if shouldRedirect is true
      if (result.shouldRedirect) {
        //window.location.href = `/checkout/success?order=${orderNum}`;
      }
    } else if (result.status === 'error') {
      setPaymentStatus('error');
      setErrorMessage(result.message || 'Payment failed. Please try again.');

      // Redirect to failed page if shouldRedirect is true
      if (result.shouldRedirect) {
        // window.location.href = `/checkout/failed?message=${encodeURIComponent(
        //  result.message || 'Payment failed'
        // )}`;
      }
    } else {
      // Payment was cancelled
      setPaymentStatus('idle');
    }
  };

  return (
    <main className='min-h-screen pt-24 pb-16'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='mb-8'>
          <Link
            href='/cart'
            className='text-gray-600 hover:text-gray-900 flex items-center'
          >
            <ArrowLeft className='h-4 w-4 mr-1' />
            Back to Cart
          </Link>
        </div>

        <h1 className='text-3xl font-serif font-medium mb-8'>Checkout</h1>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Checkout Form */}
          <div className='lg:col-span-2'>
            <div className='bg-white rounded-lg shadow-sm p-6'>
              <h2 className='text-xl font-medium mb-6'>Shipping Information</h2>

              {paymentStatus === 'error' && (
                <div className='mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md'>
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <label
                      htmlFor='firstName'
                      className='block text-sm font-medium text-gray-700 mb-1'
                    >
                      First Name *
                    </label>
                    <input
                      type='text'
                      id='firstName'
                      name='firstName'
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500'
                    />
                  </div>
                  <div>
                    <label
                      htmlFor='lastName'
                      className='block text-sm font-medium text-gray-700 mb-1'
                    >
                      Last Name *
                    </label>
                    <input
                      type='text'
                      id='lastName'
                      name='lastName'
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500'
                    />
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <label
                      htmlFor='email'
                      className='block text-sm font-medium text-gray-700 mb-1'
                    >
                      Email Address *
                    </label>
                    <input
                      type='email'
                      id='email'
                      name='email'
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500'
                    />
                  </div>
                  <div>
                    <label
                      htmlFor='phone'
                      className='block text-sm font-medium text-gray-700 mb-1'
                    >
                      Phone Number
                    </label>
                    <input
                      type='tel'
                      id='phone'
                      name='phone'
                      value={formData.phone}
                      onChange={handleChange}
                      className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500'
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor='address'
                    className='block text-sm font-medium text-gray-700 mb-1'
                  >
                    Address *
                  </label>
                  <input
                    type='text'
                    id='address'
                    name='address'
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500'
                  />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                  <div>
                    <label
                      htmlFor='city'
                      className='block text-sm font-medium text-gray-700 mb-1'
                    >
                      City *
                    </label>
                    <input
                      type='text'
                      id='city'
                      name='city'
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500'
                    />
                  </div>
                  <div>
                    <label
                      htmlFor='postalCode'
                      className='block text-sm font-medium text-gray-700 mb-1'
                    >
                      Postal Code *
                    </label>
                    <input
                      type='text'
                      id='postalCode'
                      name='postalCode'
                      value={formData.postalCode}
                      onChange={handleChange}
                      required
                      className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500'
                    />
                  </div>
                  <div>
                    <label
                      htmlFor='country'
                      className='block text-sm font-medium text-gray-700 mb-1'
                    >
                      Country *
                    </label>
                    <select
                      id='country'
                      name='country'
                      value={formData.country}
                      onChange={handleChange}
                      required
                      className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500'
                    >
                      <option value='South Africa'>South Africa</option>
                      <option value='Namibia'>Namibia</option>
                      <option value='Botswana'>Botswana</option>
                      <option value='Zimbabwe'>Zimbabwe</option>
                    </select>
                  </div>
                </div>

                {/* Shipping Options Section */}
                <div className='pt-4 border-t border-gray-200'>
                  <h3 className='text-lg font-medium mb-4'>Shipping Options</h3>

                  {!addressComplete && (
                    <div className='bg-amber-50 p-4 rounded-md text-amber-800 flex items-start'>
                      <AlertCircle className='h-5 w-5 mr-2 flex-shrink-0 mt-0.5' />
                      <p>
                        Please complete your shipping address to see available
                        shipping options.
                      </p>
                    </div>
                  )}

                  {addressComplete && loadingRates && (
                    <div className='space-y-3'>
                      <div className='flex items-center'>
                        <Skeleton className='h-12 w-12 rounded-md mr-3' />
                        <div className='space-y-2 flex-1'>
                          <Skeleton className='h-4 w-3/4' />
                          <Skeleton className='h-3 w-1/2' />
                        </div>
                        <Skeleton className='h-6 w-16' />
                      </div>
                      <div className='flex items-center'>
                        <Skeleton className='h-12 w-12 rounded-md mr-3' />
                        <div className='space-y-2 flex-1'>
                          <Skeleton className='h-4 w-3/4' />
                          <Skeleton className='h-3 w-1/2' />
                        </div>
                        <Skeleton className='h-6 w-16' />
                      </div>
                    </div>
                  )}

                  {addressComplete &&
                    !loadingRates &&
                    shippingRates.length > 0 && (
                      <div className='space-y-3'>
                        {shippingRates.map((rate) => (
                          <div
                            key={rate.id}
                            onClick={() =>
                              handleShippingSelect(rate.id, rate.total.amount)
                            }
                            className={`border rounded-md p-4 cursor-pointer transition-colors ${
                              selectedRate === rate.id
                                ? 'border-fuchsia-500 bg-fuchsia-50'
                                : 'border-gray-200 hover:border-fuchsia-300'
                            }`}
                          >
                            <div className='flex items-center justify-between'>
                              <div className='flex items-center space-x-3'>
                                <div className='w-12 h-12 relative flex-shrink-0 bg-white p-1 rounded border'>
                                  {rate.courier.logo_url ? (
                                    <Image
                                      src={
                                        rate.courier.logo_url ||
                                        '/placeholder.svg'
                                      }
                                      alt={rate.courier.name}
                                      fill
                                      className='object-contain'
                                    />
                                  ) : (
                                    <Truck className='w-full h-full text-gray-400' />
                                  )}
                                </div>
                                <div>
                                  <h4 className='font-medium'>
                                    {rate.courier.name}
                                  </h4>
                                  <p className='text-sm text-gray-600'>
                                    {rate.service_level.name}
                                  </p>
                                  <p className='text-xs text-gray-500'>
                                    Estimated delivery:{' '}
                                    {new Date(
                                      rate.delivery_min_date
                                    ).toLocaleDateString()}{' '}
                                    -{' '}
                                    {new Date(
                                      rate.delivery_max_date
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className='text-right flex items-center'>
                                <p className='font-medium mr-3'>
                                  R{rate.total.amount.toFixed(2)}
                                </p>
                                {selectedRate === rate.id && (
                                  <CheckCircle2 className='h-5 w-5 text-fuchsia-600' />
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                  {addressComplete &&
                    !loadingRates &&
                    shippingRates.length === 0 && (
                      <div className='space-y-3'>
                        <div className='bg-gray-50 p-4 rounded-md'>
                          <p className='text-sm text-gray-600 mb-3'>
                            {errorMessage || 'Standard shipping options:'}
                          </p>
                          <div
                            onClick={() => handleShippingSelect('standard', 75)}
                            className={`border rounded-md p-4 cursor-pointer transition-colors ${
                              selectedRate === 'standard'
                                ? 'border-fuchsia-500 bg-fuchsia-50'
                                : 'border-gray-200 hover:border-fuchsia-300'
                            }`}
                          >
                            <div className='flex items-center justify-between'>
                              <div className='flex items-center space-x-3'>
                                <div className='w-12 h-12 relative flex-shrink-0 bg-white p-1 rounded border'>
                                  <Truck className='w-full h-full text-gray-400' />
                                </div>
                                <div>
                                  <h4 className='font-medium'>
                                    Standard Delivery
                                  </h4>
                                  <p className='text-sm text-gray-600'>
                                    3-5 business days
                                  </p>
                                </div>
                              </div>
                              <div className='text-right flex items-center'>
                                <p className='font-medium mr-3'>R75.00</p>
                                {selectedRate === 'standard' && (
                                  <CheckCircle2 className='h-5 w-5 text-fuchsia-600' />
                                )}
                              </div>
                            </div>
                          </div>

                          <div
                            onClick={() => handleShippingSelect('express', 150)}
                            className={`border rounded-md p-4 cursor-pointer transition-colors mt-3 ${
                              selectedRate === 'express'
                                ? 'border-fuchsia-500 bg-fuchsia-50'
                                : 'border-gray-200 hover:border-fuchsia-300'
                            }`}
                          >
                            <div className='flex items-center justify-between'>
                              <div className='flex items-center space-x-3'>
                                <div className='w-12 h-12 relative flex-shrink-0 bg-white p-1 rounded border'>
                                  <Truck className='w-full h-full text-gray-400' />
                                </div>
                                <div>
                                  <h4 className='font-medium'>
                                    Express Delivery
                                  </h4>
                                  <p className='text-sm text-gray-600'>
                                    1-2 business days
                                  </p>
                                </div>
                              </div>
                              <div className='text-right flex items-center'>
                                <p className='font-medium mr-3'>R150.00</p>
                                {selectedRate === 'express' && (
                                  <CheckCircle2 className='h-5 w-5 text-fuchsia-600' />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                </div>

                <div className='pt-4'>
                  <h3 className='text-lg font-medium mb-4'>Payment Method</h3>
                  <div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
                    <div className='flex items-center'>
                      <input
                        type='radio'
                        id='yoco'
                        name='paymentMethod'
                        value='yoco'
                        checked
                        readOnly
                        className='h-4 w-4 text-fuchsia-600 focus:ring-fuchsia-500'
                      />
                      <label
                        htmlFor='yoco'
                        className='ml-2 block text-sm font-medium text-gray-700'
                      >
                        Pay with Yoco
                      </label>
                      <Image
                        src='/abstract-geometric-logo.png'
                        alt='Yoco'
                        width={60}
                        height={30}
                        className='ml-auto'
                      />
                    </div>
                    <p className='text-sm text-gray-500 mt-2'>
                      Secure payment processing by Yoco. Your card details are
                      never stored on our servers.
                    </p>
                  </div>
                </div>

                <button
                  type='submit'
                  disabled={
                    paymentStatus === 'processing' ||
                    !sdkLoaded ||
                    !selectedRate
                  }
                  className='w-full bg-fuchsia-600 text-white py-3 rounded-md font-medium hover:bg-fuchsia-700 transition-colors flex items-center justify-center disabled:opacity-70'
                >
                  {paymentStatus === 'processing' ? (
                    <>
                      <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2'></div>
                      Processing...
                    </>
                  ) : !sdkLoaded ? (
                    <>
                      <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2'></div>
                      Loading Payment Gateway...
                    </>
                  ) : !selectedRate ? (
                    <>
                      <AlertCircle className='mr-2 h-5 w-5' />
                      Please Select Shipping Option
                    </>
                  ) : (
                    <>
                      <CreditCard className='mr-2 h-5 w-5' />
                      Pay R{total.toFixed(2)}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className='lg:col-span-1'>
            <div className='bg-white rounded-lg shadow-sm p-6 sticky top-24'>
              <h2 className='text-xl font-medium mb-6'>Order Summary</h2>

              <div className='divide-y divide-gray-200'>
                {items.map((item) => (
                  <div key={item.product.id} className='py-4 flex items-start'>
                    <div className='flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden relative'>
                      <Image
                        src={item.product.image || '/placeholder.svg'}
                        alt={item.product.name}
                        fill
                        className='object-cover'
                      />
                    </div>
                    <div className='ml-4 flex-1'>
                      <h3 className='text-sm font-medium'>
                        {item.product.name}
                      </h3>
                      <p className='text-sm text-gray-500 mt-1'>
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className='text-sm font-medium'>
                      R{((item.product.price || 0) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className='mt-6 space-y-4'>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Subtotal</span>
                  <span>R{(subtotal || 0).toFixed(2)}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Shipping</span>
                  <span>R{shipping.toFixed(2)}</span>
                </div>
                <div className='border-t border-gray-200 pt-4 flex justify-between font-medium'>
                  <span>Total</span>
                  <span>R{(total || 0).toFixed(2)}</span>
                </div>
              </div>

              <div className='mt-6'>
                <div className='flex items-center'>
                  <Image
                    src='/secure-payment-badges.png'
                    alt='Secure Payment'
                    width={120}
                    height={20}
                  />
                  <span className='ml-2 text-xs text-gray-500'>
                    Secure Payment
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
