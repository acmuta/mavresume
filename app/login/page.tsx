"use client";

import { useState, FormEvent, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Loader2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Target,
  FileText,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Award,
  CheckCircle,
  ScanSearch,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithEmail, signUpWithEmail, signInWithGoogle } from "@/lib/auth";

const resumeTips = [
  {
    icon: Target,
    title: "Start with Impact",
    description:
      "Begin each bullet point with a strong action verb. Use words like 'Led', 'Developed', 'Implemented' to show initiative.",
  },
  {
    icon: FileText,
    title: "Quantify Your Results",
    description:
      "Include numbers, percentages, or metrics whenever possible. 'Increased efficiency by 35%' is more powerful than 'improved efficiency'.",
  },
  {
    icon: Sparkles,
    title: "Highlight Technical Skills",
    description:
      "List relevant technologies from your coursework and projects. Our builder auto-suggests skills based on your UTA courses.",
  },
  {
    icon: TrendingUp,
    title: "Show Growth",
    description:
      "Demonstrate progression in your roles. Start with foundational tasks and build to leadership or impact-driven achievements.",
  },
  {
    icon: Award,
    title: "Focus on Achievements",
    description:
      "Emphasize what you accomplished, not just what you did. Use metrics, outcomes, and results to stand out to recruiters.",
  },
];

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shouldReduceMotion = useReducedMotion();
  const authError = searchParams.get("error");
  const redirectTo =
    searchParams.get("redirect") || searchParams.get("next") || "/dashboard";

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isTipAutoRotate, setIsTipAutoRotate] = useState(true);

  const currentTip = resumeTips[currentTipIndex];

  const unlockItems = [
    {
      icon: Bot,
      title: "AI bullet refinement",
      description:
        "Rewrite rough bullet points into tighter, outcome-focused lines.",
    },
    {
      icon: ScanSearch,
      title: "Review-ready workflow",
      description:
        "Submit your finished PDF and keep feedback tied to the same document.",
    },
    {
      icon: CheckCircle2,
      title: "Guided resume structure",
      description:
        "Build section-by-section with prompts tuned for UTA student resumes.",
    },
  ] as const;

  // Rotate resume tips every 5.5 seconds
  useEffect(() => {
    if (!isTipAutoRotate) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % resumeTips.length);
    }, 5500);

    return () => clearInterval(interval);
  }, [isTipAutoRotate]);

  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  // Validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError(null);
    return true;
  };

  const validatePassword = (password: string): boolean => {
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }
    setPasswordError(null);
    return true;
  };

  const validateConfirmPassword = (confirmPassword: string): boolean => {
    if (mode === "signup" && confirmPassword !== password) {
      setConfirmPasswordError("Passwords do not match");
      return false;
    }
    setConfirmPasswordError(null);
    return true;
  };

  const handleEmailPasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setEmailError(null);
    setPasswordError(null);
    setConfirmPasswordError(null);

    // Client-side validation
    if (!email || !password) {
      setError("Please fill in all required fields");
      return;
    }

    if (!validateEmail(email)) {
      return;
    }

    if (!validatePassword(password)) {
      return;
    }

    if (mode === "signup") {
      if (!confirmPassword) {
        setError("Please confirm your password");
        return;
      }
      if (!validateConfirmPassword(confirmPassword)) {
        return;
      }
    }

    setIsLoading(true);

    try {
      if (mode === "login") {
        const result = await signInWithEmail(email, password);
        if (result.error) {
          setError(result.error);
        } else {
          // Success - redirect to dashboard or original destination
          router.push(redirectTo);
          router.refresh();
        }
      } else {
        // Sign-up mode
        const result = await signUpWithEmail(email, password);
        if (result.error) {
          setError(result.error);
          console.error(result.error);
        } else if (result.data?.user) {
          // Only show success if user was actually created with valid identity
          if (
            result.data.user.identities &&
            result.data.user.identities.length > 0
          ) {
            // Successful signup with email confirmation pending
            setSuccessMessage(
              "Account created successfully! Please verify your email before logging in.",
            );
            // Clear password fields but keep email for convenience
            setPassword("");
            setConfirmPassword("");
            // Switch to login mode after a brief delay
            setTimeout(() => {
              setMode("login");
              setSuccessMessage(null);
            }, 3000);
          } else {
            // User object exists but no identities = duplicate OAuth account
            setError(
              "An account with this email already exists. Please sign in or use 'Continue with Google' if you registered with Google.",
            );
          }
        }
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const redirectUrl = `${
        window.location.origin
      }/auth/callback?redirect=${encodeURIComponent(redirectTo)}`;
      const result = await signInWithGoogle(redirectUrl);

      if (result.error) {
        setError(result.error);
        setIsLoading(false);
      }
      // If successful, the OAuth flow will redirect automatically
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#101113] text-white">
      <BackgroundAtmosphere />

      <section className="relative px-4 pb-8 pt-5 sm:px-6 sm:pt-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <Link
                href="/"
                className="font-bold tracking-tight text-3xl sm:text-4xl [mask-image:linear-gradient(to_bottom,black_40%,transparent)] [mask-repeat:no-repeat] [mask-size:100%_100%]"
              >
                MAV<span className="font-extralight">RESUME</span>
              </Link>
              <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-[#6d7895] sm:text-xs">
                Account access
              </p>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="group/nav rounded-full border-transparent bg-transparent px-4 text-sm font-semibold uppercase tracking-[0.28em] text-[#cfd3e1] hover:bg-transparent hover:text-white"
              >
                <Link href="/features">
                  <span className="relative inline-block after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-[#89a5ff] after:transition-transform after:duration-300 group-hover/nav:after:scale-x-100">
                    Features
                  </span>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="group/nav rounded-full border-transparent bg-transparent px-4 text-sm font-semibold uppercase tracking-[0.28em] text-[#cfd3e1] hover:bg-transparent hover:text-white"
              >
                <Link href="/faqs">
                  <span className="relative inline-block after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-[#89a5ff] after:transition-transform after:duration-300 group-hover/nav:after:scale-x-100">
                    FAQs
                  </span>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="group/nav rounded-full border-transparent bg-transparent px-4 text-sm font-semibold uppercase tracking-[0.28em] text-[#cfd3e1] hover:bg-transparent hover:text-white"
              >
                <Link
                  href="https://github.com/acmuta/mavresume#readme"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="relative inline-block after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-[#89a5ff] after:transition-transform after:duration-300 group-hover/nav:after:scale-x-100">
                    Help
                  </span>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="group/nav rounded-full border-transparent bg-transparent px-4 text-sm font-semibold uppercase tracking-[0.28em] text-[#cfd3e1] hover:bg-transparent hover:text-white"
              >
                <Link
                  href="https://www.acmuta.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="relative inline-block after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-[#89a5ff] after:transition-transform after:duration-300 group-hover/nav:after:scale-x-100">
                    ACM @ UTA
                  </span>
                </Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="group/nav rounded-full border-transparent bg-transparent px-4 text-sm font-semibold uppercase tracking-[0.28em] text-white hover:bg-transparent hover:text-white"
              >
                <Link href="/login" aria-current="page">
                  <span className="relative inline-block after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-100 after:bg-[#89a5ff]">
                    Login
                  </span>
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="relative px-4 pb-14 sm:px-6 sm:pb-16 lg:min-h-[calc(100vh-7.25rem)] lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)] lg:items-center lg:gap-16">
          <motion.div
            initial={
              shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }
            }
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative my-auto max-w-lg"
          >
            <h1 className="text-4xl font-semibold leading-[0.97] tracking-tight text-white sm:text-5xl">
              {mode === "login"
                ? "Sign in and keep building momentum."
                : "Create your account and start stronger drafts."}
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-[#cfd3e1] sm:text-base">
              {mode === "login"
                ? "Resume writing, AI refinement, and reviewer-ready submission stay in one workflow."
                : "Open your MavResume workspace to draft sections, improve bullets, and prepare a cleaner final PDF."}
            </p>

            <div className="mt-7 flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError(null);
                  setSuccessMessage(null);
                  setConfirmPasswordError(null);
                }}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] transition ${
                  mode === "login"
                    ? "bg-[#274cbc] text-white"
                    : "text-[#8d96ad] hover:text-white"
                }`}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setError(null);
                  setSuccessMessage(null);
                  setConfirmPasswordError(null);
                }}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] transition ${
                  mode === "signup"
                    ? "bg-[#274cbc] text-white"
                    : "text-[#8d96ad] hover:text-white"
                }`}
              >
                Create account
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {successMessage && (
                <div
                  className="flex items-start gap-2 text-sm text-green-300"
                  role="alert"
                >
                  <CheckCircle className="mt-0.5 size-4 flex-shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {error && (
                <div className="text-sm text-destructive" role="alert">
                  {error}
                </div>
              )}

              <Button
                type="button"
                variant="outline"
                className="h-12 w-full rounded-xl border-dashed border-[#2f323a] bg-transparent text-white hover:border-[#4b4f5c] hover:bg-[#161920] hover:text-white"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <svg
                    className="mr-2 size-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                )}
                Continue with Google
              </Button>

              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-[#2d313a]" />
                <span className="text-[11px] uppercase tracking-[0.26em] text-[#6d7895]">
                  Or continue with email
                </span>
                <span className="h-px flex-1 bg-[#2d313a]" />
              </div>

              <form onSubmit={handleEmailPasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-0 top-1/2 size-4 -translate-y-1/2 text-[#6d7895]" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) validateEmail(e.target.value);
                      }}
                      onBlur={() => validateEmail(email)}
                      className="h-12 rounded-none border-0 border-b border-dotted border-[#4a5062] bg-transparent pl-7 pr-0 text-white placeholder:text-[#6d7895] shadow-none focus-visible:border-[#9ab1ff] focus-visible:ring-0"
                      required
                      disabled={isLoading}
                      aria-invalid={emailError ? "true" : "false"}
                      aria-describedby={emailError ? "email-error" : undefined}
                    />
                  </div>
                  {emailError && (
                    <p
                      id="email-error"
                      className="text-sm text-destructive"
                      role="alert"
                    >
                      {emailError}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-0 top-1/2 size-4 -translate-y-1/2 text-[#6d7895]" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={
                        mode === "login"
                          ? "Enter your password"
                          : "At least 6 characters"
                      }
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (passwordError) validatePassword(e.target.value);
                        if (confirmPassword && mode === "signup") {
                          validateConfirmPassword(confirmPassword);
                        }
                      }}
                      onBlur={() => validatePassword(password)}
                      className="h-12 rounded-none border-0 border-b border-dotted border-[#4a5062] bg-transparent pl-7 pr-9 text-white placeholder:text-[#6d7895] shadow-none focus-visible:border-[#9ab1ff] focus-visible:ring-0"
                      required
                      disabled={isLoading}
                      aria-invalid={passwordError ? "true" : "false"}
                      aria-describedby={
                        passwordError ? "password-error" : undefined
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6d7895] transition hover:text-white"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                  {passwordError && (
                    <p
                      id="password-error"
                      className="text-sm text-destructive"
                      role="alert"
                    >
                      {passwordError}
                    </p>
                  )}
                  {mode === "signup" && !passwordError && (
                    <p className="text-xs text-[#6d7895]">
                      Password must be at least 6 characters
                    </p>
                  )}
                </div>

                {mode === "signup" && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-white">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-0 top-1/2 size-4 -translate-y-1/2 text-[#6d7895]" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (confirmPasswordError) {
                            validateConfirmPassword(e.target.value);
                          }
                        }}
                        onBlur={() => validateConfirmPassword(confirmPassword)}
                        className="h-12 rounded-none border-0 border-b border-dotted border-[#4a5062] bg-transparent pl-7 pr-9 text-white placeholder:text-[#6d7895] shadow-none focus-visible:border-[#9ab1ff] focus-visible:ring-0"
                        required
                        disabled={isLoading}
                        aria-invalid={confirmPasswordError ? "true" : "false"}
                        aria-describedby={
                          confirmPasswordError
                            ? "confirm-password-error"
                            : undefined
                        }
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6d7895] transition hover:text-white"
                        aria-label={
                          showConfirmPassword
                            ? "Hide confirm password"
                            : "Show confirm password"
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </div>
                    {confirmPasswordError && (
                      <p
                        id="confirm-password-error"
                        className="text-sm text-destructive"
                        role="alert"
                      >
                        {confirmPasswordError}
                      </p>
                    )}
                  </div>
                )}

                <Button
                  type="submit"
                  className="h-12 w-full rounded-2xl bg-[#274cbc] text-base font-semibold text-white transition duration-300 hover:scale-[1.01] hover:bg-[#315be1]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      {mode === "login"
                        ? "Signing in..."
                        : "Creating account..."}
                    </>
                  ) : mode === "login" ? (
                    "Sign In"
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </form>

              <div className="text-center text-sm text-[#a4a7b5]">
                {mode === "login" ? (
                  <>
                    Don&apos;t have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setMode("signup");
                        setError(null);
                        setSuccessMessage(null);
                        setEmailError(null);
                        setPasswordError(null);
                        setConfirmPasswordError(null);
                      }}
                      className="font-semibold text-[#89a5ff] underline-offset-4 transition hover:text-[#b3c2ff] hover:underline"
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setMode("login");
                        setError(null);
                        setSuccessMessage(null);
                        setEmailError(null);
                        setPasswordError(null);
                        setConfirmPasswordError(null);
                        setConfirmPassword("");
                      }}
                      className="font-semibold text-[#89a5ff] underline-offset-4 transition hover:text-[#b3c2ff] hover:underline"
                    >
                      Sign in
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={
              shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: 24 }
            }
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.08 }}
            className="relative lg:pl-12"
          >
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute -top-10 right-10 h-44 w-44 rounded-full bg-[#274cbc]/16 blur-[85px]"
              animate={
                shouldReduceMotion
                  ? undefined
                  : { scale: [1, 1.18, 1], opacity: [0.5, 0.85, 0.5] }
              }
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#89a5ff]">
                Resume writing tips
              </p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl">
                Write bullets that survive a 7-second scan.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#cfd3e1] sm:text-base">
                Pick any tip from the left. The right detail panel updates in
                place and auto-rotation pauses after your selection until you
                leave this section.
              </p>
            </div>

            <div
              className="mt-8 grid gap-8 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-10"
              onMouseLeave={() => setIsTipAutoRotate(true)}
            >
              <div className="grid gap-1">
                {resumeTips.map((tip, index) => {
                  const Icon = tip.icon;
                  const isActive = index === currentTipIndex;

                  return (
                    <button
                      key={tip.title}
                      type="button"
                      onClick={() => {
                        setCurrentTipIndex(index);
                        setIsTipAutoRotate(false);
                      }}
                      className="group flex items-center justify-between gap-3 border-b border-[#252a35] py-3 text-left"
                      aria-label={`Go to tip ${index + 1}`}
                      aria-pressed={isActive}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-flex size-8 items-center justify-center rounded-full transition ${
                            isActive
                              ? "bg-[#274cbc]/28 text-[#a8bbff]"
                              : "bg-[#151821] text-[#6d7895] group-hover:text-[#a8bbff]"
                          }`}
                        >
                          <Icon className="size-4" />
                        </span>
                        <span
                          className={`text-sm font-semibold transition ${
                            isActive
                              ? "text-white"
                              : "text-[#a4a7b5] group-hover:text-[#d7dded]"
                          }`}
                        >
                          {tip.title}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-semibold uppercase tracking-[0.2em] transition ${
                          isActive ? "text-[#89a5ff]" : "text-[#5e677d]"
                        }`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="relative flex min-h-[150px] items-center border-l border-[#2a3142] pl-5 sm:pl-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTipIndex}
                    initial={
                      shouldReduceMotion
                        ? { opacity: 1 }
                        : { opacity: 0, y: 12, filter: "blur(3px)" }
                    }
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={
                      shouldReduceMotion
                        ? { opacity: 1 }
                        : { opacity: 0, y: -10, filter: "blur(2px)" }
                    }
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="w-full space-y-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7f91bd]">
                        Tip {String(currentTipIndex + 1).padStart(2, "0")}
                      </p>
                      <span className="h-px flex-1 bg-[linear-gradient(90deg,rgba(127,145,189,0.9),rgba(127,145,189,0))]" />
                    </div>

                    <div className="flex items-start gap-4">
                      <span className="relative px-2 inline-flex size-11 items-center justify-center rounded-2xl border border-[#34456f] bg-[linear-gradient(145deg,rgba(39,76,188,0.32),rgba(19,30,51,0.92))] text-[#c0d0ff] shadow-[0_0_24px_rgba(39,76,188,0.28)]">
                        <currentTip.icon className="relative z-10 size-5 " />
                      </span>
                      <div className="pt-0.5 space-y-3">
                        <p className="text-lg font-semibold leading-tight text-white">
                          {currentTip.title}
                        </p>
                        <p className="text-sm leading-relaxed text-[#c9cedc]">
                          {currentTip.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="mt-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#89a5ff]">
                What you unlock after sign in
              </p>
              <div className="mt-4 space-y-3">
                {unlockItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div key={item.title} className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex size-6 items-center justify-center rounded-full bg-[#1a1f2c] text-[#8fa5ff]">
                        <Icon className="size-3.5" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {item.title}
                        </p>
                        <p className="text-sm text-[#aab2c5]">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Link
                href="/features"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#9bb1ff] transition hover:text-[#bed0ff]"
              >
                Preview full workflow
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

function BackgroundAtmosphere() {
  return (
    <>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,_#12141b_0%,_#0d0e12_45%,_#09090b_100%)]" />
      <div className="absolute left-1/2 top-0 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-[#274cbc]/10 blur-[180px]" />
      <div className="absolute right-0 top-[18rem] h-80 w-80 rounded-full bg-[#19c8ff]/8 blur-[160px]" />
      <div className="absolute left-0 top-[34rem] h-72 w-72 rounded-full bg-[#274cbc]/8 blur-[160px]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.9)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.9)_1px,transparent_1px)] [background-size:120px_120px]" />
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="relative flex min-h-screen items-center justify-center bg-[#101113] text-white">
          <BackgroundAtmosphere />
          <div className="relative z-10 flex flex-col items-center gap-4">
            <Loader2 className="size-8 animate-spin text-[#274cbc]" />
            <p className="text-[#a4a7b5]">Loading...</p>
          </div>
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
