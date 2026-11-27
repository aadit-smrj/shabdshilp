import React from 'react';
import { ShieldAlert, RotateCcw } from 'lucide-react';
import { activeFirebaseConfig as firebaseConfig } from '../utils/firebase';

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
  isQuotaError: boolean;
  isFreeDailyReadQuota: boolean;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: '',
      isQuotaError: false,
      isFreeDailyReadQuota: false,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    const msg = error?.message || String(error);
    const isQuotaError = msg.toLowerCase().includes('quota exceeded');
    const isFreeDailyReadQuota = msg.includes('Free daily read units per project');
    return {
      hasError: true,
      errorMessage: msg,
      isQuotaError,
      isFreeDailyReadQuota,
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Application ErrorBoundary caught:', error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const upgradeUrl = `https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore/databases/${firebaseConfig.firestoreDatabaseId || '(default)'}/data?openUpgradeDialog=true`;

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-white rounded-3xl border border-rose-200 shadow-xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">
                {this.state.isQuotaError
                  ? 'डेटाबेस उपयोग सीमा पूर्ण (Database Quota Exceeded)'
                  : 'अस्थायी त्रुटि उत्पन्न हुई (Something went wrong)'}
              </h2>
              <p className="text-xs text-slate-500">
                शब्दशिल्प (ShabdShilp) • सुरक्षित पुनर्प्राप्ति
              </p>
            </div>
          </div>

          {this.state.isQuotaError ? (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2 leading-relaxed">
              <p className="font-bold">
                दैनिक मुफ्त Firestore सीमा समाप्त हो गई है। यह सीमा अगले दिन स्वतः रीसेट हो जाएगी।
              </p>
              <p>
                Daily free-tier Firestore quota has been reached. Quota resets the next day. Details are available under the Spark plan (Enterprise edition) on{' '}
                <a
                  href="https://firebase.google.com/pricing#cloud-firestore"
                  target="_blank"
                  rel="noreferrer"
                  className="underline font-bold text-indigo-700"
                >
                  Firebase Pricing
                </a>
                .
              </p>
              {this.state.isFreeDailyReadQuota && (
                <p>
                  <a
                    href={upgradeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="underline font-bold text-indigo-700"
                  >
                    Open Database Upgrade Console
                  </a>
                </p>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 break-words">
              कृपया पृष्ठ को पुनः लोड करें अथवा पुनः साइन-इन करें।
            </div>
          )}

          <button
            type="button"
            onClick={this.handleReload}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>पुनः प्रयास करें (Reload App)</span>
          </button>
        </div>
      </div>
    );
  }
}
