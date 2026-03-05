import React from 'react';
import { 
  Network, 
  Cpu, 
  Database, 
  ShieldCheck, 
  Cloud, 
  Zap, 
  Settings, 
  BarChart3, 
  Lock, 
  Users,
  GitBranch,
  Terminal,
  Activity
} from 'lucide-react';
import { motion } from 'motion/react';

export default function ArchitectureView() {
  const sections = [
    {
      id: 1,
      title: "1. Overall System Architecture",
      icon: <Network className="w-6 h-6 text-blue-600" />,
      content: "A modern, cloud-native microservices architecture. It separates the user interface (Frontend) from the logic (Backend) and the intelligence (AI Engine). This allows each part to be updated or scaled independently without affecting the others."
    },
    {
      id: 2,
      title: "2. Main Components",
      icon: <Settings className="w-6 h-6 text-indigo-600" />,
      content: "• Frontend: React-based web app.\n• Backend API: Node.js/Express handling requests.\n• AI Engine: Gemini/Vertex AI for medical analysis.\n• Database: Secure storage for user profiles and history.\n• Integration Layer: Connects to external healthcare systems."
    },
    {
      id: 3,
      title: "3. Data Flow",
      icon: <Zap className="w-6 h-6 text-amber-600" />,
      content: "1. User enters symptoms.\n2. Frontend sends data to API via secure HTTPS.\n3. Backend validates and sanitizes input.\n4. AI Engine processes symptoms and returns structured diagnosis.\n5. Result is saved to DB and displayed to the user."
    },
    {
      id: 4,
      title: "4. AI Technologies (Deep Learning & Transformers)",
      icon: <Cpu className="w-6 h-6 text-purple-600" />,
      content: "We use Transformer models (like Gemini) which are excellent at understanding context in natural language. Deep Learning models are used to classify symptoms against vast medical datasets to predict conditions with high accuracy."
    },
    {
      id: 5,
      title: "5. Google APIs & Cloud Services",
      icon: <Cloud className="w-6 h-6 text-sky-600" />,
      content: "• Vertex AI: Hosts and manages the AI models.\n• Google Healthcare API: Ensures data follows medical standards (FHIR).\n• Cloud Run: Scalable hosting for our application logic.\n• Cloud SQL: Managed database for secure data storage."
    },
    {
      id: 6,
      title: "6. Role of Agentic AI",
      icon: <Terminal className="w-6 h-6 text-emerald-600" />,
      content: "Agentic AI acts as a 'smart assistant' that doesn't just answer but takes action. It can ask follow-up questions to clarify symptoms, search the latest medical journals, or even suggest booking an appointment based on urgency."
    },
    {
      id: 7,
      title: "7. DevOps Pipeline",
      icon: <GitBranch className="w-6 h-6 text-rose-600" />,
      content: "Automated CI/CD (Continuous Integration/Deployment). Every code change is automatically tested, built into a container (Docker), and deployed to the cloud. This ensures the app is always stable and up-to-date."
    },
    {
      id: 8,
      title: "8. MLOps Pipeline",
      icon: <BarChart3 className="w-6 h-6 text-orange-600" />,
      content: "MLOps focuses on the AI model's lifecycle. It automates re-training when new medical data arrives, tracks model performance (accuracy), and manages different versions of the AI to prevent 'model drift'."
    },
    {
      id: 9,
      title: "9. AIOps for Monitoring",
      icon: <Activity className="w-6 h-6 text-cyan-600" />,
      content: "AIOps uses AI to monitor the system itself. It can predict server failures before they happen, automatically scale resources during high traffic, and detect unusual patterns that might indicate a security threat."
    },
    {
      id: 10,
      title: "10. Security & Data Privacy",
      icon: <Lock className="w-6 h-6 text-slate-800" />,
      content: "Security is paramount. We implement HIPAA-compliant storage, end-to-end encryption (AES-256), and strict identity management (IAM). User data is anonymized before being used for any model improvements."
    },
    {
      id: 11,
      title: "11. Scaling for Many Users",
      icon: <Users className="w-6 h-6 text-violet-600" />,
      content: "The system scales horizontally. Using Load Balancers and Kubernetes, we can spin up hundreds of instances of the app in seconds to handle millions of users simultaneously across different global regions."
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-200">
        <h2 className="text-3xl font-bold mb-4">System Architecture Design</h2>
        <p className="text-blue-100 max-w-2xl leading-relaxed">
          A comprehensive blueprint for a production-grade AI Healthcare platform, designed for reliability, security, and global scale.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section, idx) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-slate-50 rounded-xl">
                {section.icon}
              </div>
              <h3 className="font-bold text-slate-900">{section.title}</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {section.content}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="bg-slate-900 text-white rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8">
        <div className="shrink-0">
          <ShieldCheck className="w-16 h-16 text-emerald-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold mb-2">Architect's Note on Implementation</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            In a real-world scenario, this architecture would be implemented using Google Cloud Platform (GCP). We would leverage GKE for orchestration, Vertex AI for model serving, and Cloud Armor for DDoS protection. The entire infrastructure would be managed as code (Terraform) to ensure reproducibility across dev, staging, and production environments.
          </p>
        </div>
      </div>
    </div>
  );
}
