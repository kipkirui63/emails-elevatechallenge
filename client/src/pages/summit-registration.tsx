import { Button } from "@/components/ui/button";
import CountdownTimer from "@/components/countdown-timer";
import RegistrationForm from "@/components/registration-form";
import { useEffect } from "react";

// Using a placeholder image for Dr. Uche - replace with actual image URL
const drUcheImage = "/image.png";

export default function SummitRegistration() {

  const handleRegistrationSuccess = (id?: number) => {
    // Redirect to registration success page with registration ID
    if (id) {
      window.location.href = `/registration-success?registrationId=${id}`;
    } else {
      window.location.href = '/registration-success';
    }
  };

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const navbar = document.getElementById('main-navbar');
      const countdownBar = document.getElementById('countdown-bar');

      if (navbar && countdownBar) {
        if (currentScrollY > lastScrollY && currentScrollY > 80) {
          // Scrolling down - hide navbar, move countdown bar to top
          navbar.style.transform = 'translateY(-100%)';
          countdownBar.style.top = '0px';
        } else {
          // Scrolling up - show navbar, move countdown bar back down
          navbar.style.transform = 'translateY(0)';
          countdownBar.style.top = '64px';
        }
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{background: 'linear-gradient(135deg, #f8fbff 0%, #ffffff 50%, #f0f8ff 100%)'}}>
      {/* Header Navigation - Hides on scroll */}
      <nav id="main-navbar" className="bg-white shadow-sm border-b border-gray-200 fixed w-full top-0 z-50 transition-transform duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img
                src="https://crispai.crispvision.org/media/crisp-logo.png"
                alt="Crisp AI Logo"
                className="h-10 w-auto"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Sticky Countdown and Register Bar - Always visible */}
      <div className="fixed w-full top-16 z-40 bg-white shadow-md border-b border-gray-200 transition-all duration-300" id="countdown-bar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            {/* Left - Countdown Timer */}
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-1">Challenge starts in:</p>
              <CountdownTimer />
            </div>

            {/* Right - Register Button */}
            <button 
              onClick={() => {
                document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="crisp-gradient text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Claim my Free Spot
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="pt-32" id="main-content">

        {/* Hero Section - Full Width */}
        <div className="relative min-h-screen" style={{background: 'linear-gradient(135deg, #f8fbff 0%, #e6f3ff 50%, #f0f8ff 100%)'}}>
          {/* Full Width Content Area */}
          <div className="w-full px-4 sm:px-6 lg:px-8 py-16 relative z-10">
            <div className="max-w-6xl mx-auto">
              {/* Main Heading */}
              <div className="text-center mb-12">
                <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight px-4">
                  Join This Free 2-Day Event with AI Expert Dr Uche Udoha | Sep 13 – Sep 14 | 1-4pm EST Daily
                </h1>
                <h2 className="text-xl lg:text-3xl font-bold mb-6 leading-tight">
                  <span style={{background: 'linear-gradient(135deg, #17abe8, #004aad)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}>AI Elevate Challenge:</span> Become the Person Who Uses AI Right
                </h2>
                <p className="text-lg text-gray-600 mb-8 max-w-4xl mx-auto">
                  Learn to work smarter, not harder, even if you've never used AI tools before.
                </p>

                <div className="text-center mb-8">
                  <Button
                    onClick={() => {
                      document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="crisp-gradient text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 mb-8"
                  >
                    Claim my Free Spot
                  </Button>
                </div>

                <div className="text-center p-8 rounded-xl bg-white shadow-md mb-12">
                  <div className="text-2xl font-bold mb-2">Sep 13- Sep 14</div>
                  <div className="text-md text-gray-700 mb-4">Join from anywhere in the world via zoom</div>

                  <div className="flex flex-wrap justify-center gap-3">
                    <div className="px-5 py-2 bg-gray-100 rounded-full text-sm font-medium">1pm EST</div>
                    <div className="px-5 py-2 bg-gray-100 rounded-full text-sm font-medium">6pm WAT</div>
                    <div className="px-5 py-2 bg-gray-100 rounded-full text-sm font-medium">6pm UK</div>
                    <div className="px-5 py-2 bg-gray-100 rounded-full text-sm font-medium">12pm US Central</div>
                    <div className="px-5 py-2 bg-gray-100 rounded-full text-sm font-medium">5pm GMT</div>
                  </div>
                </div>
              </div>

              {/* Registration Form - Full Width */}
              <div id="registration-form" className="w-full">
                <RegistrationForm onSuccess={handleRegistrationSuccess} />
              </div>
            </div>
          </div>
        </div>

        {/* Challenge Benefits Section */}
        <div className="bg-white py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                You Don't Need to Be a Techie to Lead in the AI Era
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-6">
                Too many people are overwhelmed by AI. They know it's the future but not how to start using it practically.
              </p>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto mb-6">
                That ends here.
              </p>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto">
                Join us for 2 days of clear, beginner-friendly AI training where you'll finally learn how to identify real opportunities, map them to the right tools, and even build your own digital assistant.
                You'll walk away with clarity, confidence, and a real AI agent of your own without writing a single line of code.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div className="p-8 rounded-2xl border-2 shadow-lg" style={{backgroundColor: '#f8fbff', borderColor: '#17abe8'}}>
                <h3 className="text-2xl font-bold text-black mb-4">In just 2 days, gain clarity on how to:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="mr-3 font-bold" style={{color: '#004aad'}}>✓</span>
                    <span className="text-gray-800">Spot real, high-impact AI opportunities in your work or business</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 font-bold" style={{color: '#004aad'}}>✓</span>
                    <span className="text-gray-800">Build your first AI-powered agent with zero tech skills</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 font-bold" style={{color: '#004aad'}}>✓</span>
                    <span className="text-gray-800">Create scalable workflows that save time and boost results</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 font-bold" style={{color: '#004aad'}}>✓</span>
                    <span className="text-gray-800">Lead boldly and strategically in an AI-first world</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-8 rounded-2xl border-2 shadow-lg" style={{borderColor: '#004aad'}}>
                <h3 className="text-2xl font-bold text-black mb-4">Is the AI Elevate Challenge designed for me and my business???</h3>
                <h4 className="text-xl font-bold mb-4" style={{color: '#17abe8'}}>YES! This Challenge Is Designed For You, Especially If you…</h4>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="mr-3 font-bold" style={{color: '#17abe8'}}>✅</span>
                    <span className="text-gray-800">Are curious about AI but not sure where to begin or what's possible</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 font-bold" style={{color: '#17abe8'}}>✅</span>
                    <span className="text-gray-800">Have tinkered with tools like ChatGPT but are ready to build practical, results-driven solutions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 font-bold" style={{color: '#17abe8'}}>✅</span>
                    <span className="text-gray-800">Are a business owner or founder looking to strategically weave AI into your daily operations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 font-bold" style={{color: '#17abe8'}}>✅</span>
                    <span className="text-gray-800">Lead a team and want to scale efficiency and output using smart AI tools</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 font-bold" style={{color: '#17abe8'}}>✅</span>
                    <span className="text-gray-800">Work as a coach, consultant, or service provider and want to deliver AI-driven value to your clients</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 font-bold" style={{color: '#17abe8'}}>✅</span>
                    <span className="text-gray-800">Just need a clear roadmap and a little push to take action with confidence</span>
                  </li>
                </ul>
                <div className="text-center mt-6">
                  <Button
                    onClick={() => {
                      document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                    style={{background: 'linear-gradient(135deg, #17abe8 0%, #004aad 100%)'}}
                  >
                    Claim My Free Spot
                  </Button>
                </div>
              </div>
            </div>

            {/* Host Section */}
            <div className="relative overflow-hidden rounded-2xl py-16 px-8 text-white" style={{background: 'linear-gradient(135deg, #000000 0%, #004aad 100%)'}}>
              <div className="absolute inset-0" style={{background: 'linear-gradient(rgba(23, 171, 232, 0.1), rgba(0, 0, 0, 0.3))'}}></div>
              <div className="relative z-10 max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h3 className="text-4xl font-bold mb-4 text-white drop-shadow-lg">Meet Your Host</h3>
                  <div className="w-24 h-1 mx-auto rounded-full" style={{background: 'linear-gradient(90deg, #17abe8, #ffffff)'}}></div>
                </div>

                {/* Profile Image with enhanced styling and perfect centering */}
                <div className="flex justify-center mb-12">
                  <div className="relative mx-auto">
                    <div className="absolute inset-0 rounded-full animate-pulse" style={{background: 'linear-gradient(90deg, #17abe8, #ffffff)'}}></div>
                    <div className="relative bg-white p-3 rounded-full">
                      <img 
                        src={drUcheImage} 
                        alt="Dr. Uche Udoha" 
                        className="w-56 h-56 rounded-full object-cover shadow-2xl"
                        style={{ objectPosition: '50% 20%' }}
                      />
                    </div>
                    <div className="absolute -bottom-3 -right-3 text-white px-5 py-3 rounded-full text-sm font-semibold shadow-lg" style={{background: 'linear-gradient(135deg, #17abe8, #004aad)'}}>
                      AI Expert
                    </div>
                  </div>
                </div>

                <div className="text-center mb-8">
                  <h4 className="text-3xl font-bold mb-3 text-white drop-shadow-lg">Dr. Uche Udoha</h4>
                  <p className="text-xl font-semibold" style={{color: '#17abe8'}}>AI Educator | Founder of Crisp AI</p>
                </div>

                <blockquote className="text-lg italic text-center max-w-3xl mx-auto mb-8 text-white/95 drop-shadow-sm">
                  "I created this challenge for the business owner, strategist, or team lead who's tired of being left behind. We don't tell stories. We teach you how to think and build with AI in a way that makes your work 10x easier."
                </blockquote>

                <div className="text-center">
                  <p className="text-xl font-semibold mb-2" style={{color: '#17abe8'}}>Ready to lead with AI?</p>
                  <p className="text-white/90 mb-8">Then this challenge will show you how!</p>
                  <Button
                    onClick={() => {
                      document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-black font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-xl border-2 border-white hover:bg-gray-100"
                    style={{background: 'linear-gradient(135deg, #17abe8, #ffffff)'}}
                  >
                    Join for free now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Breakdown Section */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
              What You'll Learn During The Free AI Elevate Challenge!
            </h2>

            <div className="space-y-8">
              {/* Day 1 */}
              <div className="relative overflow-hidden rounded-2xl shadow-xl">
                <div 
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(rgba(23, 171, 232, 0.95), rgba(0, 74, 173, 0.9)), url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
                <div className="relative z-10 p-8">
                  <div className="flex items-center mb-6">
                    <div className="bg-white px-4 py-2 rounded-full font-bold text-lg mr-4 shadow-lg" style={{color: '#004aad'}}>
                      Day 1
                    </div>
                    <h3 className="text-2xl font-bold text-white drop-shadow-lg">Mastering the Foundations</h3>
                  </div>

                  <div className="text-white/90 mb-4">
                    <ul className="text-white/80 space-y-2 text-sm">
                      <li>• The Foundations of Generative AI — what it is and how it's changing every industry</li>
                      <li>• Prompt Engineering Basics — how to get AI to deliver exactly what you need</li>
                      <li>• Becoming an AI Strategist — how to think about AI in a way that creates real results</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Day 2 */}
              <div className="relative overflow-hidden rounded-2xl shadow-xl">
                <div 
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(rgba(0, 0, 0, 0.95), rgba(0, 74, 173, 0.9)), url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
                <div className="relative z-10 p-8">
                  <div className="flex items-center mb-6">
                    <div className="bg-white px-4 py-2 rounded-full font-bold text-lg mr-4 shadow-lg" style={{color: '#004aad'}}>
                      Day 2
                    </div>
                    <h3 className="text-2xl font-bold text-white drop-shadow-lg">Turning Knowledge Into Action</h3>
                  </div>

                  <div className="text-white/90 mb-4">
                    <ul className="text-white/80 space-y-2 text-sm">
                      <li>• Real-world AI Use Cases that anyone can apply</li>
                      <li>• Hands-on practice with AI Tools for different purposes (business, content, productivity, etc.)</li>
                      <li>• Building Your First AI Agent — step into the future of work by creating an assistant that runs on autopilot</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <Button
                onClick={() => {
                  document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="crisp-gradient text-white font-bold py-4 px-12 rounded-full text-xl transition-all duration-300 transform hover:scale-105 mb-4"
              >
                Join The Challenge Now!
              </Button>
            </div>
          </div>
        </div>

        {/* Final Call to Action */}
        <div className="bg-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Join the challenge for free and get live access to all classes from the 13th to the 14th of September.
            </h2>
            <Button
              onClick={() => {
                document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="crisp-gradient text-white font-bold py-4 px-12 rounded-full text-xl transition-all duration-300 transform hover:scale-105 mb-4"
            >
              Claim My Free Spot
            </Button>
            <p className="text-gray-600 text-lg">(Limited seats. Don't wait!)</p>
          </div>
        </div>

        {/* Bonuses Section */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                We're also giving away 3 INSANE bonuses worth over $2,000 to people who actually show up.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Bonus 1 */}
              <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">3000+ High-Impact AI Prompts</h3>
                <p className="text-gray-600">
                  Supercharge your content, marketing, sales, and operations with over 3,000 plug-and-play ChatGPT prompts.
                </p>
              </div>

              {/* Bonus 2 */}
              <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">100 Real-Life AI Use Cases</h3>
                <p className="text-gray-600">
                  See exactly how entrepreneurs, coaches, and service providers are using AI to save time, increase revenue, and scale their businesses so you can do the same.
                </p>
              </div>

              {/* Bonus 3 */}
              <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                <div className="text-4xl mb-4">⚙</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">200+ AI Tools You Can Start Using Today</h3>
                <p className="text-gray-600">
                  We've tested and handpicked 200+ powerful AI tools for everything from content creation and automation to client onboarding and lead generation and you can get them all free!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
              What People Are Saying About The AI Elevate Challenge
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <p className="text-gray-700 italic mb-4">
                  "Hi Ucheoma, for 3 days you wowed me. I am very proud of you. As we speak, I am rewatching the presentation. I just started rewatching. Please don't stop. You make me proud. I mean very very proud."
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <p className="text-gray-700 italic mb-4">
                  "It was marvelous, mind blowing, fantastic. I want to use manus. I have papers that need to be completed soon."
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <p className="text-gray-700 italic mb-4">
                  "Thank you for the insightful sessions in the just concluded challenge. It was indeed an eye opener and mind-blowing session"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>

            <div className="space-y-8">
              <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Do I need experience with AI?</h3>
                <p className="text-gray-600">Nope. Everything is beginner-friendly and broken down step by step.</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-3">What if I can't attend live?</h3>
                <p className="text-gray-600">You get access to replays and bonus templates after the event.</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Are the sessions beginner friendly?</h3>
                <p className="text-gray-600">Yes. We'll hold your hands every step of the way walk you through building your own AI tools live including a chatbot, support agent, and lead gen flow.</p>
              </div>
            </div>

            <div className="text-center mt-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Questions?</h3>
              <p className="text-gray-600 mb-6">
                Send us an email at{" "}
                <a href="mailto:info@crispai.com" className="text-blue-600 underline">
                  info@crispai.com
                </a>{" "}
                or send a DM on{" "}
                <a
                  href="https://www.instagram.com/crisp__ai?igsh=YmZzbXR4dWZ3cmFl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Instagram
                </a>{" "}
                or{" "}
                <a
                  href="https://web.facebook.com/profile.php?id=61574978744885"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Facebook
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4" style={{background: 'linear-gradient(135deg, #17abe8, #004aad)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}>
                AI Elevate Challenge 2025
              </h3>
              <p className="text-gray-400 mb-6">
                Master AI with Dr. Uche Udoha • September 13-14, 2025 • Virtual Event
              </p>
              <p className="text-gray-400 mb-6">
                Questions? Email us at <a href="mailto:info@crispai.com" style={{color: '#17abe8'}} className="hover:opacity-80">info@crispai.com</a>
              </p>
              <div className="flex justify-center space-x-6">
                <a 
                  href="https://www.instagram.com/crisp__ai?igsh=YmZzbXR4dWZ3cmFl" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a 
                  href="https://web.facebook.com/profile.php?id=61574978744885" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}