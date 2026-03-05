/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, 
  Search, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Info, 
  Activity,
  ShieldAlert,
  History,
  Trash2,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { analyzeSymptoms, DiagnosisResult } from './services/geminiService';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface HistoryItem {
  id: string;
  symptoms: string;
  result: DiagnosisResult;
  timestamp: number;
}

import ArchitectureView from './components/ArchitectureView';

export default function App() {
  const [activeTab, setActiveTab] = useState<'diagnosis' | 'architecture'>('diagnosis');
  const [symptoms, setSymptoms] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const savedHistory = localStorage.getItem('diagnosis_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  const saveToHistory = (symptoms: string, result: DiagnosisResult) => {
    const newItem: HistoryItem = {
      id: Math.random().toString(36).substring(7),
      symptoms,
      result,
      timestamp: Date.now(),
    };
    const updatedHistory = [newItem, ...history].slice(0, 10);
    setHistory(updatedHistory);
    localStorage.setItem('diagnosis_history', JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('diagnosis_history');
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const diagnosis = await analyzeSymptoms(symptoms);
      setResult(diagnosis);
      saveToHistory(symptoms, diagnosis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Emergency': return 'text-red-600 bg-red-50 border-red-200';
      case 'Urgent': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <Stethoscope className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">MediSense AI</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Healthcare Diagnosis</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex bg-slate-100 p-1 rounded-xl mr-4">
              <button 
                onClick={() => setActiveTab('diagnosis')}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                  activeTab === 'diagnosis' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                Diagnosis
              </button>
              <button 
                onClick={() => setActiveTab('architecture')}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                  activeTab === 'architecture' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                Architecture
              </button>
            </nav>
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors relative"
              title="History"
            >
              <History className="w-5 h-5 text-slate-600" />
              {history.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full border-2 border-white" />
              )}
            </button>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium">System Online</span>
              <button 
                onClick={async () => {
                  try {
                    const res = await fetch('/api/health');
                    const data = await res.json();
                    alert(`Server Health: ${data.status} at ${data.timestamp}`);
                  } catch (e) {
                    alert(`Server Unreachable: ${e}`);
                  }
                }}
                className="ml-2 text-[10px] underline opacity-50 hover:opacity-100"
              >
                Check
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <AnimatePresence mode="wait">
          {activeTab === 'diagnosis' ? (
            <motion.div
              key="diagnosis-tab"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Input & Info */}
                <div className="lg:col-span-5 space-y-8">
                  <section>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">
                      How are you <span className="text-blue-600">feeling</span> today?
                    </h2>
                    <p className="text-slate-600 leading-relaxed mb-6">
                      Describe your symptoms in detail. Our AI will analyze them to provide guidance and possible next steps.
                    </p>

                    <form onSubmit={handleAnalyze} className="space-y-4">
                      <div className="relative group">
                        <textarea
                          value={symptoms}
                          onChange={(e) => setSymptoms(e.target.value)}
                          placeholder="e.g., I have a sharp pain in my lower back and a mild fever since yesterday..."
                          className="w-full h-40 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none text-slate-700 placeholder:text-slate-400"
                        />
                        <div className="absolute bottom-4 right-4 flex items-center gap-2 text-xs text-slate-400">
                          <Info className="w-3 h-3" />
                          <span>Be as specific as possible</span>
                        </div>
                      </div>
                      
                      <button
                        type="submit"
                        disabled={isLoading || !symptoms.trim()}
                        className={cn(
                          "w-full py-4 px-6 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg",
                          isLoading || !symptoms.trim() 
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                            : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-200 active:scale-[0.98]"
                        )}
                      >
                        {isLoading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Analyzing Symptoms...</span>
                          </>
                        ) : (
                          <>
                            <Activity className="w-5 h-5" />
                            <span>Start Diagnosis</span>
                          </>
                        )}
                      </button>
                    </form>
                  </section>

                  {/* Disclaimer Card */}
                  <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex gap-4">
                    <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0" />
                    <div className="space-y-1">
                      <h4 className="font-bold text-amber-900 text-sm">Medical Disclaimer</h4>
                      <p className="text-xs text-amber-800/80 leading-relaxed">
                        This tool is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column: Results & History */}
                <div className="lg:col-span-7">
                  <AnimatePresence mode="wait">
                    {showHistory ? (
                      <motion.div
                        key="history"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm min-h-[500px]"
                      >
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-xl font-bold flex items-center gap-2">
                            <History className="w-5 h-5 text-blue-600" />
                            Recent Checks
                          </h3>
                          {history.length > 0 && (
                            <button 
                              onClick={clearHistory}
                              className="text-xs text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" />
                              Clear All
                            </button>
                          )}
                        </div>

                        {history.length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                            <Clock className="w-12 h-12 mb-4 opacity-20" />
                            <p>No recent diagnosis history</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {history.map((item) => (
                              <button
                                key={item.id}
                                onClick={() => {
                                  setResult(item.result);
                                  setSymptoms(item.symptoms);
                                  setShowHistory(false);
                                }}
                                className="w-full text-left p-4 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group"
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    {new Date(item.timestamp).toLocaleDateString()} at {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                  <span className={cn(
                                    "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase",
                                    getUrgencyColor(item.result.urgency)
                                  )}>
                                    {item.result.urgency}
                                  </span>
                                </div>
                                <p className="text-sm font-medium text-slate-700 line-clamp-1 mb-1">{item.symptoms}</p>
                                <div className="flex items-center gap-2 text-xs text-blue-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                                  View details <ChevronRight className="w-3 h-3" />
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    ) : result ? (
                      <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6"
                      >
                        {/* Urgency Banner */}
                        <div className={cn(
                          "p-4 rounded-2xl border flex items-center justify-between",
                          getUrgencyColor(result.urgency)
                        )}>
                          <div className="flex items-center gap-3">
                            <AlertCircle className="w-5 h-5" />
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Assessment Urgency</p>
                              <p className="font-bold">{result.urgency}</p>
                            </div>
                          </div>
                          {result.urgency === 'Emergency' && (
                            <div className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-bold animate-pulse">
                              CALL 911 IMMEDIATELY
                            </div>
                          )}
                        </div>

                        {/* Possible Conditions */}
                        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-blue-600" />
                            Possible Conditions
                          </h3>
                          <div className="space-y-4">
                            {result.possibleConditions.map((condition, idx) => (
                              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-bold text-slate-900">{condition.name}</h4>
                                  <span className={cn(
                                    "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase",
                                    condition.likelihood === 'High' ? 'bg-red-100 text-red-700' :
                                    condition.likelihood === 'Moderate' ? 'bg-orange-100 text-orange-700' :
                                    'bg-blue-100 text-blue-700'
                                  )}>
                                    {condition.likelihood} Likelihood
                                  </span>
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed">{condition.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Precautions & Advice */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                              <ShieldAlert className="w-5 h-5 text-emerald-600" />
                              Precautions
                            </h3>
                            <ul className="space-y-3">
                              {result.precautions.map((item, idx) => (
                                <li key={idx} className="flex gap-3 text-sm text-slate-600">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                              <Info className="w-5 h-5 text-blue-600" />
                              General Advice
                            </h3>
                            <p className="text-sm text-slate-600 leading-relaxed italic">
                              "{result.advice}"
                            </p>
                            <div className="mt-4 pt-4 border-t border-slate-100">
                              <button 
                                onClick={() => window.print()}
                                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                              >
                                Save as PDF <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ) : error ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-red-50 border border-red-100 rounded-3xl p-12 text-center space-y-4"
                      >
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                          <AlertCircle className="text-red-600 w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-red-900">Analysis Failed</h3>
                        <p className="text-red-800/70 max-w-xs mx-auto">{error}</p>
                        <button 
                          onClick={() => setError(null)}
                          className="px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors"
                        >
                          Try Again
                        </button>
                      </motion.div>
                    ) : (
                      <div className="bg-white border border-slate-200 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-center space-y-4 min-h-[500px]">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                          <Search className="text-slate-300 w-10 h-10" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-900">Ready to Analyze</h3>
                          <p className="text-slate-500 max-w-xs mx-auto mt-2">
                            Enter your symptoms on the left to receive an AI-powered health assessment.
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 w-full max-w-sm mt-8">
                          {['Fever', 'Cough', 'Headache', 'Pain'].map(tag => (
                            <button
                              key={tag}
                              onClick={() => setSymptoms(prev => prev ? `${prev}, ${tag}` : tag)}
                              className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold text-slate-600 hover:bg-blue-50 hover:border-blue-100 hover:text-blue-600 transition-all"
                            >
                              + {tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="architecture-tab"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <ArchitectureView />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 mt-12">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 opacity-50">
            <Stethoscope className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">MediSense AI v1.0</span>
          </div>
          <div className="flex gap-6 text-xs font-medium text-slate-500">
            <a href="#" className="hover:text-blue-600">Privacy Policy</a>
            <a href="#" className="hover:text-blue-600">Terms of Service</a>
            <a href="#" className="hover:text-blue-600">Contact Support</a>
          </div>
          <p className="text-[10px] text-slate-400">© 2026 AI Healthcare Diagnosis System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
