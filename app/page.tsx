import { EventCard } from '@/components/EventCard'
import { ExploreBtn } from '@/components/ExploreBtn'

import events from '@/lib/constants'

const Home = () => {
  return (
    <section>
      <h1 className="text-center">
        O Hub de Desenvolvedores <br />
        Você não pode perder
      </h1>
      <p className="text-center mt-5">
        Hackathons, Meetups e Conferências, Tudo em um só lugar.
      </p>

      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h3>Eventos de destaque</h3>

        <ul className="events">
          {events.map((event) => (
            <li key={event.title}>
              <EventCard {...event} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Home
