import React, { useState, useEffect } from 'react';
import API from '../../api';
import { useNavigate } from 'react-router-dom';
import { isValidPhoneNumber } from 'libphonenumber-js';

// Popular areas for each city
const cityAreas = {
  Mumbai: [
    'Andheri', 'Bandra', 'Borivali', 'Dadar', 'Goregaon', 'Juhu', 'Kurla', 'Malad', 'Powai', 'Vile Parle'
  ],
  Delhi: [
    'Connaught Place', 'Dwarka', 'Karol Bagh', 'Lajpat Nagar', 'Rohini', 'Saket', 'Vasant Kunj', 'Janakpuri', 'Pitampura', 'Greater Kailash'
  ],
  Bangalore: [
    'Indiranagar', 'Koramangala', 'Whitefield', 'Jayanagar', 'Malleshwaram', 'HSR Layout', 'Marathahalli', 'BTM Layout', 'Rajajinagar', 'Hebbal'
  ],
  Hyderabad: [
    'Banjara Hills', 'Gachibowli', 'Hitech City', 'Kukatpally', 'Madhapur', 'Secunderabad', 'Begumpet', 'Jubilee Hills', 'Mehdipatnam'
  ],
  Chennai: [
    'Adyar', 'Anna Nagar', 'T Nagar', 'Velachery', 'Mylapore', 'Tambaram', 'Kodambakkam', 'Porur', 'Nungambakkam'
  ],
  Kolkata: [
    'Salt Lake', 'Park Street', 'Garia', 'Behala', 'Dumdum', 'Howrah', 'Ballygunge', 'Tollygunge', 'New Town'
  ],
  Pune: [
    'Kothrud', 'Hinjewadi', 'Viman Nagar', 'Koregaon Park', 'Baner', 'Wakad', 'Hadapsar', 'Aundh', 'Camp'
  ],
  Ahmedabad: [
    'Navrangpura', 'Satellite', 'Bopal', 'Maninagar', 'Vastrapur', 'Thaltej', 'Gota', 'Chandkheda', 'Paldi'
  ],
  Jaipur: [
    'Malviya Nagar', 'Vaishali Nagar', 'Mansarovar', 'C Scheme', 'Raja Park', 'Jhotwara', 'Bani Park', 'Ajmer Road'
  ],
  Lucknow: [
    'Hazratganj', 'Gomti Nagar', 'Aliganj', 'Indira Nagar', 'Aminabad', 'Chowk', 'Alambagh', 'Rajajipuram'
  ],
  Kanpur: [
    'Swaroop Nagar', 'Kakadeo', 'Arya Nagar', 'Shastri Nagar', 'Pandu Nagar', 'Govind Nagar', 'Kalyanpur'
  ],
  Nagpur: [
    'Dharampeth', 'Civil Lines', 'Sadar', 'Sitabuldi', 'Wardha Road', 'Manish Nagar', 'Mahal'
  ],
  Indore: [
    'Vijay Nagar', 'Palasia', 'Bhawarkua', 'Rau', 'MG Road', 'Rajwada', 'Sudama Nagar'
  ],
  Thane: [
    'Ghodbunder Road', 'Vartak Nagar', 'Kopri', 'Naupada', 'Majiwada', 'Wagle Estate'
  ],
  Bhopal: [
    'Arera Colony', 'MP Nagar', 'Kolar Road', 'Shahpura', 'New Market', 'TT Nagar'
  ],
  Visakhapatnam: [
    'MVP Colony', 'Dwaraka Nagar', 'Gajuwaka', 'Seethammadhara', 'Siripuram'
  ],
  'Pimpri-Chinchwad': [
    'Nigdi', 'Akurdi', 'Chinchwad', 'Pimpri', 'Ravet', 'Wakad'
  ],
  Patna: [
    'Kankarbagh', 'Boring Road', 'Patliputra', 'Rajendra Nagar', 'Fraser Road'
  ],
  Vadodara: [
    'Alkapuri', 'Gotri', 'Manjalpur', 'Karelibaug', 'Waghodia Road'
  ],
  Ghaziabad: [
    'Indirapuram', 'Vaishali', 'Kaushambi', 'Raj Nagar', 'Vasundhara'
  ],
  Ludhiana: [
    'Sarabha Nagar', 'Model Town', 'Civil Lines', 'Pakhowal Road', 'Ferozepur Road'
  ],
  Agra: [
    'Sanjay Place', 'Dayalbagh', 'Kamla Nagar', 'Tajganj', 'Civil Lines'
  ],
  Nashik: [
    'College Road', 'Gangapur Road', 'Indira Nagar', 'Panchavati', 'Satpur'
  ],
  Faridabad: [
    'Sector 15', 'Sector 21', 'Sector 46', 'NIT', 'Ballabhgarh'
  ],
  Meerut: [
    'Shastri Nagar', 'Ganga Nagar', 'Saket', 'Abu Lane', 'Kanker Khera'
  ],
  Rajkot: [
    'Kalavad Road', 'Yagnik Road', 'University Road', 'Mavdi', 'Sadar'
  ],
  'Kalyan-Dombivli': [
    'Kalyan West', 'Dombivli East', 'Dombivli West', 'Kalyan East', 'Titwala'
  ],
  'Vasai-Virar': [
    'Vasai West', 'Virar East', 'Nalasopara', 'Vasai East', 'Virar West'
  ],
  Varanasi: [
    'Lanka', 'Sigra', 'Bhelupur', 'Assi', 'Godowlia'
  ],
  Srinagar: [
    'Lal Chowk', 'Rajbagh', 'Hazratbal', 'Bemina', 'Nishat'
  ],
  Aurangabad: [
    'CIDCO', 'Nirala Bazar', 'Osmanpura', 'Garkheda', 'Jalna Road'
  ],
  Dhanbad: [
    'Hirapur', 'Saraidhela', 'Bartand', 'Bank More', 'Kusum Vihar'
  ],
  Amritsar: [
    'Ranjit Avenue', 'Lawrence Road', 'GT Road', 'Majitha Road', 'Putligarh'
  ],
  'Navi Mumbai': [
    'Vashi', 'Nerul', 'Kharghar', 'Belapur', 'Airoli'
  ],
  Allahabad: [
    'Civil Lines', 'Tagore Town', 'Kareli', 'George Town', 'Naini'
  ],
  Ranchi: [
    'Lalpur', 'Harmu', 'Kanke', 'Morabadi', 'Doranda'
  ],
  Howrah: [
    'Shibpur', 'Bally', 'Salkia', 'Kadamtala', 'Belur'
  ],
  Coimbatore: [
    'RS Puram', 'Gandhipuram', 'Saibaba Colony', 'Peelamedu', 'Race Course'
  ],
  Jabalpur: [
    'Wright Town', 'Napier Town', 'Vijay Nagar', 'Gorakhpur', 'Sadar'
  ],
  Gwalior: [
    'Thatipur', 'Morar', 'Lashkar', 'City Centre', 'DD Nagar'
  ],
  Vijayawada: [
    'Benz Circle', 'Governorpet', 'Poranki', 'Patamata', 'Auto Nagar'
  ],
  Jodhpur: [
    'Sardarpura', 'Ratanada', 'Shastri Nagar', 'Paota', 'Mandore'
  ],
  Madurai: [
    'KK Nagar', 'Anna Nagar', 'Tallakulam', 'Goripalayam', 'Thirunagar'
  ],
  Raipur: [
    'Shankar Nagar', 'Pandri', 'Telibandha', 'Devendra Nagar', 'Byron Bazar'
  ],
  Kota: [
    'Talwandi', 'Vigyan Nagar', 'Mahaveer Nagar', 'Dadabari', 'Jawahar Nagar'
  ],
  Guwahati: [
    'Paltan Bazaar', 'Beltola', 'Dispur', 'Ganeshguri', 'Zoo Road'
  ],
  Chandigarh: [
    'Sector 17', 'Sector 22', 'Sector 35', 'Sector 43', 'Manimajra'
  ],
  Solapur: [
    'Siddheshwar Peth', 'Hotgi Road', 'Murarpura', 'Akkalkot Road', 'Jule Solapur'
  ],
  'Hubli-Dharwad': [
    'Vidyanagar', 'Gokul Road', 'Keshwapur', 'Navanagar', 'Gandhinagar'
  ],
  Tiruchirappalli: [
    'Thillai Nagar', 'Cantonment', 'Srirangam', 'Woraiyur', 'KK Nagar'
  ],
  Bareilly: [
    'Civil Lines', 'Rajendra Nagar', 'Prem Nagar', 'Izatnagar', 'Rampur Garden'
  ],
  Mysore: [
    'VV Mohalla', 'Jayalakshmipuram', 'Saraswathipuram', 'Gokulam', 'Hebbal'
  ],
  Tiruppur: [
    'Kangeyam Road', 'Avinashi Road', 'Palladam Road', 'Nehru Nagar', 'Mangalam Road'
  ],
  Gurgaon: [
    'DLF Phase 1', 'DLF Phase 2', 'Sohna Road', 'MG Road', 'Sector 56'
  ],
  Aligarh: [
    'Civil Lines', 'Ramnagar', 'Quarsi', 'Atrauli', 'Sasni Gate'
  ],
  Jalandhar: [
    'Model Town', 'Ladowali Road', 'GT Road', 'Urban Estate', 'Maqsudan'
  ],
  Bhubaneswar: [
    'Saheed Nagar', 'Jaydev Vihar', 'Patia', 'Khandagiri', 'Nayapalli'
  ],
  Salem: [
    'Fairlands', 'Gugai', 'Hasthampatti', 'Seelanaickenpatti', 'Suramangalam'
  ],
  'Mira-Bhayandar': [
    'Mira Road', 'Bhayandar East', 'Bhayandar West', 'Kashimira', 'Shanti Park'
  ],
  Warangal: [
    'Hanamkonda', 'Kazipet', 'Subedari', 'Narsampet', 'Fort Road'
  ],
  Thiruvananthapuram: [
    'Kowdiar', 'Pattom', 'Vellayambalam', 'Sasthamangalam', 'Kazhakkoottam'
  ],
  Guntur: [
    'Brodipet', 'Arundelpet', 'Lakshmipuram', 'Suryaraopet', 'Nallapadu'
  ],
  Bhiwandi: [
    'Narpoli', 'Kalher', 'Kalyan Road', 'Anjurphata', 'Gaibi Nagar'
  ],
  Saharanpur: [
    'Chilkana Road', 'Nehru Market', 'Mission Compound', 'Gill Colony', 'Janakpuri'
  ],
  Gaya: [
    'Delha', 'Rampur', 'Manpur', 'Bodh Gaya', 'AP Colony'
  ],
  Jammu: [
    'Gandhi Nagar', 'Trikuta Nagar', 'Channi Himmat', 'Janipur', 'Talab Tillo'
  ],
  Bhilai: [
    'Supela', 'Sector 6', 'Civic Center', 'Hudco', 'Power House'
  ],
  Mangalore: [
    'Kadri', 'Bejai', 'Kankanady', 'Lalbagh', 'Pandeshwar'
  ],
  Muzaffarnagar: [
    'Civil Lines', 'Shukratal', 'Kacheri Road', 'Sadar Bazar', 'Khatoli'
  ],
  Bhatpara: [
    'Kankinara', 'Shyamnagar', 'Jagatdal', 'Naihati', 'Bhatpara'
  ],
  'South Dumdum': [
    'Lake Town', 'Dum Dum Park', 'Shyambazar', 'Bangur Avenue', 'Nagerbazar'
  ],
  Bellary: [
    'Gandhinagar', 'Cantonment', 'Hospet Road', 'Kappagal Road', 'Ballari'
  ],
  Patiala: [
    'Urban Estate', 'Tripuri', 'Leela Bhawan', 'Rajpura Road', 'Model Town'
  ],
  Gopalpur: [
    'Berhampur', 'Gopalpur Port', 'Arjyapalli', 'Ganjam', 'Chhatrapur'
  ],
  Agartala: [
    'Krishna Nagar', 'Banamalipur', 'Dhaleswar', 'Indranagar', 'Joynagar'
  ],
  Bhavnagar: [
    'Waghawadi Road', 'Nari Road', 'Kaliyabid', 'Chitra', 'Vora Bazar'
  ],
  Muzaffarpur: [
    'Aghoria Bazar', 'Saraiyaganj', 'Brahmpura', 'Kalyani', 'Ahiyapur'
  ],
  Bhilwara: [
    'Azad Nagar', 'Shastri Nagar', 'Gandhi Nagar', 'Subhash Nagar', 'Pur Road'
  ],
  Siliguri: [
    'Sevoke Road', 'Hill Cart Road', 'Pradhan Nagar', 'Hakim Para', 'Salugara'
  ],
  Nanded: [
    'Vishnupuri', 'Taroda', 'Shivaji Nagar', 'Cidco', 'Waghala'
  ],
  Jamnagar: [
    'Patel Colony', 'Park Colony', 'Bedipara', 'Digvijay Plot', 'Khambhalia'
  ],
  Ujjain: [
    'Freeganj', 'Nanakheda', 'Dewas Road', 'Mahakal', 'Madhav Nagar'
  ],
  Loni: [
    'Tronica City', 'Indraprastha', 'Loni Dehat', 'Loni Bhopura', 'Rampark'
  ],
  Sagar: [
    'Makronia', 'Civil Lines', 'Katra', 'Gopalganj', 'Tilak Ganj'
  ],
  Jhansi: [
    'Sipri Bazar', 'Civil Lines', 'Nandanpura', 'Elite', 'Manik Chowk'
  ],
  Ulhasnagar: [
    'Camp 1', 'Camp 2', 'Camp 3', 'Camp 4', 'Camp 5'
  ],
  Nellore: [
    'Magunta Layout', 'Nawabpet', 'Balaji Nagar', 'Buchireddypalem', 'Stonehousepet'
  ]
  // Add more cities and areas as needed
};

export default function Register(){
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [showPassword,setShowPassword]=useState(false);
  const [role,setRole]=useState('member');
  const [mobile,setMobile]=useState('+91');
  const [location,setLocation]=useState('');
  const [err,setErr]=useState('');
  const [phoneErr, setPhoneErr] = useState('');
  const [area, setArea] = useState('');
  const [areas, setAreas] = useState([]);
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate=useNavigate();

  useEffect(() => {
    if (cityAreas[location]) {
      setAreas(cityAreas[location]);
    } else {
      setAreas([]);
    }
    setArea('');
  }, [location]);

  const submit=async(e)=>{
    e.preventDefault();
    setErr('');

    if (!isValidPhoneNumber(mobile)) {
      setPhoneErr('Please enter a valid phone number with country code');
      return;
    }
    setPhoneErr('');

    if (!location) {
      setErr('Please select your city.');
      return;
    }
    if (!area) {
      setErr('Please select your area.');
      return;
    }

    setSubmitting(true);
    try {
      await API.post('/auth/register', { name, email, password, role, mobile, location, area, securityQuestion, securityAnswer });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setErr(err.response?.data?.message || 'Registration failed. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page d-flex justify-content-center align-items-center py-5">
      <div className="w-100" style={{ maxWidth: '520px' }}>
        <div className="card auth-card border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="auth-card-header text-center text-white py-4">
            <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-white bg-opacity-25 mb-2" style={{ width: 56, height: 56 }}>
              <i className="fas fa-user-plus fs-4"></i>
            </div>
            <h4 className="mb-0 fw-semibold">Create Your Account</h4>
            <p className="mb-0 small opacity-75">Join us to donate or receive medicines</p>
          </div>

          <div className="card-body p-4 p-md-5">
            {success && (
              <div className="alert alert-success d-flex align-items-center gap-2" role="alert">
                <i className="fas fa-circle-check"></i>
                <span>Account created! Redirecting you to login...</span>
              </div>
            )}
            {err && (
              <div className="alert alert-danger d-flex align-items-center gap-2" role="alert">
                <i className="fas fa-triangle-exclamation"></i>
                <span>{err}</span>
              </div>
            )}

            <form onSubmit={submit} noValidate>
              <p className="section-label mb-3 mt-1">Account Details</p>

              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <div className="input-group">
                  <span className="input-group-text bg-light"><i className="fas fa-user text-muted"></i></span>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={e=>setName(e.target.value)}
                    required
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <div className="input-group">
                  <span className="input-group-text bg-light"><i className="fas fa-envelope text-muted"></i></span>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={e=>setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-light"><i className="fas fa-lock text-muted"></i></span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    value={password}
                    onChange={e=>setPassword(e.target.value)}
                    required
                    placeholder="At least 6 characters"
                    minLength="6"
                  />
                  <button
                    type="button"
                    className="input-group-text bg-light"
                    onClick={() => setShowPassword(s => !s)}
                    tabIndex={-1}
                  >
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-muted`}></i>
                  </button>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Mobile Number</label>
                <div className="input-group">
                  <span className="input-group-text bg-light"><i className="fas fa-phone text-muted"></i></span>
                  <input
                    type="tel"
                    className={`form-control ${phoneErr ? 'is-invalid' : ''}`}
                    value={mobile}
                    onChange={e=>setMobile(e.target.value)}
                    required
                    placeholder="+919876543210"
                  />
                </div>
                {phoneErr && <div className="text-danger small mt-1">{phoneErr}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">I am registering as</label>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className={`btn flex-fill role-toggle-btn ${role === 'member' ? 'active' : ''}`}
                    onClick={() => setRole('member')}
                  >
                    <i className="fas fa-hand-holding-heart me-2"></i>Member
                  </button>
                  <button
                    type="button"
                    className={`btn flex-fill role-toggle-btn ${role === 'ngo' ? 'active' : ''}`}
                    onClick={() => setRole('ngo')}
                  >
                    <i className="fas fa-hospital me-2"></i>NGO
                  </button>
                </div>
              </div>

              <p className="section-label mb-3 mt-4">Location</p>

              <div className="row g-3 mb-3">
                <div className="col-sm-6">
                  <label className="form-label">City</label>
                  <select
                    className="form-select"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    required
                  >
                    <option value="" disabled>Select your city</option>
                    {Object.keys(cityAreas).map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div className="col-sm-6">
                  <label className="form-label">Area</label>
                  <select
                    className="form-select"
                    value={area}
                    onChange={e => setArea(e.target.value)}
                    required
                    disabled={areas.length === 0}
                  >
                    <option value="" disabled>
                      {areas.length === 0 ? 'Select a city first' : 'Select your area'}
                    </option>
                    {areas.map(a => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
              </div>

              <p className="section-label mb-3 mt-4">Account Recovery</p>
              <p className="text-muted small mb-3" style={{ marginTop: '-0.5rem' }}>
                Used to verify your identity if you ever forget your password.
              </p>

              <div className="mb-3">
                <label className="form-label">Security Question</label>
                <input
                  type="text"
                  className="form-control"
                  value={securityQuestion}
                  onChange={e => setSecurityQuestion(e.target.value)}
                  required
                  placeholder="e.g., What is your pet's name?"
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Security Answer</label>
                <input
                  type="text"
                  className="form-control"
                  value={securityAnswer}
                  onChange={e => setSecurityAnswer(e.target.value)}
                  required
                  placeholder="Your answer"
                />
              </div>

              <div className="d-grid">
                <button className="btn btn-primary btn-lg rounded-3" disabled={submitting || success}>
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>

              <p className="text-center text-muted small mt-3 mb-0">
                Already have an account? <a href="/login">Log in</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
