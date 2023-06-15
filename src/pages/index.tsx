import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

/**
  Calculates the time difference between the server time and client time.
  @param {Date} serverTime - The server time.
  @param {Date} clientTime - The client time.
  @returns {string} The time difference in the format "{days} days, {hours} hours, {minutes} minutes, {seconds} seconds".
*/

const TimeDifference = (server: Date, client: Date) => {
  const timeDifference = server.getTime() - client.getTime();

  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

  return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
};


export default function Home() {
  const router = useRouter();
  const [timeServer,setTimeServer] = useState<Date>(new Date);
  const [navTime,setNavTime] = useState<Date>();
  const [timeDifference, setTimeDifference] = useState("");

  useEffect(() => {
    const fetchServerTime = async () => {
      try {
        const response = await fetch("/api/server-time");
        const data = await response.json();
        const { serverTime } = data;
        setTimeServer(new Date(serverTime));
      } catch (error) {
        console.error("Error fetching server time:", error);
      }
    };

    setNavTime(new Date());

    fetchServerTime();
  }, []);
  
  useEffect(() => {
    if (timeServer && navTime) {
      const difference = TimeDifference(timeServer, navTime);
      setTimeDifference(difference);
    }
  }, [timeServer, navTime]);

  const moveToTaskManager = () => {
    router.push("/tasks");
  }
  return (
    <>
      <Head>
        <title>Web 2 - Exam TD</title>
        <meta name="description" content="Just an exam" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>The easiest exam you will ever find</h1>
        <div>
          {/*server time (DD-MM-AAAA HH:mm)*/}
          <p>
            Server time:{" "}
            <span className="serverTime">{timeServer ? timeServer.toLocaleString("fr-FR") : ""}</span>
          </p>

          {/*time difference between the server side and the client side */}
          <p>
            Time diff:{" "}
            <span className="serverTime">{timeDifference ? timeDifference:"-"}</span>
          </p>
        </div>

        <div>
          <button onClick={moveToTaskManager}>Go to task manager</button>
        </div>
      </main>
    </>
  );
}
