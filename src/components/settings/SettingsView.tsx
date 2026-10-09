import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DeliveryAddress } from '../../types';
import { NeonButton } from '../ui/NeonButton';
import {
  User,
  MapPin,
  Compass,
  CheckCircle2,
  Phone,
  Mail,
  Shield,
  Plus,
  Trash2,
  ExternalLink,
  Store,
  Navigation,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    currentUser,
    updateUserProfile,
    saveAddress,
    setDefaultAddress,
    sellers,
    selectedDeliveryAddress,
    setSelectedDeliveryAddress,
  } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Address creation form
  const [newLabel, setNewLabel] = useState('Home');
  const [newFullAddress, setNewFullAddress] = useState('');
  const [newCity, setNewCity] = useState('Bengaluru');
  const [newState, setNewState] = useState('Karnataka');
  const [newPin, setNewPin] = useState('560038');
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string>('');

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name, phone });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullAddress.trim()) return;

    const newAddr: DeliveryAddress = {
      id: `addr-${Date.now()}`,
      label: newLabel,
      fullAddress: newFullAddress,
      city: newCity,
      state: newState,
      postalCode: newPin,
      lat: 12.9716 + (Math.random() - 0.5) * 0.05,
      lng: 77.5946 + (Math.random() - 0.5) * 0.05,
      isDefault: false,
    };

    saveAddress(newAddr);
    setIsAddingAddress(false);
    setNewFullAddress('');
  };

  const handleRequestGeo = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser');
      return;
    }
    setLocationStatus('Locating device position...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocationStatus(`Located: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
        const geoAddr: DeliveryAddress = {
          id: `addr-geo-${Date.now()}`,
          label: 'Current Geolocation',
          fullAddress: 'Auto-detected GPS Location Coordinates',
          city: 'Bengaluru Region',
          state: 'Karnataka',
          postalCode: '560001',
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          isDefault: true,
        };
        saveAddress(geoAddr);
      },
      (err) => {
        setLocationStatus('Location permission denied or unavailable. Please use manual entry below.');
      }
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Account Profile & Location Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage your buyer profile, saved delivery addresses, and map-based seller proximity.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Profile Editing */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-5">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <User className="w-4 h-4 text-cyan-400" />
              <span>Personal Information</span>
            </h2>

            <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Display Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500 font-medium"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Updates your profile name immediately across order records and app headers.
                </span>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={currentUser.email}
                  className="w-full bg-slate-950/60 border border-slate-800/60 rounded-xl px-3 py-2 text-slate-400 font-mono cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Contact Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-2">
                <NeonButton
                  type="submit"
                  variant="cyan"
                  size="md"
                  className="w-full"
                  isSuccess={savedSuccess}
                >
                  <span>Update Profile Information</span>
                </NeonButton>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Delivery Addresses & Proximity Maps */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>Saved Delivery Destinations</span>
              </h2>

              <button
                onClick={handleRequestGeo}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                title="Detect Current GPS Location"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Use Current Location</span>
              </button>
            </div>

            {locationStatus && (
              <div className="p-3 rounded-xl bg-slate-950 border border-cyan-500/30 text-xs text-cyan-300">
                {locationStatus}
              </div>
            )}

            {/* Address Cards List */}
            <div className="space-y-3">
              {currentUser.savedAddresses.map((addr) => {
                const isSelected = selectedDeliveryAddress.id === addr.id;
                return (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedDeliveryAddress(addr)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-cyan-500/10 border-cyan-500 text-white'
                        : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs">{addr.label}</span>
                        {addr.isDefault && (
                          <span className="text-[10px] px-2 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                            Default
                          </span>
                        )}
                        {isSelected && (
                          <span className="text-[10px] text-emerald-400 font-medium">
                            · Active for Checkout
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{addr.fullAddress}</p>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {addr.city}, {addr.state} - {addr.postalCode}
                      </div>
                    </div>

                    {!addr.isDefault && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDefaultAddress(addr.id);
                        }}
                        className="text-[11px] text-slate-400 hover:text-cyan-400 underline cursor-pointer"
                      >
                        Set Default
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add Address Form Toggle */}
            {!isAddingAddress ? (
              <NeonButton
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setIsAddingAddress(true)}
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                <span>Add New Address</span>
              </NeonButton>
            ) : (
              <form onSubmit={handleCreateAddress} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                <div className="flex justify-between items-center font-bold text-white">
                  <span>Enter New Address</span>
                  <button
                    type="button"
                    onClick={() => setIsAddingAddress(false)}
                    className="text-slate-500 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">Label</label>
                    <input
                      type="text"
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value)}
                      placeholder="Home, Office, Studio"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">City</label>
                    <input
                      type="text"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Full Street Address</label>
                  <input
                    type="text"
                    required
                    value={newFullAddress}
                    onChange={(e) => setNewFullAddress(e.target.value)}
                    placeholder="Apartment, Street name, Landmark"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">State</label>
                    <input
                      type="text"
                      value={newState}
                      onChange={(e) => setNewState(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">PIN Code</label>
                    <input
                      type="text"
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-white font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <NeonButton type="submit" variant="cyan" size="sm" className="w-full">
                  Save Delivery Location
                </NeonButton>
              </form>
            )}

            {/* Proximity to Participating Sellers */}
            <div className="pt-4 border-t border-slate-800">
              <h3 className="text-xs font-semibold text-slate-300 mb-3 flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-cyan-400" />
                <span>Nearby Participating Sellers in Your Region</span>
              </h3>

              <div className="space-y-2">
                {sellers.slice(0, 3).map((seller) => (
                  <div
                    key={seller.id}
                    className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-white">{seller.businessName}</div>
                      <div className="text-[11px] text-slate-400">{seller.address}</div>
                    </div>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(seller.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-[11px] font-medium"
                    >
                      <span>Directions</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
