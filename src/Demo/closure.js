function func1() {
  const a = 2;
  return () => {
    return 1;
  };
}

const func2 = func1();

func2();
