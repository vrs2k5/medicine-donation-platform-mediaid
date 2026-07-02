import React, { useState } from 'react';

export default function Feedback() {
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [liked, setLiked] = useState('');
  const [improved, setImproved] = useState('');
  const [suggestions, setSuggestions] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Feedback submitted:', { rating, liked, improved, suggestions });
    // Here you can send to backend or handle submission
    alert('Thank you for your feedback!');
    setShowModal(false);
    setRating(0);
    setLiked('');
    setImproved('');
    setSuggestions('');
  };

  return (
    <>
      <a href="#" className="text-white" onClick={() => setShowModal(true)}>Feedback</a>

      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Share Your Feedback</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Overall Satisfaction (1-5 stars)</label>
                    <div>
                      {[1, 2, 3, 4, 5].map(star => (
                        <i
                          key={star}
                          className={`fas fa-star ${rating >= star ? 'text-warning' : 'text-muted'}`}
                          style={{ cursor: 'pointer' }}
                          onClick={() => setRating(star)}
                        ></i>
                      ))}
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">What did you like about the platform?</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={liked}
                      onChange={(e) => setLiked(e.target.value)}
                      placeholder="Tell us what you enjoyed..."
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">What can be improved?</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={improved}
                      onChange={(e) => setImproved(e.target.value)}
                      placeholder="Any areas for improvement..."
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Any additional suggestions?</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={suggestions}
                      onChange={(e) => setSuggestions(e.target.value)}
                      placeholder="Your ideas and suggestions..."
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                  <button type="submit" className="btn btn-primary">Submit Feedback</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
