import { useState, type FormEvent } from "react";

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 40 40" fill="none">
        <rect width="40" height="40" rx="13" fill="currentColor" />
        <path
          d="M20 10.5v19M10.5 20h19"
          stroke="white"
          strokeLinecap="round"
          strokeWidth="3.5"
        />
        <circle cx="20" cy="20" r="2.2" fill="white" />
      </svg>
    </span>
  );
}

function EyeIcon({ visible }: { visible: boolean }) {
  return visible ? (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 3l18 18M10.6 10.7a2 2 0 002.7 2.7M9.9 5.2A10.7 10.7 0 0112 5c5.2 0 8.5 4.6 9.5 6.3a1.3 1.3 0 010 1.4 15 15 0 01-3.1 3.6M6.2 6.3a15.7 15.7 0 00-3.7 5 1.3 1.3 0 000 1.4C3.5 14.4 6.8 19 12 19c.8 0 1.6-.1 2.3-.3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M2.5 12s3.4-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.4 6.5-9.5 6.5S2.5 12 2.5 12z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <circle cx="12" cy="12" r="2.7" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function LoginPage() {
  const [passwordVisible, setPasswordVisible] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <main className="login-page">
      <section className="welcome-panel" aria-label="About MediTrack">
        <div className="welcome-content">
          <a className="brand" href="/" aria-label="MediTrack home">
            <BrandMark />
            <span>MediTrack</span>
          </a>

          <div className="welcome-copy">
            <span className="eyebrow">
              <span className="eyebrow-dot" />
              CLINIC CARE, CONNECTED
            </span>
            <h1>
              More time for
              <br />
              <span>what matters.</span>
            </h1>
            <p>
              A calmer way to manage your clinic, so your team can focus on
              the people behind every patient record.
            </p>
          </div>

          <div className="care-card" aria-hidden="true">
            <div className="care-card-top">
              <span className="care-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 12h4l2.2-6 4.1 12 2.2-6H21"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                  />
                </svg>
              </span>
              <span className="care-card-label">YOUR CLINIC, IN SYNC</span>
              <span className="online-indicator" />
            </div>
            <div className="care-card-title">Care that keeps moving</div>
            <div className="care-card-caption">
              <span className="avatar-stack">
                <span>DR</span>
                <span>AM</span>
                <span>+</span>
              </span>
              <span>One team. One clear picture.</span>
            </div>
            <div className="care-wave">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
        <div className="welcome-footer">
          <span>Thoughtful tools for better care.</span>
          <span>MADE FOR YOUR CARE TEAM</span>
        </div>
        <span className="decorative-orbit orbit-one" aria-hidden="true" />
        <span className="decorative-orbit orbit-two" aria-hidden="true" />
      </section>

      <section className="form-panel" aria-labelledby="login-heading">
        <div className="mobile-brand">
          <BrandMark />
          <span>MediTrack</span>
        </div>
        <div className="login-form-wrap">
          <div className="form-heading">
            <span className="form-kicker">WELCOME BACK</span>
            <h2 id="login-heading">Sign in to your account</h2>
            <p>Enter your work email and password to continue.</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <label className="field-label" htmlFor="email">
              Work email
            </label>
            <div className="input-wrap">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect
                  x="3.5"
                  y="5"
                  width="17"
                  height="14"
                  rx="2.5"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />
                <path
                  d="m5 7 7 5.5L19 7"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.7"
                />
              </svg>
              <input
                autoComplete="username"
                id="email"
                name="email"
                placeholder="you@yourclinic.com"
                required
                type="email"
              />
            </div>

            <div className="password-label-row">
              <label className="field-label" htmlFor="password">
                Password
              </label>
              <button className="text-button" type="button">
                Forgot password?
              </button>
            </div>
            <div className="input-wrap">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect
                  x="4.5"
                  y="10"
                  width="15"
                  height="10"
                  rx="2.5"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />
                <path
                  d="M8 10V7.5a4 4 0 118 0V10m-4 4v2"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="1.7"
                />
              </svg>
              <input
                autoComplete="current-password"
                id="password"
                name="password"
                placeholder="Enter your password"
                required
                type={passwordVisible ? "text" : "password"}
              />
              <button
                aria-label={passwordVisible ? "Hide password" : "Show password"}
                aria-pressed={passwordVisible}
                className="password-toggle"
                onClick={() => setPasswordVisible((visible) => !visible)}
                type="button"
              >
                <EyeIcon visible={passwordVisible} />
              </button>
            </div>

            <label className="remember-option">
              <input name="remember" type="checkbox" />
              <span className="custom-checkbox" aria-hidden="true">
                <svg viewBox="0 0 16 16" fill="none">
                  <path
                    d="m3.5 8 3 3 6-6"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </span>
              <span>Keep me signed in</span>
            </label>

            <button className="sign-in-button" type="submit">
              <span>Sign in</span>
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path
                  d="M4 10h12m-5-5 5 5-5 5"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                />
              </svg>
            </button>
          </form>

          <div className="secure-note">
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="M10 2.5 4 5v4.3c0 3.7 2.6 6.8 6 8.2 3.4-1.4 6-4.5 6-8.2V5l-6-2.5z"
                stroke="currentColor"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
              <path
                d="m7.5 9.8 1.7 1.7 3.5-3.7"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </svg>
            <span>Use your clinic account to access your workspace.</span>
          </div>
        </div>
        <footer className="form-footer">
          <span>© {new Date().getFullYear()} MediTrack</span>
          <span className="footer-separator">·</span>
          <span>Built for better care</span>
        </footer>
      </section>
    </main>
  );
}

export default LoginPage;
