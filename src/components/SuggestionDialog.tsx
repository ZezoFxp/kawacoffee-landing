import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SuggestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SuggestionDialog = ({ open, onOpenChange }: SuggestionDialogProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("suggestions")
        .insert([{ name, email, suggestion }]);

      if (error) throw error;

      toast({
        title: "Sugestão enviada!",
        description: "Obrigado pelo seu feedback. Valorizamos muito sua opinião!",
      });

      setName("");
      setEmail("");
      setSuggestion("");
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao enviar sugestão:", error);
      toast({
        title: "Erro ao enviar sugestão",
        description: "Por favor, tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Deixe sua Sugestão</DialogTitle>
          <DialogDescription>
            Adoraríamos ouvir suas ideias para melhorar sua experiência no KawaCoffee.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="suggestion">Sugestão</Label>
            <Textarea
              id="suggestion"
              placeholder="Compartilhe sua ideia conosco..."
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
              required
              rows={5}
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-primary hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Enviar Sugestão"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SuggestionDialog;
