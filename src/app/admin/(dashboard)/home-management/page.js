"use client";
import { useState, useEffect } from "react";

export default function HomeManagementPage() {
    const [sections, setSections] = useState([]);
    const [features, setFeatures] = useState({});
    const [loading, setLoading] = useState(true);

    const [editingSection, setEditingSection] = useState(null);
    const [showSectionForm, setShowSectionForm] = useState(false);

    // Fetch all data
    const fetchData = async () => {
        setLoading(true);
        try {
            const [sectionsRes, featuresRes] = await Promise.all([
                fetch("/api/admin/home-sections"),
                fetch("/api/admin/home-features")
            ]);

            if (sectionsRes.ok) {
                const data = await sectionsRes.json();
                setSections(data);
            }

            if (featuresRes.ok) {
                const data = await featuresRes.json();
                // Group features by section_key
                const grouped = data.reduce((acc, f) => {
                    if (!acc[f.section_key]) acc[f.section_key] = [];
                    acc[f.section_key].push(f);
                    return acc;
                }, {});
                setFeatures(grouped);
            }
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEditSection = (section) => {
        setEditingSection(section);
        setShowSectionForm(true);
    };

    const handleDeleteSection = async (id) => {
        if (!confirm("Delete this section?")) return;

        try {
            const res = await fetch(`/api/admin/home-sections?id=${id}`, {
                method: "DELETE"
            });

            if (res.ok) {
                alert("Section deleted!");
                fetchData();
            } else {
                alert("Failed to delete section");
            }
        } catch (err) {
            console.error(err);
            alert("Error deleting section");
        }
    };

    const closeForms = () => {
        setShowSectionForm(false);
        setEditingSection(null);
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4">
            <div className="row mb-4">
                <div className="col">
                    <h1 className="h3 fw-bold">🏠 Home Page Management</h1>
                    <p className="text-muted">
                        Manage all home page sections with their content, images, and features
                    </p>
                </div>
            </div>

            <div className="mb-3">
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        setEditingSection(null);
                        setShowSectionForm(true);
                    }}
                >
                    ➕ Add New Section
                </button>
            </div>

            {showSectionForm && (
                <SectionForm
                    section={editingSection}
                    sectionFeatures={editingSection ? features[editingSection.section_key] || [] : []}
                    onClose={closeForms}
                    onSuccess={() => {
                        fetchData();
                        closeForms();
                    }}
                />
            )}

            <div className="row g-3">
                {sections.map((section) => {
                    const sectionFeatures = features[section.section_key] || [];

                    return (
                        <div key={section.id} className="col-12">
                            <div className="card shadow-sm">
                                <div className="card-body">
                                    <div className="row">
                                        {/* Left: Section Info */}
                                        <div className="col-md-8">
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <h5 className="card-title mb-0">
                                                    {section.title || "Untitled"}
                                                </h5>
                                                <span
                                                    className={`badge ${section.is_active ? "bg-success" : "bg-secondary"
                                                        }`}
                                                >
                                                    {section.is_active ? "Active" : "Inactive"}
                                                </span>
                                            </div>

                                            <p className="small text-muted mb-2">
                                                <strong>Section Key:</strong> <code>{section.section_key}</code>
                                            </p>

                                            {section.content && (
                                                <p className="small text-muted mb-3" style={{
                                                    maxHeight: "80px",
                                                    overflow: "hidden"
                                                }}>
                                                    {section.content.substring(0, 200)}...
                                                </p>
                                            )}

                                            {/* Features Preview */}
                                            {sectionFeatures.length > 0 && (
                                                <div className="mt-3">
                                                    <p className="small fw-semibold mb-2">
                                                        ✨ Features ({sectionFeatures.length}):
                                                    </p>
                                                    <div className="d-flex flex-wrap gap-2">
                                                        {sectionFeatures.map((f) => (
                                                            <span
                                                                key={f.id}
                                                                className="badge bg-light text-dark border"
                                                                title={f.description}
                                                            >
                                                                {f.icon_url && (
                                                                    <img
                                                                        src={f.icon_url}
                                                                        alt=""
                                                                        style={{ height: "16px", marginRight: "4px" }}
                                                                    />
                                                                )}
                                                                {f.title}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Right: Image & Actions */}
                                        <div className="col-md-4">
                                            {section.image_url && (
                                                <img
                                                    src={section.image_url}
                                                    alt={section.image_alt || "Section image"}
                                                    className="img-fluid rounded mb-2"
                                                    style={{ maxHeight: "150px", objectFit: "cover", width: "100%" }}
                                                />
                                            )}

                                            <div className="d-flex gap-2 mt-2">
                                                <button
                                                    className="btn btn-sm btn-primary flex-fill"
                                                    onClick={() => handleEditSection(section)}
                                                >
                                                    ✏️ Edit Complete Section
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleDeleteSection(section.id)}
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer text-muted small d-flex justify-content-between">
                                    <span>Display Order: {section.display_order}</span>
                                    <span>{sectionFeatures.length} feature(s)</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ============= SECTION FORM WITH INLINE FEATURES =============
function SectionForm({ section, sectionFeatures, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        section_key: section?.section_key || "",
        title: section?.title || "",
        content: section?.content || "",
        image_url: section?.image_url || "",
        image_alt: section?.image_alt || "",
        background_image_url: section?.background_image || "",
        cta_text: section?.cta_text || "",
        cta_link: section?.cta_link || "",
        cta_text_2: section?.cta_text_2 || "",
        cta_link_2: section?.cta_link_2 || "",
        is_active: section?.is_active ?? true,
        display_order: section?.display_order || 0,
        extra_data: section?.extra_data ? JSON.stringify(section.extra_data, null, 2) : "{}"
    });

    const [imageFile, setImageFile] = useState(null);
    const [bgImageFile, setBgImageFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // Features state
    const [features, setFeatures] = useState(sectionFeatures || []);
    const [showAddFeature, setShowAddFeature] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const formDataToSend = new FormData();

            Object.keys(formData).forEach(key => {
                formDataToSend.append(key, formData[key]);
            });

            if (section) {
                formDataToSend.append("id", section.id);
            }

            if (imageFile) {
                formDataToSend.append("image_file", imageFile);
            }

            if (bgImageFile) {
                formDataToSend.append("background_image_file", bgImageFile);
            }

            const url = "/api/admin/home-sections";
            const method = section ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                body: formDataToSend
            });

            if (res.ok) {
                alert(section ? "Section updated!" : "Section created!");
                onSuccess();
            } else {
                const error = await res.json();
                alert(error.error || "Failed to save section");
            }
        } catch (err) {
            console.error(err);
            alert("Error saving section");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteFeature = async (featureId) => {
        if (!confirm("Delete this feature?")) return;

        try {
            const res = await fetch(`/api/admin/home-features?id=${featureId}`, {
                method: "DELETE"
            });

            if (res.ok) {
                alert("Feature deleted!");
                setFeatures(features.filter(f => f.id !== featureId));
            }
        } catch (err) {
            console.error(err);
            alert("Error deleting feature");
        }
    };

    return (
        <div className="card mb-4 shadow-lg">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                    {section ? "✏️ Edit Section" : "➕ Add New Section"}
                </h5>
                <button className="btn btn-sm btn-light" onClick={onClose}>
                    ✖
                </button>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    {/* ========== SECTION DETAILS ========== */}
                    <h6 className="border-bottom pb-2 mb-3">📄 Section Details</h6>

                    <div className="row g-3 mb-4">
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Section Key *</label>
                            <input
                                type="text"
                                name="section_key"
                                className="form-control"
                                value={formData.section_key}
                                onChange={handleChange}
                                placeholder="e.g., hero, about, contact_cta"
                                required
                                disabled={section ? true : false}
                            />
                            <small className="text-muted">Unique identifier (no spaces)</small>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Title</label>
                            <input
                                type="text"
                                name="title"
                                className="form-control"
                                value={formData.title}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-12">
                            <label className="form-label fw-semibold">Content</label>
                            <textarea
                                name="content"
                                className="form-control"
                                rows="4"
                                value={formData.content}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Image URL</label>
                            <input
                                type="text"
                                name="image_url"
                                className="form-control"
                                value={formData.image_url}
                                onChange={handleChange}
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Or Upload Image</label>
                            <input
                                type="file"
                                className="form-control"
                                accept="image/*"
                                onChange={(e) => setImageFile(e.target.files[0])}
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Image Alt Text</label>
                            <input
                                type="text"
                                name="image_alt"
                                className="form-control"
                                value={formData.image_alt}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Background Image URL</label>
                            <input
                                type="text"
                                name="background_image_url"
                                className="form-control"
                                value={formData.background_image_url}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-semibold">CTA Text</label>
                            <input
                                type="text"
                                name="cta_text"
                                className="form-control"
                                value={formData.cta_text}
                                onChange={handleChange}
                                placeholder="e.g., Learn More"
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-semibold">CTA Link</label>
                            <input
                                type="text"
                                name="cta_link"
                                className="form-control"
                                value={formData.cta_link}
                                onChange={handleChange}
                                placeholder="/about"
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-semibold">CTA Text 2 (Optional)</label>
                            <input
                                type="text"
                                name="cta_text_2"
                                className="form-control"
                                value={formData.cta_text_2}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-semibold">CTA Link 2 (Optional)</label>
                            <input
                                type="text"
                                name="cta_link_2"
                                className="form-control"
                                value={formData.cta_link_2}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Display Order</label>
                            <input
                                type="number"
                                name="display_order"
                                className="form-control"
                                value={formData.display_order}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6">
                            <div className="form-check mt-4">
                                <input
                                    type="checkbox"
                                    name="is_active"
                                    className="form-check-input"
                                    checked={formData.is_active}
                                    onChange={handleChange}
                                    id="section-active"
                                />
                                <label className="form-check-label fw-semibold" htmlFor="section-active">
                                    Active
                                </label>
                            </div>
                        </div>

                        <div className="col-12">
                            <label className="form-label fw-semibold">Extra Data (JSON)</label>
                            <textarea
                                name="extra_data"
                                className="form-control font-monospace"
                                rows="3"
                                value={formData.extra_data}
                                onChange={handleChange}
                                placeholder='{"key": "value"}'
                            />
                            <small className="text-muted">
                                Additional section-specific data in JSON format
                            </small>
                        </div>
                    </div>

                    {/* ========== FEATURES SECTION ========== */}
                    {section && (
                        <>
                            <h6 className="border-bottom pb-2 mb-3 mt-4">
                                ✨ Section Features ({features.length})
                            </h6>

                            <div className="mb-3">
                                <button
                                    type="button"
                                    className="btn btn-sm btn-success"
                                    onClick={() => setShowAddFeature(!showAddFeature)}
                                >
                                    {showAddFeature ? "✖ Cancel" : "➕ Add Feature"}
                                </button>
                            </div>

                            {showAddFeature && (
                                <FeatureInlineForm
                                    sectionKey={section.section_key}
                                    onSuccess={(newFeature) => {
                                        setFeatures([...features, newFeature]);
                                        setShowAddFeature(false);
                                    }}
                                    onCancel={() => setShowAddFeature(false)}
                                />
                            )}

                            <div className="row g-2 mb-3">
                                {features.map((feature) => (
                                    <div key={feature.id} className="col-md-6">
                                        <div className="card border">
                                            <div className="card-body p-3">
                                                <div className="d-flex justify-content-between align-items-start">
                                                    <div className="flex-fill">
                                                        <h6 className="mb-1">{feature.title}</h6>
                                                        {feature.description && (
                                                            <p className="small text-muted mb-2">{feature.description}</p>
                                                        )}
                                                        {feature.icon_url && (
                                                            <img
                                                                src={feature.icon_url}
                                                                alt={feature.icon_alt || ""}
                                                                style={{ maxHeight: "40px" }}
                                                            />
                                                        )}
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => handleDeleteFeature(feature.id)}
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* ========== SUBMIT ========== */}
                    <div className="col-12 mt-4 border-top pt-3">
                        <button
                            type="submit"
                            className="btn btn-primary btn-lg"
                            disabled={submitting}
                        >
                            {submitting ? "Saving..." : section ? "💾 Update Section" : "➕ Create Section"}
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary btn-lg ms-2"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ============= INLINE FEATURE FORM =============
function FeatureInlineForm({ sectionKey, onSuccess, onCancel }) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        icon_url: "",
        icon_alt: "",
        is_active: true,
        display_order: 0
    });

    const [iconFile, setIconFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("section_key", sectionKey);

            Object.keys(formData).forEach(key => {
                formDataToSend.append(key, formData[key]);
            });

            if (iconFile) {
                formDataToSend.append("icon_file", iconFile);
            }

            const res = await fetch("/api/admin/home-features", {
                method: "POST",
                body: formDataToSend
            });

            if (res.ok) {
                const result = await res.json();
                alert("Feature added!");

                // Return the new feature
                onSuccess({
                    id: result.id,
                    section_key: sectionKey,
                    ...formData,
                    icon_url: iconFile ? `/uploads/home/features/${iconFile.name}` : formData.icon_url
                });
            } else {
                const error = await res.json();
                alert(error.error || "Failed to add feature");
            }
        } catch (err) {
            console.error(err);
            alert("Error adding feature");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="card bg-light mb-3">
            <div className="card-body">
                <h6 className="mb-3">Add New Feature</h6>
                <form onSubmit={handleSubmit}>
                    <div className="row g-2">
                        <div className="col-md-6">
                            <label className="form-label small fw-semibold">Title *</label>
                            <input
                                type="text"
                                name="title"
                                className="form-control form-control-sm"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label small fw-semibold">Description</label>
                            <input
                                type="text"
                                name="description"
                                className="form-control form-control-sm"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label small fw-semibold">Icon URL</label>
                            <input
                                type="text"
                                name="icon_url"
                                className="form-control form-control-sm"
                                value={formData.icon_url}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label small fw-semibold">Or Upload Icon</label>
                            <input
                                type="file"
                                className="form-control form-control-sm"
                                accept="image/*"
                                onChange={(e) => setIconFile(e.target.files[0])}
                            />
                        </div>

                        <div className="col-md-4">
                            <label className="form-label small fw-semibold">Display Order</label>
                            <input
                                type="number"
                                name="display_order"
                                className="form-control form-control-sm"
                                value={formData.display_order}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-12">
                            <button
                                type="submit"
                                className="btn btn-sm btn-success"
                                disabled={submitting}
                            >
                                {submitting ? "Adding..." : "Add Feature"}
                            </button>
                            <button
                                type="button"
                                className="btn btn-sm btn-secondary ms-2"
                                onClick={onCancel}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
