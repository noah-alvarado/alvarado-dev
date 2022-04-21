import { Component, createMemo, createSignal } from 'solid-js';

const Toggle: Component = () => {
  const [on, setOn] = createSignal(false);
  const colors = createMemo(() => ({
    bg: on() ? 'bg-blue-900' : 'bg-sky-400',
  }));

  return (
    <label class={`w-14 h-6 rounded-full ${colors().bg}`}>
      <input type="checkbox" class="" checked={on()} onchange={(e: any) => setOn(e.target.checked)} />
    </label>
  );
};

export default Toggle;
