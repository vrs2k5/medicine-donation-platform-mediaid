import React, { useState, useEffect, useRef } from 'react';
import API from '../../api';
import medicineNames from '../../data/medicineNames';
import manufacturerNames from '../../data/manufacturerNames';

export default function DonateForm() {
  const [name, setName] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [manufacturerSuggestions, setManufacturerSuggestions] = useState([]);
  const [showManufacturerSuggestions, setShowManufacturerSuggestions] = useState(false);
  const manufacturerSuggestionsRef = useRef(null);
  const [expiry, setExpiry] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [msg, setMsg] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    if (name.length >= 3) {
      const filtered = medicineNames.filter(med =>
        med.toLowerCase().includes(name.toLowerCase())
      ).slice(0, 10); // limit to 10 suggestions
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  }, [name]);

  useEffect(() => {
    if (manufacturer.length >= 3) {
      const filtered = manufacturerNames.filter(manu =>
        manu.toLowerCase().includes(manufacturer.toLowerCase())
      ).slice(0, 10);
      setManufacturerSuggestions(filtered);
      setShowManufacturerSuggestions(filtered.length > 0);
    } else {
      setShowManufacturerSuggestions(false);
      setManufacturerSuggestions([]);
    }
  }, [manufacturer]);

  // Close suggestions dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      if (manufacturerSuggestionsRef.current && !manufacturerSuggestionsRef.current.contains(event.target)) {
        setShowManufacturerSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSuggestionClick = (suggestion) => {
    setName(suggestion);
    setShowSuggestions(false);
  };

  const handleManufacturerSuggestionClick = (suggestion) => {
    setManufacturer(suggestion);
    setShowManufacturerSuggestions(false);
  };

  // === Form submit ===
  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = { name, manufacturer, expiryDate: expiry, quantity, address, pickupDate, pickupTime };
      await API.post('/medicines/donate', payload);
      setMsg('Donation submitted');
      setName('');
      setManufacturer('');
      setExpiry('');
      setQuantity(1);
      setAddress('');
      setPickupDate('');
      setPickupTime('');
    } catch (err) {
      setMsg(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">
                <i className="fas fa-pills me-2"></i>Donate Medicine
              </h4>
            </div>
            <div className="card-body">
              {msg && (
                <div className="alert alert-info">
                  <i className="fas fa-info-circle me-2"></i>
                  {msg}
                </div>
              )}
              <form onSubmit={submit} autoComplete="off">
                <div className="row mb-3" style={{ position: 'relative' }}>
                  <div className="col-md-6" ref={suggestionsRef}>
                    <label htmlFor="name" className="form-label">
                      <i className="fas fa-tag me-1"></i>Medicine Name
                    </label>
                    <input
                      id="name"
                      className="form-control"
                      placeholder="e.g., Aspirin"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      autoComplete="off"
                      onFocus={() => {
                        if (suggestions.length > 0) setShowSuggestions(true);
                      }}
                    />
                    {showSuggestions && (
                      <ul className="autocomplete-suggestions">
                        {suggestions.map((suggestion, index) => (
                          <li
                            key={index}
                            className="autocomplete-suggestion"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="col-md-6" ref={manufacturerSuggestionsRef}>
                    <label htmlFor="manufacturer" className="form-label">
                      <i className="fas fa-industry me-1"></i>Manufacturer
                    </label>
                    <input
                      id="manufacturer"
                      className="form-control"
                      placeholder="e.g., Bayer"
                      value={manufacturer}
                      onChange={(e) => setManufacturer(e.target.value)}
                      autoComplete="off"
                      onFocus={() => {
                        if (manufacturerSuggestions.length > 0) setShowManufacturerSuggestions(true);
                      }}
                    />
                    {showManufacturerSuggestions && (
                      <ul className="autocomplete-suggestions">
                        {manufacturerSuggestions.map((suggestion, index) => (
                          <li
                            key={index}
                            className="autocomplete-suggestion"
                            onClick={() => handleManufacturerSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="expiry" className="form-label">
                      <i className="fas fa-calendar-alt me-1"></i>Expiry Date
                    </label>
                    <input
                      id="expiry"
                      type="date"
                      className="form-control"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="quantity" className="form-label">
                      <i className="fas fa-hashtag me-1"></i>Quantity
                    </label>
                    <input
                      id="quantity"
                      type="number"
                      min="1"
                      className="form-control"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="address" className="form-label">
                    <i className="fas fa-map-marker-alt me-1"></i>Pickup Address
                  </label>
                  <textarea
                    id="address"
                    className="form-control"
                    rows="3"
                    placeholder="Enter your full address for pickup"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="pickupDate" className="form-label">
                      <i className="fas fa-calendar-check me-1"></i>Pickup Date
                    </label>
                    <input
                      id="pickupDate"
                      type="date"
                      className="form-control"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="pickupTime" className="form-label">
                      <i className="fas fa-clock me-1"></i>Pickup Time
                    </label>
                    <input
                      id="pickupTime"
                      type="time"
                      className="form-control"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="mb-3 d-flex flex-wrap gap-2">
                  <button className="btn btn-success" type="submit">
                    <i className="fas fa-paper-plane me-1"></i>Submit Donation
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
