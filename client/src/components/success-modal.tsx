import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Star } from "lucide-react";
import { useLocation } from "wouter";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  registrationId?: number;
}

export default function SuccessModal({ isOpen, onClose, registrationId }: SuccessModalProps) {
  const [, navigate] = useLocation();

  const handleVipUpgrade = () => {
    navigate(`/vip-upgrade?registrationId=${registrationId}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <div className="flex flex-col items-center text-center p-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>

          <h3 className="text-3xl font-bold text-gray-900 mb-2">
            Congratulations! You're In! 🎉
          </h3>

          <p className="text-lg text-gray-600 mb-6">
            You're officially registered for the <strong>AI Elevate Challenge</strong> happening July 29–31! 
            An email confirmation is on its way.
          </p>

          {/* VIP Upgrade Section */}
          <div className="background: linear-gradient(135deg, #17abe8 0%, #004aad 100%); text-white p-6 rounded-2xl mb-6 w-full">
            <div className="flex items-center justify-center mb-4">
              <Star className="w-6 h-6 mr-2" />
              <h4 className="text-2xl font-bold">Want to Build With Us Live?</h4>
            </div>
            <p className="text-xl mb-4">Go VIP, Only $25</p>
            <p className="text-white/90 mb-4">
              Upgrade to VIP and build real AI tools with us – live!
            </p>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
              <p className="font-semibold mb-2">When you upgrade to VIP, you get exclusive hands-on access from 5 to 7 PM daily:</p>
              <ul className="text-left space-y-1 text-sm">
                <li>🛠 Build an AI Agent</li>
                <li>📝 Access to CrispWrite: Our AI-powered writing assistant</li>
                <li>📋 SOP templates to scale your team faster</li>
                <li>📊 Extended AI Readiness Assessment & action blueprint</li>
                <li>🎥 Replay access & bonus resources</li>
                <li>💬 Live support from our team while you build</li>
              </ul>
            </div>

            <Button
              onClick={handleVipUpgrade}
              className="bg-white text-purple-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105"
            >
              Upgrade to VIP for $25
            </Button>
          </div>

          <div className="text-center">
            <p className="text-gray-600 mb-4">
              <strong>Free Challenge:</strong> July 29-31, 4-5 PM EST daily<br />
              <strong>VIP Build Sessions:</strong> 5-7 PM EST daily
            </p>

            <Button
              onClick={onClose}
              variant="outline"
              className="px-6 py-3 rounded-lg font-semibold"
            >
              Continue with Free Access
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
