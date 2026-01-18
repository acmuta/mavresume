"use client";

import { useState, FormEvent, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
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
} from "lucide-react";
import { Fade } from "react-awesome-reveal";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signInWithEmail, signUpWithEmail, signInWithGoogle } from "@/lib/auth";
import { useSessionStore } from "@/store/useSessionStore";
import { useSessionSync } from "@/lib/hooks/useSessionSync";

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
    icon: CheckCircle2,
    title: "Keep It Concise",
    description:
      "Aim for 1-2 lines per bullet point. Recruiters scan quickly, so make every word count. Our AI refinement tool helps polish your wording.",
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
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  // Check authentication status
  const { isAuthenticated, isLoading: isAuthLoading } = useSessionStore();
  useSessionSync();

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

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      router.push(redirectTo);
      router.refresh();
    }
  }, [isAuthLoading, isAuthenticated, redirectTo, router]);

  // Rotate resume tips every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % resumeTips.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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
        } else {
          // Success - show success message and switch to login mode
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
          }, 2000);
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

  // Show loading state while checking authentication
  if (isAuthLoading) {
    return (
      <div className="relative min-h-screen bg-[#101113] text-white flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-[#11131a] via-[#0d0e12] to-[#09090b]" />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <Loader2 className="size-8 animate-spin text-[#274cbc]" />
          <p className="text-[#a4a7b5]">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render login form if user is authenticated (redirect will happen)
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="relative min-h-screen bg-[#101113] text-white">
      <div className="absolute inset-0 bg-gradient-to-b from-[#11131a] via-[#0d0e12] to-[#09090b]" />

      <main className="relative z-10 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-16">
          {/* Header with MavResume Branding */}
          <Fade direction="down" duration={600} triggerOnce>
            <div className="flex flex-col items-center gap-4 text-center">
              <Link
                href="/"
                className="font-bold tracking-tight text-5xl sm:text-6xl
                [mask-image:linear-gradient(to_bottom,black_40%,transparent)] 
                [mask-size:100%_100%] [mask-repeat:no-repeat]"
              >
                MAV<span className="font-extralight">RESUME</span>
              </Link>
              <span className="inline-flex w-fit items-center rounded-full border border-[#2b3242] bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#89a5ff] backdrop-blur">
                Built for UTA Mavericks
              </span>
            </div>
          </Fade>

          {/* Main Content Section */}
          <section className="relative overflow-hidden w-fit rounded-3xl border-2 border-dashed border-[#2c3037] bg-[radial-gradient(circle_at_top,_#1c2233,_#101113_70%)] p-8 shadow-[0_25px_60px_rgba(3,4,7,0.55)] sm:p-10">
            <div className="absolute inset-0 opacity-60">
              <div className="absolute -top-24 left-16 h-64 w-64 rounded-full bg-[#274cbc]/30 blur-[100px]" />
              <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-[#19c8ff]/20 blur-[80px]" />
            </div>

            <div className="relative flex flex-col gap-12 lg:flex-row">
              {/* Left Side: Login Form */}
              <div className="flex flex-1 flex-col max-w-sm">
                <Fade direction="left" duration={800} delay={200} triggerOnce>
                  <div className="space-y-6">
                    <div>
                      <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
                        {mode === "login"
                          ? "Welcome back"
                          : "Create your account"}
                      </h1>
                      <p className="mt-2 text-lg text-[#cfd3e1]">
                        {mode === "login"
                          ? "Sign in to continue building your resume."
                          : "Start building your recruiter-ready resume today."}
                      </p>
                    </div>

                    {/* Success Message */}
                    {successMessage && (
                      <div
                        className="rounded-lg border border-green-500/50 bg-green-500/10 p-3 text-sm text-green-400 flex items-center gap-2"
                        role="alert"
                      >
                        <CheckCircle className="size-4 flex-shrink-0" />
                        <span>{successMessage}</span>
                      </div>
                    )}

                    {/* Error Message */}
                    {error && (
                      <div
                        className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive"
                        role="alert"
                      >
                        {error}
                      </div>
                    )}

                    {/* Google OAuth Button */}
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-12 rounded-xl border-dashed border-[#2f323a] bg-transparent text-white hover:text-white hover:border-[#4b4f5c] hover:bg-[#161920] transition duration-300"
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

                    <div className="flex items-center justify-center gap-3 w-full ">
                      <div className="divider w-1/3 border-[#2d313a]"></div>
                      <span className="text-xs uppercase text-center text-[#6d7895]">
                        Or continue with email
                      </span>
                      <div className="divider w-1/3 border-[#2d313a]"></div>
                    </div>

                    {/* Email/Password Form */}
                    <form
                      onSubmit={handleEmailPasswordSubmit}
                      className="space-y-4"
                    >
                      {/* Email Field */}
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-white">
                          Email
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#6d7895]" />
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
                            className="pl-10 bg-[#1F2023] border-dotted border-[#6F748B] text-white placeholder:text-[#6d7895] focus:border-white"
                            required
                            disabled={isLoading}
                            aria-invalid={emailError ? "true" : "false"}
                            aria-describedby={
                              emailError ? "email-error" : undefined
                            }
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

                      {/* Password Field */}
                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-white">
                          Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#6d7895]" />
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
                              if (passwordError)
                                validatePassword(e.target.value);
                              if (confirmPassword && mode === "signup") {
                                validateConfirmPassword(confirmPassword);
                              }
                            }}
                            onBlur={() => validatePassword(password)}
                            className="pl-10 pr-10 bg-[#1F2023] border-dotted border-[#6F748B] text-white placeholder:text-[#6d7895] focus:border-white"
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
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6d7895] hover:text-white transition"
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

                      {/* Confirm Password Field (Sign-up only) */}
                      {mode === "signup" && (
                        <div className="space-y-2">
                          <Label
                            htmlFor="confirmPassword"
                            className="text-white"
                          >
                            Confirm Password
                          </Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#6d7895]" />
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
                              onBlur={() =>
                                validateConfirmPassword(confirmPassword)
                              }
                              className="pl-10 pr-10 bg-[#1F2023] border-dotted border-[#6F748B] text-white placeholder:text-[#6d7895] focus:border-white"
                              required
                              disabled={isLoading}
                              aria-invalid={
                                confirmPasswordError ? "true" : "false"
                              }
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
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6d7895] hover:text-white transition"
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

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        className="w-full h-12 rounded-2xl bg-[#274cbc] text-base font-semibold text-white hover:bg-[#315be1] hover:scale-[1.01] transition duration-300"
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

                    {/* Toggle between Login and Sign-up */}
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
                            className="text-[#274cbc] hover:text-[#315be1] font-semibold underline-offset-4 hover:underline"
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
                            className="text-[#274cbc] hover:text-[#315be1] font-semibold underline-offset-4 hover:underline"
                          >
                            Sign in
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </Fade>
              </div>

              {/* Right Side: Rotating Resume Tips */}
              <div className="flex flex-1 flex-col gap-5 lg:max-w-md">
                <Fade direction="right" duration={800} delay={500} triggerOnce>
                  <Card className="border border-[#1c1f29] bg-[#15171c]/90">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                        Resume Writing Tips
                      </CardTitle>
                      <CardDescription>
                        Quick tips to help you build a standout resume
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div
                        key={currentTipIndex}
                        className="rounded-2xl border-2 border-dashed border-[#2d323d] bg-[#1a1d24] p-4 transition-all duration-500 ease-in-out"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex size-10 items-center justify-center rounded-xl bg-[#1f2330]/80 text-[#8fa5ff] flex-shrink-0">
                            {(() => {
                              const Icon = resumeTips[currentTipIndex].icon;
                              return <Icon className="size-5" />;
                            })()}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-white mb-1">
                              {resumeTips[currentTipIndex].title}
                            </p>
                            <p className="text-xs text-[#c9cedc] leading-relaxed">
                              {resumeTips[currentTipIndex].description}
                            </p>
                          </div>
                        </div>
                      </div>
                      {/* Tip Indicators */}
                      <div className="flex justify-center gap-2">
                        {resumeTips.map((_, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setCurrentTipIndex(index)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              index === currentTipIndex
                                ? "w-6 bg-[#274cbc]"
                                : "w-1.5 bg-[#3d4353] hover:bg-[#4b4f5c]"
                            }`}
                            aria-label={`Go to tip ${index + 1}`}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Fade>

                <Fade direction="right" duration={800} delay={700} triggerOnce>
                  <Card className="border-2 border-dashed border-[#2a303d] bg-[#111219]/80">
                    <CardHeader className="pb-1.5">
                      <CardTitle className="text-base text-white/90">
                        Need Help?
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Our guided builder walks you through every step
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-1.5">
                      <p className="text-sm text-[#c9cedc]">
                        Once you&apos;re signed in, you&apos;ll have access to
                        our step-by-step resume builder with AI-powered
                        suggestions tailored for UTA students.
                      </p>
                    </CardContent>
                  </Card>
                </Fade>
              </div>
            </div>
          </section>

          {/* Back to Home Link */}
          <Fade direction="up" duration={600} delay={400} triggerOnce>
            <div className="text-center">
              <Link
                href="/"
                className="text-sm text-[#6d7895] hover:text-white transition inline-flex items-center gap-2"
              >
                ← Back to home
              </Link>
            </div>
          </Fade>
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="relative min-h-screen bg-[#101113] text-white flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-b from-[#11131a] via-[#0d0e12] to-[#09090b]" />
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
