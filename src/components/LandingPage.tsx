import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AudioWaveform as Waveform,
  Music2,
  Brain,
  Download,
  Share2,
  LineChart,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  MessageCircle,
  CheckCircle2,
  HelpCircle,
  Plus,
  ChevronDown,
  ChevronUp,
  Linkedin,
  Sparkles,
  Users,
  Infinity,
  Check,
  Star,
} from 'lucide-react';

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]">
      <div className="w-12 h-12 mb-4 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

function LandingPage() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactStatus, setContactStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleGetStarted = () => {
    navigate('/auth');
  };

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setContactSubmitting(true);
    setContactStatus('idle');

    try {
      const response = await fetch('https://formspree.io/f/xlgwonjn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          message: contactMessage,
        }),
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      setContactStatus('success');
      setContactName('');
      setContactEmail('');
      setContactMessage('');
    } catch (_error) {
      setContactStatus('error');
    } finally {
      setContactSubmitting(false);
    }
  };

  const faqs = [
    {
      question: 'What is MELVA?',
      answer:
        'MELVA is an AI-powered music assistant that helps musicians break creative blocks, analyze music patterns, and generate unique beats. It combines advanced AI technology with musical expertise to enhance your creative process.',
    },
    {
      question: 'How does the free trial work?',
      answer:
        "Our 14-day free trial gives you full access to all Premium features. No credit card required. You can explore all of MELVA's capabilities and decide which plan works best for you.",
    },
    {
      question: 'Can I cancel my subscription anytime?',
      answer:
        "Yes, you can cancel your subscription at any time. If you cancel, you'll continue to have access to your plan's features until the end of your current billing period.",
    },
    {
      question: 'What makes MELVA different from other AI music tools?',
      answer:
        "MELVA combines advanced AI with a deep understanding of music theory and composition. It's designed to work alongside you, enhancing your creative process rather than replacing it.",
    },
    {
      question: 'Do I need any musical experience to use MELVA?',
      answer:
        "No, MELVA is designed for musicians of all skill levels. Whether you're a beginner or a professional, our AI adapts to your skill level and helps you grow.",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10" />

        <div className="relative z-10 text-center px-4">
          <div className="flex justify-center mb-8 animate-pulse">
            <Waveform size={64} className="text-blue-500" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            MELVA
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300">
            Compose. Create. Inspire
          </p>

          <p className="text-xl md:text-2xl mb-8 text-gray-300">
            Turn your ideas into music with AI-powered composition. No limits,
            just creativity!
          </p>
          <button
            onClick={handleGetStarted}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]"
          >
            Try MELVA Now
          </button>
        </div>
      </div>

      {/* About Section */}
      <div id="about" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1509528640600-094491356c72?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-5" />
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              Empowering Creativity with AI
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Break through creative blocks and explore new musical horizons
              with MELVA's AI-powered assistance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-300">
              <Sparkles className="w-12 h-12 text-blue-500 mb-6" />
              <h3 className="text-xl font-semibold mb-4">
                AI-Powered Innovation
              </h3>
              <p className="text-gray-400">
                Harness the power of advanced AI algorithms to enhance your
                musical creativity and explore new possibilities.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-300">
              <Users className="w-12 h-12 text-purple-500 mb-6" />
              <h3 className="text-xl font-semibold mb-4">Community-Driven</h3>
              <p className="text-gray-400">
                Join a vibrant community of musicians and creators, sharing
                insights and inspiration.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-300">
              <Infinity className="w-12 h-12 text-pink-500 mb-6" />
              <h3 className="text-xl font-semibold mb-4">
                Endless Possibilities
              </h3>
              <p className="text-gray-400">
                Unlock unlimited creative potential with our comprehensive suite
                of AI music tools.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="max-w-7xl mx-auto px-4 py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
          Revolutionize Your Music Creation
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Music2 className="text-blue-500" />}
            title="AI-Powered Composition"
            description="Generate unique melodies, harmonies, and beats based on your preferences"
          />
          <FeatureCard
            icon={<Brain className="text-purple-500" />}
            title="Smart Pattern Analysis"
            description="Advanced AI algorithms analyze and understand musical patterns"
          />
          <FeatureCard
            icon={<Download className="text-green-500" />}
            title="Multiple Export Options"
            description="Download your creations in MP3, WAV, or MIDI formats"
          />
          <FeatureCard
            icon={<Share2 className="text-pink-500" />}
            title="Collaboration Tools"
            description="Share and collaborate on AI-generated music with others"
          />
          <FeatureCard
            icon={<LineChart className="text-yellow-500" />}
            title="Advanced Analytics"
            description="Get detailed insights into your musical compositions"
          />
          <FeatureCard
            icon={<Waveform className="text-red-500" />}
            title="Real-time Generation"
            description="Watch your music come to life as AI generates in real-time"
          />
        </div>
      </div>

      {/* Pricing Section */}
      <div
        id="pricing"
        className="py-24 bg-gradient-to-br from-gray-900 to-gray-800"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-300">
              Flexible pricing options to support your creative journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="bg-gray-900 rounded-xl p-8 border border-gray-700">
              <h3 className="text-2xl font-bold mb-4">Free</h3>
              <p className="text-4xl font-bold mb-6">
                Rs 0<span className="text-lg text-gray-400">/mo</span>
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Basic AI features</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>5 AI generations per day</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Community access</span>
                </li>
              </ul>
              <button
                onClick={handleGetStarted}
                className="w-full px-6 py-3 bg-gray-800 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
              >
                Get Started
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-gray-900 rounded-xl p-8 border border-gray-700">
              <h3 className="text-2xl font-bold mb-4">Pro</h3>
              <p className="text-4xl font-bold mb-6">
                Rs 457<span className="text-lg text-gray-400">/mo</span>
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Advanced AI tools</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Unlimited generations</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Priority support</span>
                </li>
              </ul>
              <button
                onClick={handleGetStarted}
                className="w-full px-6 py-3 bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Start Pro Trial
              </button>
            </div>

            {/* Premium Plan */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-8 border border-blue-400/30 transform hover:scale-105 transition-transform">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-2xl font-bold">Premium</h3>
                <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              </div>
              <p className="text-4xl font-bold mb-6">
                Rs 1400<span className="text-lg text-gray-200">/mo</span>
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-white" />
                  <span>Custom AI music recommendations</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-white" />
                  <span>Unlimited beat generation & advanced features</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-white" />
                  <span>Full analysis with detailed feedback</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-white" />
                  <span>50-Track Storage</span>
                </li>
              </ul>
              <button
                onClick={handleGetStarted}
                className="w-full px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Get Premium
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div id="faq" className="py-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-300">
              Everything you need to know about MELVA
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl border border-gray-700"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left"
                >
                  <span className="font-semibold">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4 text-gray-400">{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div
        id="contact"
        className="py-24 bg-gradient-to-br from-gray-900 to-gray-800"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              Get in Touch with MELVA
            </h2>
            <p className="text-xl text-gray-300">We'd love to hear from you</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <form
                className="space-y-6"
                action="https://formspree.io/f/xlgwonjn"
                method="POST"
                onSubmit={handleContactSubmit}
              >
                <div>
                  <label className="block text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Message</label>
                  <textarea
                    name="message"
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                    rows={4}
                    placeholder="Your message..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={contactSubmitting}
                  className="w-full px-6 py-3 bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {contactSubmitting ? 'Sending...' : 'Send Message'}
                </button>
                {contactStatus === 'success' && (
                  <p className="text-green-400 text-sm">Message has been sent.</p>
                )}
                {contactStatus === 'error' && (
                  <p className="text-red-400 text-sm">Failed to send message. Please try again.</p>
                )}
              </form>
            </div>

            <div>
              <div className="bg-gray-900 rounded-xl p-8 border border-gray-700">
                <h3 className="text-2xl font-semibold mb-6">Connect With Us</h3>
                <div className="space-y-4">
                  <a
                    href="mailto:support@melva.ai"
                    className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors"
                  >
                    <Mail className="w-6 h-6" />
                    support@melva.ai
                  </a>
                  <div className="flex gap-4">
                    <a
                      href="#"
                      className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
                    >
                      <Facebook className="w-6 h-6" />
                    </a>
                    <a
                      href="#"
                      className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
                    >
                      <Twitter className="w-6 h-6" />
                    </a>
                    <a
                      href="#"
                      className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
                    >
                      <Instagram className="w-6 h-6" />
                    </a>
                    <a
                      href="#"
                      className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
                    >
                      <Linkedin className="w-6 h-6" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 to-purple-900/50" />
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Ready to Transform Your Music Creation?
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Join thousands of musicians using MELVA to create unique
            compositions
          </p>
          <button
            onClick={handleGetStarted}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105"
          >
            Get Started Free
          </button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
