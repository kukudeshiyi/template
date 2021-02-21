//@ts-nocheck
let workInProgressHook; // 当前hook指针
let isMount = true;

const fiber = {
  stateNode: App,
  memoizedState: null,
};

function useState(initialState) {
  let hook;
  if (isMount) {
    hook = {
      memoizedState: initialState,
      queue: {
        pending: null,
      },
      next: null,
    };
    if (fiber.memoizedState) {
      workInProgressHook.next = hook;
    } else {
      fiber.memoizedState = hook;
    }
    workInProgressHook = hook; // 指针指向当前hook
  } else {
    hook = workInProgressHook;
    workInProgressHook = workInProgressHook.next;
  }

  //  调用更新函数来计算新的状态
  let baseState = hook.memoizedState;
  if (hook.queue.pending) {
    let firstUpdate = hook.queue.pending.next; // 拿到第一个update
    do {
      const action = firstUpdate.action;
      baseState = action(baseState);
      firstUpdate = firstUpdate.next;
    } while (firstUpdate !== hook.queue.pending); // ??????
    hook.queue.pending = null;
  }
  hook.memoizedState = baseState;

  return [baseState, dispatchAction.bind(null, hook.queue)]; // curry
}

// 拼接update链表
function dispatchAction(queue, action) {
  const update = {
    action,
    next: null,
  };
  if (queue.pending) {
    // 剪开拼接
    update.next = queue.pending.next;
    queue.pending.next = update;
  } else {
    update.next = update;
  }
  queue.pending = update;

  schedule();
}

function schedule() {
  workInProgressHook = fiber.memoizedState; // 每次调度指向第一个hook
  const app = fiber.stateNode();
  isMount = false;
  return app;
}

function App() {
  const [num, updateNum] = useState(0);
  const [num1, updateNum1] = useState(10);

  console.log("num", num);
  console.log("num1", num1);

  return {
    onClick: () => updateNum(() => num + 1),
    onFocus: () => updateNum1(() => num1 + 1),
  };
}

window.app = schedule();
