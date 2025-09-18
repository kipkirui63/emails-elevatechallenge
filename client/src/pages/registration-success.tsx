import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, Users, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function RegistrationSuccess() {
  const { toast } = useToast();
  
  // Get registration ID from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const registrationId = urlParams.get('registrationId') || '';

  const handleInviteFriend = async () => {
    const currentUrl = window.location.origin;
    
    try {
      await navigator.clipboard.writeText(currentUrl);
      toast({
        title: "Copied to clipboard!",
        description: "Share this link with your friends and colleagues.",
        duration: 3000,
      });
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = currentUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      toast({
        title: "Copied to clipboard!",
        description: "Share this link with your friends and colleagues.",
        duration: 3000,
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Congratulations! You are now registered for the AI Elevate Challenge!
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            You're officially in for the Free AI Elevate Challenge happening Sep 13–14, 1–4 PM EST daily! 
            An email confirmation is on its way. Check your inbox to find it (and spam folder, just in case).
          </p>
        </div>

        {/* How to Maximize Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">How to Maximize Your 2-Day Experience</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 1. Join with Laptop */}
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: "linear-gradient(135deg, #17abe8 0%, #004aad 100%)" }}
              >
                <ArrowRight className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Join in with your laptop</h3>
              <p className="text-gray-600 mb-4">Go from learning to doing. Follow us along as we build love.</p>
            </div>

            {/* 2. Calendar */}
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: "linear-gradient(135deg, #17abe8 0%, #004aad 100%)" }}
              >
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Add the Challenge to Your Calendar</h3>
              <p className="text-gray-600 mb-4">Stay on track with daily reminders and never miss a session!</p>
              <Button
                className="text-white font-bold py-2 px-6 rounded-full"
                style={{ background: "linear-gradient(135deg, #17abe8 0%, #004aad 100%)" }}
                onClick={() => {
                  window.open(
                    'https://calendar.google.com/calendar/render?action=TEMPLATE&text=AI+Elevate+Challenge&dates=20250913T170000Z/20250913T200000Z&details=Join+us+for+the+AI+Elevate+Challenge+with+Dr.+Uche+Udoha%0AZoom+Link%3A+https%3A%2F%2Fus06web.zoom.us%2Fj%2F89419812734%3Fpwd%3DN65aL23ZSrXT7GOZt4cYhCSM2ajQAj.1&location=Zoom&trp=false',
                    '_blank'
                  );
                }}
              >
                Add to Calendar
              </Button>
            </div>

            {/* 3. Invite Friends */}
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: "linear-gradient(135deg, #17abe8 0%, #004aad 100%)" }}
              >
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Invite Friends & Colleagues</h3>
              <p className="text-gray-600 mb-4">Want to learn together? Share this link and bring someone along!</p>
              <Button
                className="text-white font-bold py-2 px-6 rounded-full"
                style={{ background: "linear-gradient(135deg, #17abe8 0%, #004aad 100%)" }}
                onClick={handleInviteFriend}
              >
                Invite a Friend
              </Button>
            </div>
          </div>
        </div>

        {/* WhatsApp Community */}
        <div className="bg-white rounded-xl p-8 shadow-lg mb-12 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Join the WhatsApp Community</h3>
          <p className="text-gray-600 mb-6">
            Stay connected with us on WhatsApp so you're not missing out on any relevant updates, community support, bonus links, and important announcements will be shared
          </p>
          <Button
            className="text-white font-bold py-3 px-8 rounded-full"
            style={{ background: "linear-gradient(135deg, #17abe8 0%, #004aad 100%)" }}
            onClick={() => {
              window.open('https://chat.whatsapp.com/DsjZdRGrwOOK4PIdKOqX5M?mode=ac_t', '_blank');
            }}
          >
            Join the Community
          </Button>
        </div>

        {/* Daily Recap */}
        <div className="bg-white rounded-xl p-8 shadow-lg mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">🧠 Let's Recap Your Daily Experience:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{backgroundColor: '#e6f3ff'}}>
                <span className="font-bold text-xl" style={{color: '#004aad'}}>1</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Day 1: Mastering the Foundations</h3>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• The Foundations of Generative AI — what it is and how it's changing every industry</li>
                <li>• Prompt Engineering Basics — how to get AI to deliver exactly what you need</li>
                <li>• Becoming an AI Strategist — how to think about AI in a way that creates real results</li>
              </ul>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{backgroundColor: '#f0f8ff'}}>
                <span className="font-bold text-xl" style={{color: '#17abe8'}}>2</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Day 2: Turning Knowledge Into Action</h3>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Real-world AI Use Cases that anyone can apply</li>
                <li>• Hands-on practice with AI Tools for different purposes (business, content, productivity, etc.)</li>
                <li>• Building Your First AI Agent — step into the future of work by creating an assistant that runs on autopilot</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Save the Dates */}
        <div className="rounded-xl p-8 text-white text-center mb-12" style={{background: 'linear-gradient(135deg, #17abe8, #004aad)'}}>
          <h2 className="text-2xl font-bold mb-4">📅 Save the Dates</h2>
          <div className="space-y-2">
            <p>🗓 <strong>September 27–28</strong></p>
            <p>🕓 <strong>1PM–4 PM EST Daily</strong></p>
            <p>📍 <strong>Live on Zoom | Replay Access</strong></p>
          </div>
        </div>

        {/* Final Message */}
        <div className="rounded-2xl p-8 text-white text-center" style={{background: 'linear-gradient(135deg, #17abe8, #004aad)'}}>
          <h2 className="text-2xl font-bold mb-4">You've already said yes to yourself and that's a big deal.</h2>
          <p className="text-lg mb-6">Now, we'll walk you through the rest.</p>
          <p className="text-xl font-bold">We'll see you soon! ✨</p>
        </div>
      </div>
    </div>
  );
}