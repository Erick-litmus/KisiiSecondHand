"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare, Loader2, CheckCircle2 } from "lucide-react";
import { sendContactMessage } from "@/lib/actions/support";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await sendContactMessage(formData);

    if (result.success) {
      setIsSuccess(true);
      e.currentTarget.reset();
    } else {
      setError(result.error || "Something went wrong");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div>
          <h1 className="text-5xl font-black mb-6">Get in Touch</h1>
          <p className="text-xl text-slate-500 mb-12 leading-relaxed">
            Have a question, feedback, or need help? Reach out to our campus support team.
          </p>

          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Our Location</h3>
                <p className="text-slate-500">Main Campus, Kisii University</p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Email Us</h3>
                <p className="text-slate-500">support@kisiimarket.com<br />erickmutua150@gmail.com</p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Call Us</h3>
                <p className="text-slate-500">0706546644<br />Mon - Fri, 8:00 AM - 5:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[60px] rounded-full -mr-16 -mt-16" />
          
          {isSuccess ? (
            <div className="py-12 text-center animate-in zoom-in duration-500">
              <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center shadow-xl shadow-emerald-500/20 mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-black text-slate-800 mb-4">Message Sent!</h2>
              <p className="text-slate-500 font-medium mb-8">
                Thank you for reaching out. Our team will get back to you within 24 hours.
              </p>
              <button 
                onClick={() => setIsSuccess(false)}
                className="text-emerald-600 font-bold hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-8 text-slate-800">Send us a Message</h2>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Full Name</label>
                    <input name="name" required type="text" placeholder="John Doe" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-slate-800 placeholder:text-slate-400" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Email Address</label>
                    <input name="email" required type="email" placeholder="john@example.com" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-slate-800 placeholder:text-slate-400" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Subject</label>
                  <select name="subject" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all appearance-none text-slate-800">
                    <option>General Inquiry</option>
                    <option>Technical Issue</option>
                    <option>Report a Seller</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Message</label>
                  <textarea name="message" required rows={5} placeholder="How can we help you?" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none text-slate-800 placeholder:text-slate-400"></textarea>
                </div>

                {error && (
                  <div className="p-4 bg-rose-50 text-rose-500 text-sm font-bold rounded-xl border border-rose-100">
                    {error}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                   {isSubmitting ? (
                     <Loader2 className="w-6 h-6 animate-spin" />
                   ) : (
                     <>Send Message <Send className="w-5 h-5" /></>
                   )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
      
      {/* Social Support */}
      <div className="mt-24 text-center">
         <h2 className="text-2xl font-bold mb-8 text-slate-800">Connect with us on Social</h2>
         <div className="flex flex-wrap justify-center gap-6">
            <button className="flex items-center gap-3 bg-white border border-slate-100 px-8 py-4 rounded-2xl hover:border-emerald-300 transition-all group shadow-sm">
               <MessageSquare className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
               <span className="font-bold text-slate-700">WhatsApp Community</span>
            </button>
            <button className="flex items-center gap-3 bg-white border border-slate-100 px-8 py-4 rounded-2xl hover:border-emerald-300 transition-all group shadow-sm">
               <Send className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
               <span className="font-bold text-slate-700">Telegram Support</span>
            </button>
         </div>
      </div>
    </div>
  );
}
