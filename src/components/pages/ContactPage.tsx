'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSending(true);
    // Simulate sending
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSending(false);
    setSent(true);
    toast.success('Message sent successfully!');
    setForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-slide-in">
      <div className="text-center mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Contact Us
        </h1>
        <p className="text-gray-500 max-w-md mx-auto">
          Have a question or need help? We&apos;d love to hear from you. Send us a
          message and we&apos;ll respond as soon as possible.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <Card className="border-0 shadow-sm rounded-xl">
            <CardContent className="p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#F0FDFA] flex items-center justify-center shrink-0">
                <MapPin className="h-5 w-5 text-[#0F766E]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">
                  Visit Us
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Shop #12, Al-Fatah Market,
                  <br />
                  Main Boulevard, Gulberg III,
                  <br />
                  Lahore, Pakistan
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm rounded-xl">
            <CardContent className="p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#F0FDFA] flex items-center justify-center shrink-0">
                <Phone className="h-5 w-5 text-[#0F766E]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">
                  Call Us
                </h3>
                <p className="text-sm text-gray-600">+92 300 1234567</p>
                <p className="text-sm text-gray-600">+92 42 35761234</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm rounded-xl">
            <CardContent className="p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#F0FDFA] flex items-center justify-center shrink-0">
                <Mail className="h-5 w-5 text-[#0F766E]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">
                  Email Us
                </h3>
                <p className="text-sm text-gray-600">info@zamanastore.pk</p>
                <p className="text-sm text-gray-600">support@zamanastore.pk</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm rounded-xl">
            <CardContent className="p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#F0FDFA] flex items-center justify-center shrink-0">
                <Clock className="h-5 w-5 text-[#0F766E]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">
                  Business Hours
                </h3>
                <p className="text-sm text-gray-600">Mon - Sat: 10:00 AM - 8:00 PM</p>
                <p className="text-sm text-gray-600">Sunday: 2:00 PM - 6:00 PM</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2"
        >
          <Card className="border-0 shadow-sm rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg">Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name">
                      Name <span className="text-[#0F766E]">*</span>
                    </Label>
                    <Input
                      id="contact-name"
                      value={form.name}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, name: e.target.value }))
                      }
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">
                      Email <span className="text-[#0F766E]">*</span>
                    </Label>
                    <Input
                      id="contact-email"
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, email: e.target.value }))
                      }
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-subject">Subject</Label>
                  <Input
                    id="contact-subject"
                    value={form.subject}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, subject: e.target.value }))
                    }
                    placeholder="What is this about?"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-message">
                    Message <span className="text-[#0F766E]">*</span>
                  </Label>
                  <textarea
                    id="contact-message"
                    value={form.message}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, message: e.target.value }))
                    }
                    placeholder="Write your message here..."
                    rows={6}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="bg-[#0F766E] hover:bg-[#0D6560] text-white"
                  disabled={sending}
                >
                  {sending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : sent ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Message Sent!
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Map Placeholder */}
          <Card className="border-0 shadow-sm mt-4 overflow-hidden rounded-xl">
            <div className="h-48 bg-gray-100 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">
                  Map - Gulberg III, Lahore
                </p>
                <p className="text-xs text-gray-300 mt-1">
                  Al-Fatah Market, Main Boulevard
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
