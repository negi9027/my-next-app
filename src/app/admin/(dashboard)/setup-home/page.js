"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SetupHomePage() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const router = useRouter();

    const handleSetup = async () => {
        setLoading(true);
        setResult(null);

        try {
            const res = await fetch("/api/admin/setup-home", {
                method: "POST"
            });

            const data = await res.json();
            setResult(data);
        } catch (err) {
            setResult({
                success: false,
                error: err.message
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-lg">
                        <div className="card-header bg-primary text-white">
                            <h3 className="mb-0">🏠 Home Page Management Setup</h3>
                        </div>
                        <div className="card-body">
                            <div className="alert alert-info">
                                <h5>📋 Setup Instructions</h5>
                                <p className="mb-0">
                                    Click the button below to initialize the database tables for
                                    home page management. This will create the necessary tables and
                                    populate them with default content.
                                </p>
                            </div>

                            {!result && (
                                <div className="text-center my-4">
                                    <button
                                        className="btn btn-primary btn-lg px-5"
                                        onClick={handleSetup}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" />
                                                Setting up...
                                            </>
                                        ) : (
                                            <>
                                                🚀 Initialize Database
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}

                            {result && (
                                <div className="mt-4">
                                    {result.success ? (
                                        <div className="alert alert-success">
                                            <h5 className="alert-heading">✅ Success!</h5>
                                            <p>{result.message}</p>

                                            {result.results && (
                                                <div className="mt-3">
                                                    <strong>Details:</strong>
                                                    <ul className="small mb-0 mt-2">
                                                        {result.results.map((r, i) => (
                                                            <li key={i}>{r}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            <hr />
                                            <div className="d-flex gap-2 mt-3">
                                                <button
                                                    className="btn btn-success"
                                                    onClick={() => router.push("/admin/home-management")}
                                                >
                                                    📊 Go to Home Management
                                                </button>
                                                <button
                                                    className="btn btn-outline-primary"
                                                    onClick={() => setResult(null)}
                                                >
                                                    🔄 Run Again
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="alert alert-danger">
                                            <h5 className="alert-heading">❌ Error</h5>
                                            <p className="mb-0">{result.error}</p>

                                            {result.errors && (
                                                <div className="mt-3">
                                                    <strong>Errors:</strong>
                                                    <ul className="small mb-0 mt-2">
                                                        {result.errors.map((e, i) => (
                                                            <li key={i} className="text-danger">{e}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            <hr />
                                            <button
                                                className="btn btn-outline-danger mt-2"
                                                onClick={() => setResult(null)}
                                            >
                                                🔄 Try Again
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="mt-5">
                                <h5>📚 What will be created:</h5>
                                <ul>
                                    <li><code>home_sections</code> table - Stores all home page sections</li>
                                    <li><code>home_features</code> table - Stores section features/cards</li>
                                    <li>Default sections (Hero, About, Why Choose Us, etc.)</li>
                                    <li>Default features for pre-configured sections</li>
                                </ul>

                                <div className="alert alert-warning mt-3">
                                    <strong>⚠️ Note:</strong> If tables already exist, they will be skipped.
                                    Existing data will not be lost.
                                </div>
                            </div>
                        </div>
                        <div className="card-footer text-muted">
                            <small>
                                After setup, you can manage all home page content from the admin panel.
                            </small>
                        </div>
                    </div>

                    <div className="text-center mt-4">
                        <a href="/admin" className="btn btn-outline-secondary">
                            ← Back to Admin Dashboard
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
