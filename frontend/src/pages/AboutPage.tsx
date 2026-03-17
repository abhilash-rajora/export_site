import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { ArrowRight, Award, CheckCircle2, Globe, TrendingUp, Users } from 'lucide-react';
import { motion } from "framer-motion";

const milestones = [
  { year: '2008', title: 'Founded', desc: 'WeExports was established with a mission to connect quality products with international buyers.' },
  { year: '2012', title: 'ISO Certified', desc: 'Received ISO 9001 certification for quality management in export operations.' },
  { year: '2016', title: '25 Countries', desc: 'Expanded our network to serve buyers in 25 countries across Asia, Europe, and the Americas.' },
  { year: '2020', title: 'Digital Transformation', desc: 'Launched our digital platform to streamline enquiries, orders, and tracking.' },
  { year: '2024', title: '50+ Countries', desc: 'Today we serve over 50 countries with 200+ product lines across 6 major categories.' },
];


const values = [
  { icon: Award, title: 'Quality First', desc: 'Every product meets international quality standards before export.' },
  { icon: Globe, title: 'Global Network', desc: 'Strong partnerships with suppliers and logistics providers worldwide.' },
  { icon: Users, title: 'Client Focus', desc: 'Dedicated account managers ensure your requirements are always met.' },
  { icon: TrendingUp, title: 'Transparent Pricing', desc: 'Clear pricing with no hidden costs, from product to destination port.' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white ">
      <div className="bg-navy-900 text-white pt-28 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-gold-400 font-semibold text-lg uppercase tracking-widest mb-3">About Us</p>
            <h1 className="font-display text-5xl font-extrabold tracking-tight leading-tight mb-6">
              Building Bridges<br /><span className="text-gold-400">Across Borders</span>
            </h1>
            <p className="text-white/65 text-xl leading-relaxed max-w-2xl">
              For over 15 years, WeExports has been the trusted export partner for businesses worldwide.
            </p>
          </motion.div>
        </div>
      </div>

      <section id="about-solid-trigger" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="font-display text-4xl font-extrabold text-foreground tracking-tight mb-5">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed text-lg mb-6">
                We exist to make global trade accessible, reliable, and profitable for businesses of all sizes.
              </p>
              <div className="mt-8 space-y-3">
                {['End-to-end export management', 'Customs documentation & compliance', 'Quality inspection before shipping', 'Dedicated account management'].map((point) => (
                  <div key={point} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-gold-500 flex-shrink-0" />
                    <span className="text-foreground font-medium">{point}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-navy-900 rounded-2xl p-8 text-white">
              <h3 className="font-display font-bold text-xl text-white mb-6">Certifications & Memberships</h3>
              <div className="space-y-3">
                {['ISO 9001:2015 Quality Management', 'HACCP Certified for Food Products', 'Fair Trade Certified Partner', 'Chamber of Commerce Member', 'International Trade Association'].map((cert) => (
                  <div key={cert} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-gold-400 flex-shrink-0" />
                    <span className="text-white/80 text-sm">{cert}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 gap-4">
                {[{ v: '15+', l: 'Years Active' }, { v: '50+', l: 'Countries' }, { v: '200+', l: 'Products' }, { v: '1000+', l: 'Happy Clients' }].map((s) => (
                  <div key={s.l} className="text-center">
                    <div className="font-display text-3xl font-extrabold text-gold-400">{s.v}</div>
                    <div className="text-white/50 text-xs mt-1">{s.l}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="font-display text-4xl font-extrabold text-foreground tracking-tight">Our Core Values</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <motion.div key={value.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-card rounded-xl border border-border p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-gold-500/15 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-6 h-6 text-gold-600" />
                </div>
                <h3 className="font-display font-bold text-lg text-foreground mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="font-display text-4xl font-extrabold text-foreground tracking-tight">Our Journey</h2>
          </motion.div>
          <div className="relative">
            <div className="absolute left-[76px] top-0 bottom-0 w-px bg-border hidden sm:block" />
            <div className="space-y-8">
              {milestones.map((m, i) => (
                <motion.div key={m.year} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-16 text-right">
                    <span className="font-display font-bold text-gold-600 text-sm">{m.year}</span>
                  </div>
                  <div className="relative hidden sm:flex items-center justify-center flex-shrink-0">
                    <div className="w-4 h-4 rounded-full bg-gold-500 border-2 border-background shadow-gold" />
                  </div>
                  <div className="flex-1 pb-8">
                    <h3 className="font-display font-bold text-lg text-foreground">{m.title}</h3>
                    <p className="text-muted-foreground text-sm mt-1 leading-relaxed">{m.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="about-transparent-trigger" className="py-20 bg-navy-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-display text-4xl font-extrabold text-white tracking-tight mb-4">Ready to Work Together?</h2>
            <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto">Let's discuss your import needs and find the perfect products for your market.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/products">
                <Button size="lg" className="bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold px-8">
                  Browse Products <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/enquiry">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8">Contact Us</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}