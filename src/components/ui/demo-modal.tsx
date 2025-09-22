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

interface DemoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormData {
  name: string;
  email: string;
  institutionType: string;
  institutionName: string;
  role: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  institutionType?: string;
  institutionName?: string;
  role?: string;
}

export function DemoModal({ open, onOpenChange }: DemoModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    institutionType: "",
    institutionName: "",
    role: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.institutionType) {
      newErrors.institutionType = "Please select an institution type";
    }

    if (!formData.institutionName.trim()) {
      newErrors.institutionName = "Institution name is required";
    }

    if (!formData.role) {
      newErrors.role = "Please select your role";
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
      const response = await fetch("/api/demo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus("success");
        setSubmitMessage("Thank you! Your demo request has been submitted. We'll be in touch soon to schedule your personalized demo.");

        // Reset form after successful submission
        setTimeout(() => {
          resetForm();
          onOpenChange(false);
        }, 15000);
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
      institutionType: "",
      institutionName: "",
      role: "",
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

  // Get role options based on institution type
  const getRoleOptions = () => {
    switch (formData.institutionType) {
      case "high-school":
        return [
          { value: "high-school-teacher", label: "High School Teacher" },
          { value: "high-school-administrator", label: "High School Administrator" },
        ];
      case "community-college":
        return [
          { value: "community-college-professor", label: "Community College Professor" },
          { value: "community-college-administrator", label: "Community College Administrator" },
        ];
      case "university":
        return [
          { value: "university-professor", label: "University Professor" },
          { value: "university-administrator", label: "University Administrator" },
        ];
      default:
        return [];
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md bg-neutral-900 border-neutral-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Book a Demo
          </DialogTitle>
          <DialogDescription className="text-center text-neutral-400">
            Educators, book a demo to see how we can integrate education-first AI tools into your classrooms!
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
                placeholder="your.email@institution.edu"
                className="bg-neutral-800 border-neutral-600 text-white placeholder:text-neutral-400 focus:border-blue-500"
                disabled={isSubmitting}
              />
              {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="institutionType" className="text-white">
                Institution Type *
              </Label>
              <Select
                value={formData.institutionType}
                onValueChange={(value) => {
                  handleInputChange("institutionType", value);
                  // Reset role when institution type changes
                  handleInputChange("role", "");
                }}
                disabled={isSubmitting}
              >
                <SelectTrigger className="bg-neutral-800 border-neutral-600 text-white focus:border-blue-500">
                  <SelectValue placeholder="Select institution type" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-800 border-neutral-600">
                  <SelectItem value="high-school" className="text-white hover:bg-neutral-700">
                    High School
                  </SelectItem>
                  <SelectItem value="community-college" className="text-white hover:bg-neutral-700">
                    Community College
                  </SelectItem>
                  <SelectItem value="university" className="text-white hover:bg-neutral-700">
                    University
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.institutionType && <p className="text-red-400 text-sm">{errors.institutionType}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="institutionName" className="text-white">
                Institution Name *
              </Label>
              <Input
                id="institutionName"
                value={formData.institutionName}
                onChange={(e) => handleInputChange("institutionName", e.target.value)}
                placeholder="Enter your institution name"
                className="bg-neutral-800 border-neutral-600 text-white placeholder:text-neutral-400 focus:border-blue-500"
                disabled={isSubmitting}
              />
              {errors.institutionName && <p className="text-red-400 text-sm">{errors.institutionName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-white">
                Role *
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleInputChange("role", value)}
                disabled={isSubmitting || !formData.institutionType}
              >
                <SelectTrigger className="bg-neutral-800 border-neutral-600 text-white focus:border-blue-500">
                  <SelectValue placeholder={
                    formData.institutionType
                      ? "Select your role"
                      : "Select institution type first"
                  } />
                </SelectTrigger>
                <SelectContent className="bg-neutral-800 border-neutral-600">
                  {getRoleOptions().map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="text-white hover:bg-neutral-700"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.role && <p className="text-red-400 text-sm">{errors.role}</p>}
            </div>

            {/* Disclaimers */}
            <div className="text-xs text-neutral-400 leading-relaxed pt-2">
              Criticus AI will use your information to provide the content or service you requested. We may use your information to send you marketing emails. You can unsubscribe at any time using the link in our emails.
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
                    Submitting...
                  </>
                ) : (
                  "Request Demo"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}