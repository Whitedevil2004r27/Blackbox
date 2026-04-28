'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const steps = [
  { id: 1, title: 'Role Selection', description: 'Choose your primary role' },
  { id: 2, title: 'Skills', description: 'Select your skills' },
  { id: 3, title: 'Profile', description: 'Set up your profile' },
  { id: 4, title: 'Portfolio', description: 'Add portfolio items' },
  { id: 5, title: 'Payments', description: 'Connect Stripe' },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push('/dashboard');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-void">
      <div className="w-full max-w-2xl p-8 space-y-8 bg-surface/80 backdrop-blur-xl rounded-2xl border border-border">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-star-gold">Welcome to FreelanceX</h1>
          <p className="mt-2 text-text-secondary">Let's set up your account</p>
        </div>

        {/* Progress bar */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step.id <= currentStep
                    ? 'bg-cyan text-void'
                    : 'bg-void border border-border text-text-muted'
                }`}
              >
                {step.id}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 h-0.5 mx-2 ${
                    step.id < currentStep ? 'bg-cyan' : 'bg-border'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="py-8">
          {currentStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-text-primary">What brings you to FreelanceX?</h2>
              <div className="grid grid-cols-2 gap-4">
                <button className="p-6 border border-border rounded-xl hover:border-cyan transition-colors text-left">
                  <h3 className="font-semibold text-text-primary">I want to work</h3>
                  <p className="text-sm text-text-secondary mt-1">Find projects and get hired</p>
                </button>
                <button className="p-6 border border-border rounded-xl hover:border-cyan transition-colors text-left">
                  <h3 className="font-semibold text-text-primary">I want to hire</h3>
                  <p className="text-sm text-text-secondary mt-1">Post projects and find talent</p>
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-text-primary">Select your skills</h2>
              <div className="flex flex-wrap gap-2">
                {['React', 'TypeScript', 'Node.js', 'Python', 'Design', 'Writing', 'Marketing', 'Video'].map((skill) => (
                  <button
                    key={skill}
                    className="px-4 py-2 border border-border rounded-lg hover:border-cyan hover:bg-cyan/10 transition-colors text-text-secondary"
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-text-primary">Complete your profile</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-4 py-3 bg-void border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan text-text-primary"
                />
                <textarea
                  placeholder="Bio"
                  rows={4}
                  className="w-full px-4 py-3 bg-void border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan text-text-primary"
                />
                <input
                  type="text"
                  placeholder="Hourly Rate ($)"
                  className="w-full px-4 py-3 bg-void border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan text-text-primary"
                />
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-text-primary">Add portfolio items</h2>
              <div className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-cyan transition-colors">
                <p className="text-text-secondary">Drag and drop files here, or click to browse</p>
                <button className="mt-4 px-6 py-2 bg-cyan text-void rounded-lg font-medium">
                  Upload Files
                </button>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-text-primary">Connect Stripe for payments</h2>
              <p className="text-text-secondary">Set up your Stripe Connect account to receive payments</p>
              <button className="w-full py-3 bg-[#635BFF] text-white rounded-lg font-semibold hover:bg-[#635BFF]/90 transition-colors">
                Connect with Stripe
              </button>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="px-6 py-2 border border-border rounded-lg text-text-secondary hover:bg-void disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-cyan text-void rounded-lg font-semibold hover:bg-cyan/90 transition-colors"
          >
            {currentStep === steps.length ? 'Complete' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
