import React, { useState } from 'react';
import { User, ChevronDown, ChevronUp, Image, Trash2, Globe } from 'lucide-react';
import { Linkedin, Github } from '../icons/SocialIcons';

export function PersonalDetailsForm({ details = {}, onChange }) {
  const [showAdditional, setShowAdditional] = useState(false);

  const handleFieldChange = (field, val) => {
    onChange({ ...details, [field]: val });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      onChange({ ...details, photo: reader.result, showPhoto: true });
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    onChange({ ...details, photo: '', showPhoto: false });
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
            <User className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-slate-800">Personal Details</h2>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        {/* Job Title */}
        <div className="sm:col-span-2">
          <label className="block font-medium text-slate-700 mb-1">
            Wanted Job Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Senior Software Engineer"
            value={details.jobTitle || ''}
            onChange={(e) => handleFieldChange('jobTitle', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-hidden transition text-slate-800"
          />
        </div>

        {/* Photo Upload Area */}
        <div className="sm:col-span-2 flex items-center gap-4 p-3 bg-slate-50/80 rounded-xl border border-dashed border-slate-200">
          {details.photo ? (
            <div className="relative">
              <img
                src={details.photo}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-xs"
              />
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="absolute -top-1 -right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-xs transition"
                title="Remove photo"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-slate-200/70 flex items-center justify-center text-slate-400">
              <Image className="w-6 h-6" />
            </div>
          )}
          <div className="flex-1">
            <label className="inline-block cursor-pointer px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-medium rounded-lg border border-slate-300 text-xs shadow-2xs transition">
              <span>{details.photo ? 'Change photo' : 'Upload photo'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
            <div className="flex items-center gap-2 mt-1.5">
              <input
                type="checkbox"
                id="showPhoto"
                checked={!!details.showPhoto}
                onChange={(e) => handleFieldChange('showPhoto', e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="showPhoto" className="text-[11px] text-slate-500 cursor-pointer">
                Show photo on resume
              </label>
            </div>
          </div>
        </div>

        {/* First & Last Name */}
        <div>
          <label className="block font-medium text-slate-700 mb-1">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Alex"
            value={details.firstName || ''}
            onChange={(e) => handleFieldChange('firstName', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-hidden transition text-slate-800"
          />
        </div>
        <div>
          <label className="block font-medium text-slate-700 mb-1">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Morgan"
            value={details.lastName || ''}
            onChange={(e) => handleFieldChange('lastName', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-hidden transition text-slate-800"
          />
        </div>

        {/* Email & Phone */}
        <div>
          <label className="block font-medium text-slate-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            placeholder="e.g. alex.morgan@example.com"
            value={details.email || ''}
            onChange={(e) => handleFieldChange('email', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-hidden transition text-slate-800"
          />
        </div>
        <div>
          <label className="block font-medium text-slate-700 mb-1">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            placeholder="e.g. +1 (555) 234-5678"
            value={details.phone || ''}
            onChange={(e) => handleFieldChange('phone', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-hidden transition text-slate-800"
          />
        </div>

        {/* City & Country */}
        <div>
          <label className="block font-medium text-slate-700 mb-1">City</label>
          <input
            type="text"
            placeholder="e.g. San Francisco, CA"
            value={details.city || ''}
            onChange={(e) => handleFieldChange('city', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-hidden transition text-slate-800"
          />
        </div>
        <div>
          <label className="block font-medium text-slate-700 mb-1">Country</label>
          <input
            type="text"
            placeholder="e.g. United States"
            value={details.country || ''}
            onChange={(e) => handleFieldChange('country', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-hidden transition text-slate-800"
          />
        </div>

        {/* Online Profiles */}
        <div className="sm:col-span-2 pt-2 border-t border-slate-100">
          <div className="font-semibold text-slate-700 mb-2">Websites & Social Links</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="flex items-center gap-1 font-medium text-slate-600 mb-1">
                <Linkedin className="w-3.5 h-3.5 text-blue-600" />
                <span>LinkedIn</span>
              </label>
              <input
                type="url"
                placeholder="https://linkedin.com/in/username"
                value={details.linkedin || ''}
                onChange={(e) => handleFieldChange('linkedin', e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-hidden transition text-slate-800 text-xs"
              />
            </div>
            <div>
              <label className="flex items-center gap-1 font-medium text-slate-600 mb-1">
                <Github className="w-3.5 h-3.5 text-slate-800" />
                <span>GitHub</span>
              </label>
              <input
                type="url"
                placeholder="https://github.com/username"
                value={details.github || ''}
                onChange={(e) => handleFieldChange('github', e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-hidden transition text-slate-800 text-xs"
              />
            </div>
            <div>
              <label className="flex items-center gap-1 font-medium text-slate-600 mb-1">
                <Globe className="w-3.5 h-3.5 text-teal-600" />
                <span>Portfolio / Blog</span>
              </label>
              <input
                type="url"
                placeholder="https://yourwebsite.com"
                value={details.website || ''}
                onChange={(e) => handleFieldChange('website', e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-hidden transition text-slate-800 text-xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Additional Details Toggle (Address, Driving License, Nationality) */}
      <div className="pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={() => setShowAdditional(!showAdditional)}
          className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
        >
          <span>{showAdditional ? 'Hide additional details' : 'Edit additional details'}</span>
          {showAdditional ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showAdditional && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 mt-2 text-xs border-t border-slate-100 animate-in fade-in">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Address</label>
              <input
                type="text"
                placeholder="e.g. 500 Howard Street, Suite 400"
                value={details.address || ''}
                onChange={(e) => handleFieldChange('address', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white outline-hidden text-slate-800"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Postal Code</label>
              <input
                type="text"
                placeholder="e.g. 94105"
                value={details.postalCode || ''}
                onChange={(e) => handleFieldChange('postalCode', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white outline-hidden text-slate-800"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Driving License</label>
              <input
                type="text"
                placeholder="e.g. Class C / Full"
                value={details.drivingLicense || ''}
                onChange={(e) => handleFieldChange('drivingLicense', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white outline-hidden text-slate-800"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Nationality</label>
              <input
                type="text"
                placeholder="e.g. American / Canadian"
                value={details.nationality || ''}
                onChange={(e) => handleFieldChange('nationality', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white outline-hidden text-slate-800"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
