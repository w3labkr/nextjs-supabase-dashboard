import * as React from 'react'

import { Header } from '@/components/header'
import { Hero } from '@/components/hero'
import { Footer } from '@/components/footer'

import { absoluteUrl } from '@/lib/utils'

export default function RootPage() {
  return (
    <div>
      <Header />
      <main className="min-h-[80vh] pb-20 sm:pb-40">
        <Hero />
        <div className="container">
          <div className="columns-2 gap-4 space-y-4 md:columns-3 lg:columns-4">
            <img
              className="rounded-md"
              src={absoluteUrl(
                '/assets/images/main/photo-1549388604-817d15aa0110.jpg'
              )}
              alt=""
            />
            <img
              className="rounded-md"
              src={absoluteUrl(
                '/assets/images/main/photo-1563298723-dcfebaa392e3.jpg'
              )}
              alt=""
            />
            <img
              className="rounded-md"
              src={absoluteUrl(
                '/assets/images/main/photo-1523413651479-597eb2da0ad6.jpg'
              )}
              alt=""
            />
            <img
              className="rounded-md"
              src={absoluteUrl(
                '/assets/images/main/photo-1525097487452-6278ff080c31.jpg'
              )}
              alt=""
            />
            <img
              className="rounded-md"
              src={absoluteUrl(
                '/assets/images/main/photo-1574180045827-681f8a1a9622.jpg'
              )}
              alt=""
            />
            <img
              className="rounded-md"
              src={absoluteUrl(
                '/assets/images/main/photo-1597262975002-c5c3b14bbd62.jpg'
              )}
              alt=""
            />
            <img
              className="rounded-md"
              src={absoluteUrl(
                '/assets/images/main/photo-1530731141654-5993c3016c77.jpg'
              )}
              alt=""
            />
            <img
              className="rounded-md"
              src={absoluteUrl(
                '/assets/images/main/photo-1481277542470-605612bd2d61.jpg'
              )}
              alt=""
            />
            <img
              className="rounded-md"
              src={absoluteUrl(
                '/assets/images/main/photo-1517487881594-2787fef5ebf7.jpg'
              )}
              alt=""
            />
            <img
              className="rounded-md"
              src={absoluteUrl(
                '/assets/images/main/photo-1516455207990-7a41ce80f7ee.jpg'
              )}
              alt=""
            />
            <img
              className="rounded-md"
              src={absoluteUrl(
                '/assets/images/main/photo-1519710164239-da123dc03ef4.jpg'
              )}
              alt=""
            />
            <img
              className="rounded-md"
              src={absoluteUrl(
                '/assets/images/main/photo-1588436706487-9d55d73a39e3.jpg'
              )}
              alt=""
            />
            <img
              className="rounded-md"
              src={absoluteUrl('https://source.unsplash.com/ZBquC1f8SJ0')}
              alt=""
            />
            <img
              className="rounded-md"
              src={absoluteUrl('https://source.unsplash.com/8n7ipHhI8CI')}
              alt=""
            />
            <img
              className="rounded-md"
              src={absoluteUrl('https://source.unsplash.com/iEEBWgY_6lA')}
              alt=""
            />
            <img
              className="rounded-md"
              src={absoluteUrl('https://source.unsplash.com/xOBpdqH2Uao')}
              alt=""
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
