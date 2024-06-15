import * as React from 'react'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { cn } from '@/lib/utils'
import { siteConfig } from '@/config/site'

export default function TermsPage() {
  return (
    <div>
      <Header />
      <main
        className={cn(
          'min-h-[80vh] pb-40',
          siteConfig?.fixedHeader ? 'pt-[61px]' : ''
        )}
      >
        <div className="container pt-16">
          <h1 className="mb-16 text-center font-serif text-6xl font-bold leading-tight tracking-tighter md:text-7xl md:leading-none lg:text-8xl">
            Terms & Conditions
          </h1>
          <div className="mb-16">
            Aliquam interdum venenatis lobortis. In suscipit vestibulum ligula,
            vel feugiat lacus ultrices vel. Praesent hendrerit, nunc in pretium
            rhoncus, ex mauris interdum lorem, et ultrices lorem lectus eget
            lorem. Curabitur ultricies ligula lacus, at ultrices justo iaculis
            in. Duis placerat fermentum quam quis vulputate. Quisque ornare
            euismod viverra. Curabitur in augue cursus, sollicitudin enim sit
            amet, feugiat felis. Ut nec lectus lacinia, placerat leo et,
            convallis odio. Suspendisse potenti.
            <br />
            <br />
            <h2>Cras interdum odio id porta scelerisque</h2>
            Ut ultrices commodo enim, eget mollis velit ullamcorper ut. Proin eu
            tempor quam. Curabitur ornare suscipit urna, a condimentum sapien
            iaculis vel. Aenean convallis, mauris et sollicitudin pharetra, ante
            orci fringilla nulla, nec blandit odio metus et sapien. Donec
            iaculis nisl sit amet tortor pulvinar egestas. Nulla fringilla eget
            nisl vitae gravida. Phasellus ipsum leo, dapibus at lectus non,
            efficitur sagittis enim. Donec nec urna rhoncus, mollis sem eget,
            placerat massa. Quisque vestibulum iaculis ante, vitae faucibus est
            pellentesque in.
            <br />
            <br />
            <h2>Cras euismod erat id pretium condimentum</h2>
            Fusce vitae sapien gravida, luctus orci in, pellentesque magna. Cras
            venenatis arcu nec felis ornare, sit amet lobortis mauris vulputate.
            Sed vitae rutrum erat. Nulla facilisi. Ut blandit tristique neque,
            varius mattis arcu gravida nec. Nunc ac egestas turpis, nec lacinia
            nulla. Ut dolor nisi, fringilla lobortis nisl ut, aliquam commodo
            nulla. Vestibulum ante ipsum primis in faucibus orci luctus et
            ultrices posuere cubilia curae; Nullam eget feugiat metus. Quisque
            posuere sit amet velit quis mattis. Donec nec luctus turpis. Donec
            ornare quam eu neque tempor imperdiet. Mauris elementum nisi ut dui
            laoreet maximus.
            <br />
            <br />
            <h2>
              Quisque ut ipsum tempor, condimentum eros quis, vehicula purus
            </h2>
            Etiam mi dolor, maximus eget sodales a, sollicitudin eu nibh. Cras
            sit amet pharetra ligula. Maecenas porta euismod ex et ultrices.
            Aliquam in augue gravida, rutrum mauris vel, elementum tellus.
            Vestibulum quis nunc leo. Orci varius natoque penatibus et magnis
            dis parturient montes, nascetur ridiculus mus. Nulla id dictum nisi.
            Curabitur malesuada, arcu ac vulputate tempor, elit augue tempus
            dolor, ut dapibus enim risus sit amet massa. Nunc finibus facilisis
            leo id placerat. Curabitur interdum orci quis ullamcorper pulvinar.
            Sed viverra imperdiet metus a lacinia. Mauris egestas ante sit amet
            maximus commodo. Proin tempor, odio nec feugiat tristique, risus
            ante fringilla nisl, et aliquam nunc justo sit amet ipsum. Ut in
            malesuada felis.
            <br />
            <br />
            <h2>Maecenas at augue dictum, pretium tellus ac, tincidunt ex</h2>
            Quisque ante leo, faucibus vitae mauris sit amet, volutpat
            sollicitudin neque. Donec vel odio posuere, sodales nulla sed,
            laoreet lectus. Integer convallis lectus est, et laoreet velit
            suscipit quis. Nulla sapien ante, pharetra in tellus non, pharetra
            eleifend ipsum. Suspendisse sit amet ullamcorper lacus, sit amet
            mattis nibh. Nulla facilisi. Aliquam vehicula orci risus, a cursus
            enim placerat quis.
            <br />
            <br />
            <h2>Duis volutpat sem in consectetur malesuada.</h2>
            Aenean sagittis pretium consequat. Aenean metus augue, tincidunt
            iaculis dolor at, consectetur efficitur massa. Duis diam libero,
            dignissim vitae tristique nec, rhoncus at dui. Vestibulum non nunc
            massa. Sed pretium dolor id tellus congue, ac ornare libero mollis.
            Vivamus interdum ipsum et urna porttitor efficitur. Quisque placerat
            nisl non sem sollicitudin feugiat sit amet sed dolor. Mauris
            placerat mi non risus varius, in interdum ante gravida. Nunc in
            egestas neque. Praesent quis urna porttitor, rhoncus est ut, feugiat
            orci. Vivamus sed placerat dui. Aenean non efficitur quam, sit amet
            commodo nisl. Ut nec risus elit.
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
