import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import emailjs from "@emailjs/browser";
import validator from "email-validator";
import { play } from "../lib/sound";

type Status = "idle" | "sent" | "invalid" | "error";
interface Values {
  name: string;
  email: string;
  message: string;
}
interface FormState {
  status: Status;
  /** Echoed back so the inputs keep what the visitor typed when the action does not succeed. */
  values: Values;
}

const EMPTY: Values = { name: "", email: "", message: "" };
const INITIAL: FormState = { status: "idle", values: EMPTY };
const SERVICE = import.meta.env.VITE_serviceId;
const TEMPLATE = import.meta.env.VITE_templateId;
const PUBLIC_KEY = import.meta.env.VITE_userId;

function read(fd: FormData, key: keyof Values): string {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}

// A React 19 form action: runs on submit, owns the pending state, never reloads the page.
async function send(_prev: FormState, fd: FormData): Promise<FormState> {
  const values: Values = { name: read(fd, "name"), email: read(fd, "email"), message: read(fd, "message") };
  if (!validator.validate(values.email)) {
    play("close");
    return { status: "invalid", values };
  }
  try {
    await emailjs.send(SERVICE, TEMPLATE, { ...values }, { publicKey: PUBLIC_KEY });
    play("chime");
    return { status: "sent", values: EMPTY };
  } catch (err) {
    console.error(err);
    return { status: "error", values };
  }
}

const NOTE: Record<Status, string> = {
  idle: "Goes straight to my inbox. No newsletter, no bots.",
  sent: "Delivered. I reply within a day.",
  invalid: "That email address does not look right.",
  error: "The message did not get through. Email me directly instead.",
};

export default function ContactForm() {
  const [{ status, values }, formAction] = useActionState<FormState, FormData>(send, INITIAL);
  const invalid = status === "invalid";

  return (
    <form className="contact" action={formAction} noValidate aria-labelledby="contact-title">
      <div className="contact__head">
        <span className="eyebrow">Guest services</span>
        <h3 id="contact-title" className="display contact__title">
          Say hello.
        </h3>
      </div>
      <div className="field">
        <input id="c-name" name="name" type="text" autoComplete="name" defaultValue={values.name} placeholder=" " required />
        <label htmlFor="c-name">Name</label>
      </div>
      <div className={"field" + (invalid ? " is-invalid" : "")}>
        <input id="c-email" name="email" type="email" autoComplete="email" defaultValue={values.email} placeholder=" " required aria-invalid={invalid} aria-describedby="contact-note" />
        <label htmlFor="c-email">Email</label>
      </div>
      <div className="field">
        <textarea id="c-message" name="message" rows={5} defaultValue={values.message} placeholder=" " required />
        <label htmlFor="c-message">Message</label>
      </div>
      <SendButton status={status} />
      <p id="contact-note" className="contact__note muted" aria-live="polite">
        {NOTE[status]}
      </p>
    </form>
  );
}

const LABEL: Record<Status, string> = { idle: "Send", sent: "Sent", invalid: "Check the email", error: "Try again" };

// useFormStatus reads the parent form's pending state without prop drilling.
function SendButton({ status }: { status: Status }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={"btn btn--primary contact__send" + (status === "invalid" || status === "error" ? " is-error" : "")} disabled={pending} aria-busy={pending}>
      {pending ? "Sending…" : LABEL[status]}
    </button>
  );
}
