import React, { useState } from "react";
import SidebarUnique from "../SidebarUnique";

type Prediction = {
  class?: string;
  confidence?: number;
};

export default function ModelWithSidebar() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState<Prediction[] | null>(null);
  const [advice, setAdvice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
  }

  async function handleUpload() {
    setError(null);
    if (!file) {
      setError("Please select an image first.");
      return;
    }

    setLoading(true);
    setPredictions(null);
    setAdvice(null);

    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Server error: ${res.status} ${txt}`);
      }

      const data = await res.json();
      if (data.unknown_image) {
        setError(data.message || "Image not recognized by model.");
      } else {
        setPredictions(data.predictions || []);
        setAdvice(data.advice || null);
      }
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-[#F8FBF7]">
      <SidebarUnique />

      <main className="flex-1 p-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-green-800 mb-2">Disease Detection Model</h2>
            <p className="text-sm text-gray-600 mb-6">Upload a plant leaf image and the model will predict probable diseases and give recommendations.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-4 items-center justify-center border-2 border-dashed border-gray-200 rounded-lg p-6">
                <div className="w-48 h-48 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
                  {preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={preview} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-sm text-gray-400">Preview</div>
                  )}
                </div>
                <input type="file" accept="image/*" className="w-full" onChange={handleFileChange} />
                <button onClick={handleUpload} disabled={loading} className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md">
                  {loading ? "Analyzing..." : "Upload & Analyze"}
                </button>
                {error && <div className="text-sm text-red-600 mt-2">{error}</div>}
              </div>

              <div className="rounded-lg p-6 bg-gradient-to-b from-white to-green-50">
                <h3 className="font-semibold text-green-700">Results</h3>
                <div className="mt-4 text-sm text-gray-700">
                  {!predictions && !error && <p className="mb-2">No image analyzed yet. Upload an image to get started.</p>}

                  {predictions && (
                    <div className="space-y-3">
                      {predictions.map((p, idx) => (
                        <div key={idx} className="p-3 bg-white rounded-md border">
                          <div className="text-xs text-gray-500">Prediction</div>
                          <div className="flex items-center justify-between">
                            <div className="text-lg font-bold text-green-800">{p.class || "Unknown"}</div>
                            <div className="text-sm text-gray-600">{Math.round((p.confidence || 0) * 100)}%</div>
                          </div>
                        </div>
                      ))}

                      {advice && (
                        <div className="mt-2 p-3 bg-white rounded-md border">
                          <div className="text-xs text-gray-500">Recommendation</div>
                          <div className="text-sm text-gray-700 mt-1">{advice}</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
