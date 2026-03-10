import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SocialLogin } from "@/components/layout/Login/SocialLogin";
import { Logo } from "@/components/layout/Login/Logo";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage({ searchParams }: { searchParams: any }) {
  const resolvedSearchParams = await searchParams;
  const session = await auth();

  // Si déjà connecté, on dégage vers le dashboard
  if (session) {
    redirect("/dashboard");
  }

  // On récupère une éventuelle erreur dans l'URL (ex: ?error=CredentialsSignin)
  const errorType = resolvedSearchParams?.error;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
        <Logo />

        <h1 className="text-white text-2xl font-semibold mb-2">Se connecter</h1>
        <p className="text-gray-400 mb-8">
          Connectez-vous pour accéder à votre compte.
        </p>

        {/* Affichage d'un message d'erreur si la connexion échoue */}
        {errorType === "CredentialsSignin" && (
          <div className="bg-red-500/15 border border-red-500/50 text-red-500 p-3 rounded-md mb-6 text-sm">
            Identifiants invalides. Veuillez réessayer.
          </div>
        )}

        <form
          action={async (formData) => {
            "use server";
            try {
              await signIn("credentials", {
                email: formData.get("email"),
                password: formData.get("password"),
                redirectTo: resolvedSearchParams?.callbackUrl ?? "/dashboard",
              });
            } catch (error) {
              if (error instanceof AuthError) {
                // On redirige vers la même page avec un paramètre d'erreur
                redirect(`/login?error=${error.type}`);
              }
              // TRÈS IMPORTANT : NextAuth utilise des erreurs pour gérer les redirections réussies.
              // Il faut laisser l'erreur "NEXT_REDIRECT" se propager.
              throw error;
            }
          }}
        >
          <div className="mb-4">
            <label className="text-gray-300 block mb-2 text-sm" htmlFor="email">
              Adresse e-mail
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="nom@exemple.com"
              required
              className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="mb-6">
            <label className="text-gray-300 block mb-2 text-sm" htmlFor="password">
              Mot de passe
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>

          <Button type="submit" className="w-full bg-sky-600 hover:bg-sky-500 text-white font-medium py-6">
            Se connecter
          </Button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-700"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#1e293b] px-2 text-slate-500">Ou continuer avec</span>
          </div>
        </div>

        <SocialLogin />

        <p className="text-gray-500 text-sm text-center mt-8">
          Pas encore de compte ?{" "}
          <Link href="/register" className="text-sky-400 hover:text-sky-300 transition-colors">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}