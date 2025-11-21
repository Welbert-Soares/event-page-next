import { cacheLife } from "next/cache";

import { EventCard } from "@/components/EventCard";
import { ExploreBtn } from "@/components/ExploreBtn";

import { IEvent } from "@/database";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const Home = async () => {
  "use cache";
  cacheLife("hours");
  const response = await fetch(`${BASE_URL}/api/events`);
  const { events } = await response.json();

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
          {events &&
            events.length > 0 &&
            events.map((event: IEvent) => (
              <li key={event.title}>
                <EventCard {...event} />
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
};

export default Home;
