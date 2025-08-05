import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border bg-card p-6 shadow-lg">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              404
            </h1>
            <h2 className="text-xl font-semibold text-foreground">
              Page non trouvée
            </h2>
            <p className="text-muted-foreground">
              Désolé, la page que vous recherchez n'existe pas ou a été
              déplacée.
            </p>
          </div>
          <Button asChild className="gap-2">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              Retour à l'accueil
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
