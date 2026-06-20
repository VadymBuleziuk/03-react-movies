import { useState } from "react";
import css from "./App.module.css";
import CafeInfo from "./components/CafeInfo/CafeInfo";
import type VoteType from "./types/votes";
import VoteOptions from "./components/VoteOptions/VoteOptions";
import VoteStats from "./components/VoteStats/VoteStats";
import Notification from "./components/Notification/Notification";

function App() {
  const initialValues: VoteType = {
    good: 0,
    neutral: 0,
    bad: 0,
  };

  const [votes, setVotes] = useState(initialValues);

  const [canReset, setCanReset] = useState<boolean>(false);

  const handleVote = (type: keyof VoteType) => {
    setVotes({ ...votes, [type]: votes[type] + 1 });
    setCanReset(true);
  };
  const resetVotes = () => {
    setVotes(initialValues);
    setCanReset(false);
  };
  const totalVotes: number = votes.good + votes.neutral + votes.bad;
  const positiveRate: number = totalVotes
    ? Math.round((votes.good / totalVotes) * 100)
    : 0;

  return (
    <div className={css.app}>
      <CafeInfo />
      <VoteOptions onVote={handleVote} reset={resetVotes} canReset={canReset} />
      {totalVotes ? (
        <VoteStats
          votes={votes}
          totalVotes={totalVotes}
          positiveRate={positiveRate}
        />
      ) : (
        <Notification />
      )}
    </div>
  );
}

export default App;
