import { BookOpen, Shield, Target, PieChart, Sparkles } from 'lucide-react';
import Accordion from '../../components/ui/Accordion';

export default function GuidePage() {
  return (
    <div className="page-container animate-fade-in max-w-5xl mx-auto space-y-8 pb-12">
      
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/20 rounded-2xl p-8 sm:p-12 text-center md:text-left flex flex-col md:flex-row items-center gap-8 shadow-glow">
        <div className="flex-1 space-y-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-text-primary tracking-tight">
            Platform Masterclass
          </h1>
          <p className="text-text-muted leading-relaxed text-lg max-w-xl">
            Welcome to the Smart Expense architecture. This system revolves around two core philosophies: <strong className="text-primary-light">Defending your wealth</strong> via Budgets, and playing <strong className="text-accent">Offense</strong> via Savings Goals.
          </p>
        </div>
        <div className="hidden md:flex w-32 h-32 bg-background rounded-full items-center justify-center border-4 border-surface shadow-2xl relative">
          <Sparkles className="w-12 h-12 text-warning animate-pulse" />
        </div>
      </div>

      {/* Quick Start Chronology */}
      <div className="bg-surface border border-border rounded-2xl p-6 md:p-8">
        <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Quick Start: Your First 5 Minutes
        </h2>
        
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-border before:via-border/50 before:to-transparent">
          
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-surface bg-primary text-white font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 shadow-glow">
              1
            </div>
            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] card bg-background p-5 outlineoutline-1 outline-transparent hover:outline-primary/50 transition-all cursor-default">
              <h3 className="font-bold text-text-primary mb-1">Create Your Categories First</h3>
              <p className="text-sm text-text-muted leading-relaxed">Head to <strong className="text-text-primary">Categories</strong>. The system needs to know where your money flows. Create buckets like "Salary" (Income) and "Groceries" (Expense).</p>
            </div>
          </div>

          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-surface bg-accent text-white font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 shadow-glow">
              2
            </div>
            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] card bg-background p-5 outlineoutline-1 outline-transparent hover:outline-accent/50 transition-all cursor-default">
              <h3 className="font-bold text-text-primary mb-1">Inject Capital (Add Income)</h3>
              <p className="text-sm text-text-muted leading-relaxed">Jump to <strong className="text-text-primary">Transactions</strong>. Log your starting bank balance or your monthly salary payload, mapping it to your new Income category.</p>
            </div>
          </div>

          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-surface bg-warning text-white font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 shadow-glow">
              3
            </div>
            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] card bg-background p-5 outlineoutline-1 outline-transparent hover:outline-warning/50 transition-all cursor-default">
              <h3 className="font-bold text-text-primary mb-1">Set Defensive Blockades</h3>
              <p className="text-sm text-text-muted leading-relaxed">Navigate to <strong className="text-text-primary">Budgets</strong>. Before you start spending, lock down hard spending caps for your high-risk expense categories (like "Dining Out").</p>
            </div>
          </div>

          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-surface bg-danger text-white font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 shadow-glow">
              4
            </div>
            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] card bg-background p-5 outlineoutline-1 outline-transparent hover:outline-danger/50 transition-all cursor-default">
              <h3 className="font-bold text-text-primary mb-1">Log Daily Expenses</h3>
              <p className="text-sm text-text-muted leading-relaxed">Back to <strong className="text-text-primary">Transactions</strong>. As you live your life, log your expenses mapped to their categories. Watch the progress tracks on the dashboard automatically compute the Math.</p>
            </div>
          </div>

        </div>
      </div>

      {/* The 4 Pillars */}
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-primary" />
          The Four Pillars
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Pillar 1 */}
          <div className="card hover:-translate-y-1 transition-transform duration-300 border-l-4 border-l-accent">
            <div className="w-12 h-12 bg-accent/20 text-accent rounded-lg flex items-center justify-center mb-4">
              <PieChart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">1. Smart Categorization</h3>
            <p className="text-sm text-text-muted leading-relaxed">
              Before tracking money, you must define where it goes. Use the Categories interface to map your financial buckets. You can securely assign any unicode Emoji to a category, and bind a native hexadecimal color to it. The Analytics engine natively reads these colors to paint your charts.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="card hover:-translate-y-1 transition-transform duration-300 border-l-4 border-l-primary">
            <div className="w-12 h-12 bg-primary/20 text-primary rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">2. Transaction Logging</h3>
            <p className="text-sm text-text-muted leading-relaxed">
              When navigating Transactions, rely on the Debounced filter bar to instantly sort data. Our ledger accepts <strong>multipart/form-data</strong> payloads, meaning you can flawlessly upload and attach digital receipts directly to any expense for tax-auditing purposes.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="card hover:-translate-y-1 transition-transform duration-300 border-l-4 border-l-danger">
            <div className="w-12 h-12 bg-danger/20 text-danger rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">3. Defensive Budgets</h3>
            <p className="text-sm text-text-muted leading-relaxed">
              Budgets are hard limits mapped strictly to Expense Categories. Once set, they quietly track your burn rate. Progress bars transition to <strong>Amber</strong> at 80% saturation, and critically flash <strong>Red</strong> when a limit is exceeded, triggering an automatic algorithmic alert in your Insights panel.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="card hover:-translate-y-1 transition-transform duration-300 border-l-4 border-l-[#3b82f6]">
            <div className="w-12 h-12 bg-[#3b82f6]/20 text-[#3b82f6] rounded-lg flex items-center justify-center mb-4">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">4. Goal Prediction Engine</h3>
            <p className="text-sm text-text-muted leading-relaxed">
              Don't just save — aim. Creating a Saving Goal boots up the prediction algorithm. By comparing your Target Amount against your Deadline Date, the interface calculates your required <strong>Average Daily Savings</strong> velocity. Deposit funds inline seamlessly without reloading the UI.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
          <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Frequently Asked Questions
        </h2>
        
        <div className="space-y-3">
          <Accordion title="How does the AI Insights engine actually work?">
            The prediction engine runs continuously alongside your dashboard mounting cycle. It actively analyzes your month-to-date (MTD) transaction burn-rates and mathematically projects whether your current trajectory will crash through your defined Budgets. If it detects a runway issue, it pushes a high-priority warning to the `/insights` control center.
          </Accordion>

          <Accordion title="What happens to my transactions if I delete an active Category?">
            Deleting a category does <strong>not</strong> wipe out the historical transactional data (your total spending math won't break). However, those transactions will become "orphaned" and will temporarily yield UI glitches (falling back to "Uncategorized" blocks) in the Analytics pie charts until they are remapped. We strongly advise pausing categories rather than destroying them structurally.
          </Accordion>

          <Accordion title="Are there limitations on uploading Receipt files?">
            Yes. The Node.js proxy server enforces standard `multer` parsing. Files are restricted strictly to image types (`.png`, `.jpg`, `.jpeg`) alongside standard `.pdf` digital invoices. There is functionally a 5MB payload size limit hardcoded into the backend to prevent malicious buffer overloads on your storage volume.
          </Accordion>

          <Accordion title="Is my financial data exported anywhere?">
            Absolutely not. This architecture respects zero-telemetry protocols. All your transactional calculations, analytical distributions, and database states remain tightly segregated inside your MongoDB instance. Aside from standard secure JSON Web Token authentications, your data does not leave your server ecosystem.
          </Accordion>
        </div>
      </div>

    </div>
  );
}
