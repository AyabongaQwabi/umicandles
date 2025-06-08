import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Mail, Phone, Facebook, Instagram } from 'lucide-react';

export const metadata = {
  title: 'Our Story | Umi Candles',
  description:
    'Learn about Umi Candles, our mission, values, and the story behind our handcrafted luxury candles.',
};

export default function AboutPage() {
  return (
    <main className='min-h-screen pt-24 pb-16'>
      {/* Hero Section */}
      <section className='relative h-[50vh] flex items-center overflow-hidden'>
        <div className='absolute inset-0 z-0'>
          <Image
            src='https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=1600&auto=format&fit=crop'
            alt='Umi Candles Workshop'
            fill
            className='object-cover'
          />
          <div className='absolute inset-0 bg-black/40' />
        </div>
        <div className='container relative z-10 mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='max-w-2xl text-white'>
            <h1 className='text-4xl md:text-5xl lg:text-6xl font-serif font-medium mb-4'>
              Our Story
            </h1>
            <p className='text-lg md:text-xl'>
              Crafting moments of serenity and celebration, one candle at a
              time.
            </p>
          </div>
        </div>
      </section>

      {/* About Umi Candles */}
      <section className='py-16 md:py-24'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
            <div>
              <h2 className='text-3xl md:text-4xl font-serif font-medium mb-6'>
                About Umi Candles
              </h2>
              <p className='text-gray-700 mb-4'>
                UMI CANDLES is a bespoke candle manufacturing company focused on
                making elegant candles for events and home décor. Our beautiful
                candles are handpoured in our candle studio by people and take
                time to make.
              </p>
              <p className='text-gray-700 mb-4'>
                Umi Candles is dedicated to providing you with the power to
                create the candle of your dreams effortlessly. We believe that
                personalization is the key to making our products more valuable
                and cherished by you and your loved ones.
              </p>
              <p className='text-gray-700 font-medium text-lg mt-6'>
                CANDLES ARE THE NEW FLOWERS
              </p>
              <p className='text-gray-700 mb-4'>
                With every handmade creation, we pour our heart and soul into
                crafting an experience that goes beyond the ordinary. We believe
                that the products you choose to surround yourself with should
                not only enhance your space but also evoke emotions and create
                lasting impressions.
              </p>
              <p className='text-gray-700'>
                You get to choose between a scented and an unscented candle.
              </p>
            </div>
            <div className='relative h-80 md:h-96 rounded-lg overflow-hidden'>
              <Image
                src='/umi-candles-letterboard.jpeg'
                alt="Umi Candles letterboard with 'I LOVE YOU' candles"
                fill
                className='object-cover'
              />
            </div>
          </div>
        </div>
      </section>

      {/* About the Owner */}
      <section className='py-16 md:py-24 bg-gray-50'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
            <div className='order-2 lg:order-1 relative h-80 md:h-96 rounded-lg overflow-hidden'>
              <Image
                src='/lungile-portrait.jpeg'
                alt='Lungile Ntuli - Founder of Umi Candles'
                fill
                className='object-cover'
              />
            </div>
            <div className='order-1 lg:order-2'>
              <h2 className='text-3xl md:text-4xl font-serif font-medium mb-6'>
                Meet Our Founder
              </h2>
              <h3 className='text-xl font-medium mb-4'>
                Lungile Ntuli – Founder
              </h3>
              <div className='bg-white p-6 rounded-lg shadow-sm mb-6'>
                <p className='text-gray-700 italic'>
                  "At UMI CANDLES, I pour my heart into crafting candles that
                  reflect your unique style and emotions. Each handmade creation
                  is a personal journey, creating an extraordinary experience
                  for you. Let's illuminate your space with candles that not
                  only enhance but also evoke cherished moments and lasting
                  impressions."
                </p>
              </div>
              <p className='text-gray-700 mb-4'>
                Lungile's passion for candle making began with a simple desire
                to create beautiful, meaningful pieces that bring warmth and
                light to people's lives. What started as a creative outlet has
                blossomed into Umi Candles, a brand dedicated to craftsmanship
                and quality.
              </p>
              <p className='text-gray-700'>
                With a background in design and a love for natural elements,
                Lungile ensures that every candle that leaves the Umi studio is
                a work of art, crafted with intention and care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Philosophy */}
      <section className='py-16 md:py-24'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl md:text-4xl font-serif font-medium mb-4'>
              Our Philosophy
            </h2>
            <p className='text-gray-700 max-w-3xl mx-auto'>
              We view candles as being an extension of your mood and home. We
              believe in making luxury, clean, eco-friendly, non-toxic candles
              that smell phenomenal!
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='bg-white p-6 rounded-lg shadow-md'>
              <div className='h-12 w-12 bg-fuchsia-100 rounded-full flex items-center justify-center mb-4'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6 text-fuchsia-600'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01'
                  />
                </svg>
              </div>
              <h3 className='text-xl font-medium mb-2'>Diverse Scents</h3>
              <p className='text-gray-700'>
                With a wide range of different scents carefully curated to suit
                diverse preferences, we offer a scent for every occasion and
                mood. Whether you seek the comforting embrace of vanilla, the
                invigorating notes of citrus, or the soothing aromas of
                lavender, our collection has something to delight every
                discerning nose.
              </p>
            </div>

            <div className='bg-white p-6 rounded-lg shadow-md'>
              <div className='h-12 w-12 bg-fuchsia-100 rounded-full flex items-center justify-center mb-4'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6 text-fuchsia-600'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              </div>
              <h3 className='text-xl font-medium mb-2'>Emotional Experience</h3>
              <p className='text-gray-700'>
                Each scent possesses its own distinct qualities, carefully
                chosen to evoke specific emotions and create a truly immersive
                experience. Whether it's the warm embrace of a cozy winter
                evening, the invigorating scent of a summer evening, or the
                nostalgic essence of freshly bloomed flowers, our candles
                encapsulate the essence of life's vibrant tapestry.
              </p>
            </div>

            <div className='bg-white p-6 rounded-lg shadow-md'>
              <div className='h-12 w-12 bg-fuchsia-100 rounded-full flex items-center justify-center mb-4'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6 text-fuchsia-600'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
                  />
                </svg>
              </div>
              <h3 className='text-xl font-medium mb-2'>
                Quality & Sustainability
              </h3>
              <p className='text-gray-700'>
                We create safe, high-quality products for you to enjoy at a
                reasonable price. Adding a touch of candlelight to your space
                just makes you feel so relaxed and at peace. Our commitment to
                eco-friendly and non-toxic materials ensures that you can enjoy
                our candles with peace of mind.
              </p>
            </div>
          </div>

          {/* <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="relative h-80 rounded-lg overflow-hidden">
              <Image
                src="/umi-candles-colorful.jpeg"
                alt="Colorful Umi Candles display"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative h-80 rounded-lg overflow-hidden">
              <Image src="/umi-candles-event.jpeg" alt="Umi Candles event setup" fill className="object-cover" />
            </div>
          </div> */}
        </div>
      </section>

      {/* Candle Renting */}
      <section className='py-16 md:py-24 bg-fuchsia-50'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 items-center'>
            <div className='bg-white p-8 rounded-lg shadow-md'>
              <h3 className='text-xl font-medium mb-4'>
                To enquire about our candle renting option:
              </h3>
              <p className='text-gray-700 mb-6'>
                Please email us at{' '}
                <a
                  href='mailto:hello@umicandles.com'
                  className='text-fuchsia-600 font-medium'
                >
                  hello@umicandles.com
                </a>
              </p>
              <Link
                href='/contact'
                className='bg-fuchsia-600 text-white hover:bg-fuchsia-700 px-6 py-3 rounded-full font-medium inline-flex items-center transition-all duration-300'
              >
                Contact Us
                <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </div>
            {/* <div className='relative h-80 rounded-lg overflow-hidden'>
              <Image
                src='/lungile-professional.jpeg'
                alt='Lungile Ntuli - Professional Event Planning'
                fill
                className='object-cover'
              />
            </div> */}
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className='py-16 md:py-24'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl md:text-4xl font-serif font-medium mb-4'>
              Get In Touch
            </h2>
            <p className='text-gray-700 max-w-2xl mx-auto'>
              We'd love to hear from you! Whether you have questions about our
              products, need assistance with an order, or want to discuss a
              custom creation, our team is here to help.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto'>
            <div className='bg-white p-6 rounded-lg shadow-md text-center'>
              <div className='h-12 w-12 bg-fuchsia-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Phone className='h-6 w-6 text-fuchsia-600' />
              </div>
              <h3 className='text-lg font-medium mb-2'>WhatsApp</h3>
              <p className='text-gray-700'>
                <a
                  href='https://wa.me/27828588051'
                  className='hover:text-fuchsia-600 transition-colors'
                >
                  +27 (0) 82 8588 051
                </a>
              </p>
            </div>

            <div className='bg-white p-6 rounded-lg shadow-md text-center'>
              <div className='h-12 w-12 bg-fuchsia-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Mail className='h-6 w-6 text-fuchsia-600' />
              </div>
              <h3 className='text-lg font-medium mb-2'>Email</h3>
              <p className='text-gray-700'>
                <a
                  href='mailto:hello@umicandles.com'
                  className='hover:text-fuchsia-600 transition-colors'
                >
                  hello@umicandles.com
                </a>
              </p>
            </div>

            <div className='bg-white p-6 rounded-lg shadow-md text-center'>
              <div className='h-12 w-12 bg-fuchsia-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Facebook className='h-6 w-6 text-fuchsia-600' />
              </div>
              <h3 className='text-lg font-medium mb-2'>Facebook</h3>
              <p className='text-gray-700'>
                <a
                  href='https://facebook.com/UmiCandles'
                  className='hover:text-fuchsia-600 transition-colors'
                >
                  Umi Candles
                </a>
              </p>
            </div>

            <div className='bg-white p-6 rounded-lg shadow-md text-center'>
              <div className='h-12 w-12 bg-fuchsia-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Instagram className='h-6 w-6 text-fuchsia-600' />
              </div>
              <h3 className='text-lg font-medium mb-2'>Instagram</h3>
              <p className='text-gray-700'>
                <a
                  href='https://instagram.com/UmiCandles'
                  className='hover:text-fuchsia-600 transition-colors'
                >
                  Umi Candles
                </a>
              </p>
            </div>
          </div>

          <div className='text-center mt-12'>
            <Link
              href='/contact'
              className='bg-fuchsia-600 text-white hover:bg-fuchsia-700 px-8 py-3 rounded-full font-medium inline-flex items-center transition-all duration-300'
            >
              Contact Us
              <ArrowRight className='ml-2 h-4 w-4' />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
