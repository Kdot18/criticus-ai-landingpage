import * as React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface WaitlistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormData {
  name: string;
  email: string;
  university: string;
  role: string;
  howHeardAboutUs: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  university?: string;
  role?: string;
  howHeardAboutUs?: string;
}

export function WaitlistModal({ open, onOpenChange }: WaitlistModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    university: "",
    role: "",
    howHeardAboutUs: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.university.trim()) {
      newErrors.university = "University or institution is required";
    }

    if (!formData.role) {
      newErrors.role = "Please select your role";
    }

    if (!formData.howHeardAboutUs) {
      newErrors.howHeardAboutUs = "Please tell us how you heard about us";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus("success");
        setSubmitMessage("Thank you! You've been successfully added to our waitlist. We'll keep you updated on our progress.");

        // Reset form after successful submission
        setTimeout(() => {
          resetForm();
          onOpenChange(false);
        }, 2000);
      } else {
        setSubmitStatus("error");
        setSubmitMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setSubmitStatus("error");
      setSubmitMessage("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      university: "",
      role: "",
      howHeardAboutUs: "",
    });
    setErrors({});
    setSubmitStatus("idle");
    setSubmitMessage("");
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !isSubmitting) {
      resetForm();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md bg-neutral-900 border-neutral-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Join the Waitlist
          </DialogTitle>
          <DialogDescription className="text-center text-neutral-400">
            Be the first to know when Criticus AI launches in July 2026
          </DialogDescription>
        </DialogHeader>

        {submitStatus === "success" ? (
          <div className="text-center py-6">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <p className="text-green-400">{submitMessage}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {submitStatus === "error" && (
              <Alert className="bg-red-900/20 border-red-500/50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-400">
                  {submitMessage}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">
                Full Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter your full name"
                className="bg-neutral-800 border-neutral-600 text-white placeholder:text-neutral-400 focus:border-blue-500"
                disabled={isSubmitting}
              />
              {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="your.email@university.edu"
                className="bg-neutral-800 border-neutral-600 text-white placeholder:text-neutral-400 focus:border-blue-500"
                disabled={isSubmitting}
              />
              {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="university" className="text-white">
                University or Institution *
              </Label>
              <Input
                id="university"
                value={formData.university}
                onChange={(e) => handleInputChange("university", e.target.value)}
                placeholder="Enter your university or institution here"
                className="bg-neutral-800 border-neutral-600 text-white placeholder:text-neutral-400 focus:border-blue-500"
                disabled={isSubmitting}
              />
              {errors.university && <p className="text-red-400 text-sm">{errors.university}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-white">
                Role *
              </Label>
              <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)} disabled={isSubmitting}>
                <SelectTrigger className="bg-neutral-800 border-neutral-600 text-white focus:border-blue-500">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-800 border-neutral-600">
                  <SelectItem value="student" className="text-white hover:bg-neutral-700">
                    Student
                  </SelectItem>
                  <SelectItem value="professor" className="text-white hover:bg-neutral-700">
                    Professor
                  </SelectItem>
                  <SelectItem value="administrator" className="text-white hover:bg-neutral-700">
                    Administrator
                  </SelectItem>
                  <SelectItem value="other" className="text-white hover:bg-neutral-700">
                    Other
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.role && <p className="text-red-400 text-sm">{errors.role}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="howHeardAboutUs" className="text-white">
                How did you hear about us? *
              </Label>
              <Select value={formData.howHeardAboutUs} onValueChange={(value) => handleInputChange("howHeardAboutUs", value)} disabled={isSubmitting}>
                <SelectTrigger className="bg-neutral-800 border-neutral-600 text-white focus:border-blue-500">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-800 border-neutral-600">
                  <SelectItem value="social-media" className="text-white hover:bg-neutral-700">
                    Social Media
                  </SelectItem>
                  <SelectItem value="word-of-mouth" className="text-white hover:bg-neutral-700">
                    Word of Mouth
                  </SelectItem>
                  <SelectItem value="academic-conference" className="text-white hover:bg-neutral-700">
                    Academic Conference
                  </SelectItem>
                  <SelectItem value="other" className="text-white hover:bg-neutral-700">
                    Other
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.howHeardAboutUs && <p className="text-red-400 text-sm">{errors.howHeardAboutUs}</p>}
            </div>

            <DialogFooter className="gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isSubmitting}
                className="border-neutral-600 text-white hover:bg-neutral-800"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Joining...
                  </>
                ) : (
                  "Join Waitlist"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}