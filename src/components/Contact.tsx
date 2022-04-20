import { Component, createMemo, createSignal } from 'solid-js';

import LoadingEllipsis from './LoadingEllipsis';
import { contactNoah } from '../api';

const FormItem: Component = (props) => {
  return (
    <li class="flex flex-col p-0 m-0">
      {props.children}
    </li>
  );
};

const Contact: Component = () => {
  const [isLoading, setIsLoading] = createSignal(false);
  const [isComplete, setIsComplete] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const isDisabled = createMemo(() => isLoading() || (isComplete() && !error()));
  const buttonMessage = createMemo(() => {
    if (isLoading()) return <Loading />;
    if (isComplete() && !error()) return 'Thanks!';
    return 'Submit';
  });

  const onsubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    const data = new FormData(e.target as HTMLFormElement);
    setIsLoading(true);
    return contactNoah(data)
      .then((res) => setError(res.ok ? null : `${res.status}: ${res.statusText}`))
      .catch((err) => setError(err))
      .finally(() => {
        setIsLoading(false);
        setIsComplete(true);
      });
  };

  const Loading: Component = () => {
    return (
      <div class="absolute scale-[.6] top-[-1.5rem] left-[1rem]" >
        <LoadingEllipsis />
      </div>
    );
  };

  return (
    <form name="contact" onsubmit={onsubmit}>
      <ul class={'flex flex-col gap-3 p-0 ' + (isDisabled() ? 'opacity-30' : '')}>
        <FormItem>
          <label for="name" class="text-sm font-light">Your name</label>
          <input id="name" type="text" autocomplete="name" name="name" maxlength="256" required disabled={isDisabled()} placeholder="Alex Smith"
            class="form-input bg-transparent border-0 border-b-2 border-stone-300 border-opacity-30
                   placeholder:text-stone-300 placeholder:text-opacity-30
                   focus:border-stone-300 focus:ring-0" />
        </FormItem>

        <FormItem>
          <label for="email" class="text-sm font-light">Your email</label>
          <input id="email" type="email" autocomplete="email" name="email" maxlength="256" required disabled={isDisabled()} placeholder="asmith@example.com"
            class="form-input bg-transparent border-0 border-b-2 border-stone-300 border-opacity-30
                   placeholder:text-stone-300 placeholder:text-opacity-30
                   focus:border-stone-300 focus:ring-0" />
        </FormItem>

        <FormItem>
          <label for="message" class="text-sm font-light">Your message</label>
          <textarea id="message" autocomplete="off" name="message" maxlength="5000" required disabled={isDisabled()} placeholder="Hello!"
            class="form-textarea min-h-[5rem] bg-transparent border-0 border-b-2 border-stone-300 border-opacity-30
                   placeholder:text-stone-300 placeholder:text-opacity-30
                   focus:border-stone-300 focus:ring-0" />
        </FormItem>
      </ul>

      <div class="relative">
        <button type="submit" disabled={isDisabled()}
          class="relative w-28 h-9 rounded-md mt-3 font-semibold
               text-stone-300 dark:text-stone-800 bg-slate-700 dark:bg-orange-200">
          {buttonMessage()}
        </button>
        <p class="absolute top-[-.3rem] left-[8rem] max-w-[30.5rem] overflow-hidden overflow-ellipsis whitespace-nowrap text-red-400">{error() || ''}</p>
      </div>
    </form>
  );
};

export default Contact;
