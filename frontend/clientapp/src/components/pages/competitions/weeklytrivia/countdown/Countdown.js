import React, { useEffect, useState } from "react";
import "./countdown.css";

function Countdown() {
  const [quizTime, setQuizTime] = useState(false);
  const [days, setdays] = useState();
  const [houers, sethouers] = useState();
  const [minutes, setminutes] = useState();
  const [seconds, setseconds] = useState();
  let index = 0;

  const datoListe = [
     new Date("03/07/2022 18:28:00"),
     new Date("03/07/2022 18:28:05"),
     new Date("03/07/2022 18:28:10")
  ];

  useEffect(() => {
    let targetTime = new Date("03/07/2022 18:27:50");
    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetTime.getTime() - now.getTime();

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      setdays(d);

      const h = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      sethouers(h);

      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      setminutes(m);

      const s = Math.floor((difference % (1000 * 60)) / 1000);
      setseconds(s);

      if (d <= 0 && h <= 0 && m <= 0 && s <= 0) {
        //setQuizTime(true);
        targetTime = datoListe[index];
        index++;
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  return (
    <div>
      {quizTime ? (
        <h1>Ny quiz</h1>
      ) : (
        <div className="Clock">
          <div className="Clock-inner">
            <div className="Clock-display">
              <div className="time">{days}Days</div>
            </div>
            <div className="Clock-display">
              <div className="time">{houers}Houers</div>
            </div>
            <div className="Clock-display">
              <div className="time">{minutes}Minutes</div>
            </div>
            <div className="Clock-display">
              <div className="time">{seconds}Seconds</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Countdown;
