//@ts-nocheck
import React, { useCallback, useState } from "react";

function App() {
  const [num, setNum] = useState(0);
  const fn = useCallback(() => "haha" + num, [num]);
  return (
    <div onClick={() => setNum(num + 1)}>
      <h1>{fn()}</h1>
    </div>
  );
}

const hook = {
  memoizedState: "hook value",
  queue: {
    pending: "update queue",
  },
  next: null,
};

const update = {
  action,
  next: null, // 'link list point'
};
