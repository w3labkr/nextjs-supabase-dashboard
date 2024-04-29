import * as React from 'react'

import { Header } from '@/components/header'
import { Hero } from '@/components/hero'
import { Footer } from '@/components/footer'

export default function RootPage() {
  return (
    <div>
      <Header />
      <main className="min-h-[80vh] pb-40">
        <Hero />
        <div className="container">
          <div className="columns-2 gap-4 space-y-4 md:columns-3 lg:columns-4">
            <img
              className="rounded-md"
              src="https://images.unsplash.com/photo-1549388604-817d15aa0110?w=320&fit=crop&auto=format"
              alt=""
            />
            <img
              className="rounded-md"
              src="https://images.unsplash.com/photo-1563298723-dcfebaa392e3?w=320&fit=crop&auto=format"
              alt=""
            />
            <img
              className="rounded-md"
              src="https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?w=320&fit=crop&auto=format"
              alt=""
            />
            <img
              className="rounded-md"
              src="https://images.unsplash.com/photo-1525097487452-6278ff080c31?w=320&fit=crop&auto=format"
              alt=""
            />
            <img
              className="rounded-md"
              src="https://images.unsplash.com/photo-1574180045827-681f8a1a9622?w=320&fit=crop&auto=format"
              alt=""
            />
            <img
              className="rounded-md"
              src="https://images.unsplash.com/photo-1597262975002-c5c3b14bbd62?w=320&fit=crop&auto=format"
              alt=""
            />
            <img
              className="rounded-md"
              src="https://images.unsplash.com/photo-1530731141654-5993c3016c77?w=320&fit=crop&auto=format"
              alt=""
            />
            <img
              className="rounded-md"
              src="https://images.unsplash.com/photo-1481277542470-605612bd2d61?w=320&fit=crop&auto=format"
              alt=""
            />
            <img
              className="rounded-md"
              src="https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=320&fit=crop&auto=format"
              alt=""
            />
            <img
              className="rounded-md"
              src="https://images.unsplash.com/photo-1516455207990-7a41ce80f7ee?w=320&fit=crop&auto=format"
              alt=""
            />
            <img
              className="rounded-md"
              src="https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=320&fit=crop&auto=format"
              alt=""
            />
            <img
              className="rounded-md"
              src="https://images.unsplash.com/photo-1588436706487-9d55d73a39e3?w=320&fit=crop&auto=format"
              alt=""
            />
            <img
              className="rounded-md"
              src="https://source.unsplash.com/ZBquC1f8SJ0?w=320&fit=crop&auto=format"
              alt=""
            />
            <img
              className="rounded-md"
              src="https://source.unsplash.com/8n7ipHhI8CI?w=320&fit=crop&auto=format"
              alt=""
            />
            <img
              className="rounded-md"
              src="https://source.unsplash.com/iEEBWgY_6lA?w=320&fit=crop&auto=format"
              alt=""
            />
            <img
              className="rounded-md"
              src="https://source.unsplash.com/xOBpdqH2Uao?w=320&fit=crop&auto=format"
              alt=""
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
