import { useEffect, useState } from "react";
//import "./CountdownTimer.css";

export default function Timer() {
  const [dager, setDager] = useState(0);
  const [timer, setTimer] = useState(0);
  const [minutter, setMinutter] = useState(0);
  const [sekunder, setSekunder] = useState(0);

  function nextFriday() {
    const toDay = new Date();
    var friday = new Date(
      toDay.getFullYear(),
      toDay.getMonth(),
      toDay.getDate() + ((7 + 5 - toDay.getDay()) % 7),
      "00",
      "00"
    );

    if (friday < toDay) friday.setDate(friday.getDate() + 7);

    return friday;
  }

  const target = nextFriday();
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const difference = target.getTime() - now.getTime();

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      setDager(d);
      const h = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      setTimer(h);
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      setMinutter(m);
      const s = Math.floor((difference % (1000 * 60)) / 1000);
      setSekunder(s);
    }, 1000);
  }, [dager]);

  return (
    <div className="countdown-cnt">
      <div className="Klokke">
        <div className="Klokke-inner">
          <div className="Klokke-display">
            <div className="tid">
              {dager > 0 ? (
                <div>
                  {dager} dag(er) - {timer}:{minutter}:{sekunder}
                </div>
              ) : (
                <div>
                  {timer}:{minutter}:{sekunder}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
