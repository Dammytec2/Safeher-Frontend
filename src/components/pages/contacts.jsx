
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  ArrowLeft,
  Users,
  Plus,
  X,
  UserRound,
  Phone,
  Heart,
  Pencil,
  Trash2,
  LoaderCircle,
} from "lucide-react";

const API_URL = "http://localhost:5000/api/contacts";

const Contacts = () => {
  const navigate = useNavigate();

  const [contacts, setContacts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    relationship: "",
  });

  const getToken = () => {
    return localStorage.getItem("safeher_token");
  };

  const handleUnauthorized = () => {
    localStorage.removeItem("safeher_token");
    localStorage.removeItem("safeher_user");
    navigate("/login", { replace: true });
  };

  // Shared API request helper
  const apiRequest = async (url, options = {}) => {
    const token = getToken();

    if (!token) {
      handleUnauthorized();
      throw new Error("Please sign in to continue.");
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (response.status === 401) {
      handleUnauthorized();
      throw new Error("Your session has expired. Please sign in.");
    }

    const data = await response.json();

    if (!response.ok || data.success === false) {
      throw new Error(
        data.message || "Something went wrong. Please try again."
      );
    }

    return data;
  };

  // FETCH TRUSTED CONTACTS
  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest(API_URL);

      // Expected backend response: { success: true, contacts: [...] }
      if (!Array.isArray(data.contacts)) {
        throw new Error("Unexpected contacts response from server.");
      }

      setContacts(data.contacts);
    } catch (err) {
      setError(err.message || "Unable to load trusted contacts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      relationship: "",
    });

    setEditingId(null);
    setShowForm(false);
  };

  const openAddForm = () => {
    resetForm();
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const handleChange = (e) => {
    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  // ADD OR UPDATE CONTACT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (saving) return;

    const cleaned = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      relationship: formData.relationship.trim(),
    };

    if (
      !cleaned.name ||
      !cleaned.phone ||
      !cleaned.relationship
    ) {
      setError("Please complete all fields.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const isEditing = editingId !== null;

      const url = isEditing
        ? `${API_URL}/${editingId}`
        : API_URL;

      await apiRequest(url, {
        method: isEditing ? "PUT" : "POST",
        body: JSON.stringify(cleaned),
      });

      resetForm();

      setSuccess(
        isEditing
          ? "Trusted contact updated successfully."
          : "Trusted contact added successfully."
      );

      await fetchContacts();
    } catch (err) {
      setError(err.message || "Unable to save contact.");
    } finally {
      setSaving(false);
    }
  };

  // EDIT CONTACT
  const handleEdit = (contact) => {
    setEditingId(contact._id);

    setFormData({
      name: contact.name || "",
      phone: contact.phone || "",
      relationship: contact.relationship || "",
    });

    setError("");
    setSuccess("");
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // DELETE CONTACT
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this trusted contact?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");
      setSuccess("");

      await apiRequest(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      setContacts((previous) =>
        previous.filter((contact) => contact._id !== id)
      );

      if (editingId === id) {
        resetForm();
      }

      setSuccess("Trusted contact deleted successfully.");
    } catch (err) {
      setError(err.message || "Unable to delete contact.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F7FC] text-[#38204F]">

      {/* TOP NAVIGATION */}
      <header className="border-b border-[#EEE6F3] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">

          <Link
            to="/dashboard"
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#6E4A91] text-white">
              <ShieldCheck size={24} />
            </div>

            <span className="text-2xl font-extrabold">
              SafeHer
              <span className="text-[#B78AC9]">.</span>
            </span>
          </Link>

          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#6E4A91] hover:underline"
          >
            <ArrowLeft size={18} />
            Dashboard
          </Link>

        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">

        {/* PAGE HEADER */}
        <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

          <div>
            <p className="mb-2 text-sm font-semibold text-[#8B5BAA]">
              MY SAFETY NETWORK
            </p>

            <h1 className="text-3xl font-extrabold sm:text-4xl">
              Trusted Contacts
            </h1>

            <p className="mt-3 text-sm leading-7 text-gray-500">
              Keep important contact details of people you trust in one place.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddForm}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6E4A91] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[#563775]"
          >
            <Plus size={19} />
            Add Contact
          </button>

        </div>

        {/* SUCCESS MESSAGE */}
        {success && (
          <div
            role="status"
            className="mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-700"
          >
            {success}
          </div>
        )}

        {/* ERROR MESSAGE */}
        {error && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-600"
          >
            {error}
          </div>
        )}

        {/* CONTACT COUNT */}
        <div className="mb-8 flex items-center gap-4 rounded-2xl border border-[#EEE6F3] bg-white p-6 shadow-sm">

          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#F1E8F8] text-[#6E4A91]">
            <Users size={27} />
          </div>

          <div>
            <p className="text-2xl font-extrabold">
              {loading ? "..." : contacts.length}
            </p>

            <p className="text-sm text-gray-500">
              Saved Trusted Contacts
            </p>
          </div>

        </div>

        {/* ADD / EDIT FORM */}
        {showForm && (
          <div className="mb-8 rounded-2xl border border-[#EEE6F3] bg-white p-6 shadow-sm sm:p-8">

            <div className="mb-6 flex items-center justify-between">

              <h2 className="text-xl font-bold">
                {editingId !== null
                  ? "Edit Contact"
                  : "Add Trusted Contact"}
              </h2>

              <button
                type="button"
                onClick={resetForm}
                aria-label="Close form"
                className="text-gray-400 hover:text-[#6E4A91]"
              >
                <X size={22} />
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="grid gap-5 sm:grid-cols-2"
            >

              {/* NAME */}
              <div>
                <label
                  htmlFor="contact-name"
                  className="mb-2 block text-sm font-semibold"
                >
                  Full Name
                </label>

                <div className="relative">

                  <UserRound
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    required
                    maxLength={100}
                    placeholder="Contact's full name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 py-3.5 pl-12 pr-4 text-sm outline-none focus:border-[#8B5BAA] focus:ring-2 focus:ring-purple-100"
                  />

                </div>
              </div>

              {/* PHONE */}
              <div>
                <label
                  htmlFor="contact-phone"
                  className="mb-2 block text-sm font-semibold"
                >
                  Phone Number
                </label>

                <div className="relative">

                  <Phone
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="contact-phone"
                    type="tel"
                    name="phone"
                    required
                    maxLength={25}
                    placeholder="e.g. +234 801 234 5678"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 py-3.5 pl-12 pr-4 text-sm outline-none focus:border-[#8B5BAA] focus:ring-2 focus:ring-purple-100"
                  />

                </div>
              </div>

              {/* RELATIONSHIP */}
              <div className="sm:col-span-2">

                <label
                  htmlFor="contact-relationship"
                  className="mb-2 block text-sm font-semibold"
                >
                  Relationship
                </label>

                <select
                  id="contact-relationship"
                  name="relationship"
                  required
                  value={formData.relationship}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm outline-none focus:border-[#8B5BAA] focus:ring-2 focus:ring-purple-100"
                >
                  <option value="">Select relationship</option>
                  <option value="Parent">Parent</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Partner">Partner</option>
                  <option value="Friend">Friend</option>
                  <option value="Relative">Relative</option>
                  <option value="Other">Other</option>
                </select>

              </div>

              {/* BUTTONS */}
              <div className="flex flex-wrap gap-3 sm:col-span-2">

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#6E4A91] px-7 py-3.5 text-sm font-semibold text-white hover:bg-[#563775] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving && (
                    <LoaderCircle
                      size={17}
                      className="animate-spin"
                    />
                  )}

                  {saving
                    ? "Saving..."
                    : editingId !== null
                      ? "Save Changes"
                      : "Save Contact"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  disabled={saving}
                  className="rounded-xl border border-gray-200 px-7 py-3.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>

              </div>
            </form>
          </div>
        )}

        {/* LOADING STATE */}
        {loading ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-[#EEE6F3] bg-white py-20">

            <LoaderCircle
              size={36}
              className="mb-4 animate-spin text-[#6E4A91]"
            />

            <p className="text-sm text-gray-500">
              Loading your trusted contacts...
            </p>

          </div>
        ) : contacts.length === 0 ? (

          /* EMPTY STATE */
          <div className="rounded-2xl border border-dashed border-[#DCCBE8] bg-white px-6 py-16 text-center">

            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#F1E8F8] text-[#6E4A91]">
              <Users size={36} />
            </div>

            <h2 className="mb-3 text-xl font-bold">
              No Trusted Contacts Yet
            </h2>

            <p className="mx-auto max-w-md text-sm leading-7 text-gray-500">
              Start building your safety network by adding
              someone you trust.
            </p>

            <button
              type="button"
              onClick={openAddForm}
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#6E4A91] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[#563775]"
            >
              <Plus size={18} />
              Add Your First Contact
            </button>

          </div>
        ) : (

          /* CONTACT LIST */
          <div className="grid gap-5 md:grid-cols-2">

            {contacts.map((contact) => (
              <div
                key={contact._id}
                className="rounded-2xl border border-[#EEE6F3] bg-white p-6 shadow-sm"
              >

                <div className="mb-5 flex items-start gap-4">

                  <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-full bg-[#F1E8F8] p-3 text-[#6E4A91]">
                    <UserRound size={24} />
                  </div>

                  <div className="min-w-0">

                    <h3 className="break-words text-lg font-bold">
                      {contact.name}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {contact.relationship}
                    </p>

                  </div>
                </div>

                <p className="mb-6 flex items-center gap-2 text-sm text-gray-600">
                  <Phone
                    size={17}
                    className="text-[#8B5BAA]"
                  />
                  {contact.phone}
                </p>

                <div className="flex gap-3 border-t border-gray-100 pt-5">

                  {/* EDIT */}
                  <button
                    type="button"
                    onClick={() => handleEdit(contact)}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#F1E8F8] px-4 py-2.5 text-sm font-semibold text-[#6E4A91] hover:bg-[#E8D9F3]"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>

                  {/* DELETE */}
                  <button
                    type="button"
                    disabled={deletingId === contact._id}
                    onClick={() => handleDelete(contact._id)}
                    className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100 disabled:opacity-60"
                  >
                    {deletingId === contact._id ? (
                      <LoaderCircle
                        size={16}
                        className="animate-spin"
                      />
                    ) : (
                      <Trash2 size={16} />
                    )}

                    {deletingId === contact._id
                      ? "Deleting..."
                      : "Delete"}
                  </button>

                </div>
              </div>
            ))}

          </div>
        )}

        {/* INFORMATION NOTE */}
        <div className="mt-9 flex items-start gap-3 rounded-xl bg-[#F1E8F8] p-5 text-sm leading-7 text-[#655574]">

          <Heart
            size={20}
            className="mt-1 shrink-0 text-[#6E4A91]"
          />

          <p>
            Trusted contacts are people you choose to keep close.
            Their details are saved securely through your account.
            Adding contacts does not automatically send emergency
            messages. WhatsApp emergency sharing requires you to
            select recipients and send the message.
          </p>

        </div>

      </main>
    </div>
  );
};

export default Contacts;
