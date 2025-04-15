import React, { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';
import axios from 'axios';
import { FaInfoCircle, FaEnvelope, FaCalendarCheck, FaArrowRight, FaArrowLeft, FaCheckCircle, FaChevronLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './ClubInfoCard.css';

const ClubInfoCard = () => {
  const [formData, setFormData] = useState({
    clubName: "",
    description: "",
    facultyAdvisorName: "",
    contactEmail: "",
    contactPhone: "",
    departmentAffiliation: "",
    clubCategory: "",
    establishedDate: "",
    status: false 
  });

  const [activeSection, setActiveSection] = useState(0);
  const [visibleData, setVisibleData] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sections] = useState([
    {
      title: "Basic Info",
      icon: <FaInfoCircle />,
      fields: [
        { key: "clubName", label: "Club Name", type: "text" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "facultyAdvisorName", label: "Faculty Advisor", type: "text" }
      ]
    },
    {
      title: "Contact",
      icon: <FaEnvelope />,
      fields: [
        { key: "contactEmail", label: "Email", type: "email" },
        { key: "contactPhone", label: "Phone", type: "tel" },
        { key: "departmentAffiliation", label: "Department", type: "text" }
      ]
    },
    {
      title: "Details",
      icon: <FaCalendarCheck />,
      fields: [
        { key: "clubCategory", label: "Category", type: "text" },
        { key: "establishedDate", label: "Established", type: "date" }
      ]
    }
  ]);

  useEffect(() => {
    // Set initial visible data
    setVisibleData(sections[activeSection].fields);
  }, []);

  useEffect(() => {
    setVisibleData(sections[activeSection].fields);
  }, [activeSection]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when field is updated
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateSection = (sectionIndex) => {
    const sectionFields = sections[sectionIndex].fields;
    const newErrors = {};
    let isValid = true;

    sectionFields.forEach(field => {
      if (!formData[field.key]) {
        newErrors[field.key] = `${field.label} is required`;
        isValid = false;
      }
    });

    setFormErrors(prev => ({ ...prev, ...newErrors }));
    return isValid;
  };

  const handleNext = () => {
    if (validateSection(activeSection)) {
      setActiveSection(prev => Math.min(sections.length - 1, prev + 1));
    }
  };

  const handlePrevious = () => {
    setActiveSection(prev => Math.max(0, prev - 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all sections before submission
    let isFormValid = true;
    for (let i = 0; i < sections.length; i++) {
      if (!validateSection(i)) {
        isFormValid = false;
        setActiveSection(i);
        break;
      }
    }
  
    if (isFormValid) {
      setIsSubmitting(true);
      
      try {
        // Send email using EmailJS
        await emailjs.send(
          "service_09taf3j",
          "template_yh86z8w",
          {
            clubName: formData.clubName,
            establishedDate: formData.establishedDate,
            description: formData.description,
            departmentAffiliation: formData.departmentAffiliation,
            facultyAdvisorName: formData.facultyAdvisorName,
            contactEmail: formData.contactEmail,
            to_email: "lumora911@gmail.com,srikarjanjirala92@gmail.com,shaikafzalelahi@gmail.com,ashishlukka2005@gmail.com,swaroopmallidi7777@gmail.com"
          },
          "cDxpGfoDN7I6s16zA"
        );
  
        // Send data to backend
        await axios.post('http://localhost:5000/api/clubs', {
          clubName: formData.clubName,
          description: formData.description,
          facultyAdvisorName: formData.facultyAdvisorName,
          contactEmail: formData.contactEmail,
          contactPhone: formData.contactPhone, 
          departmentAffiliation: formData.departmentAffiliation,
          clubCategory: formData.clubCategory, 
          establishedDate: formData.establishedDate,
        });
  
        console.log('Form submitted with data:', formData);
        setIsSubmitting(false);
        alert("Club information submitted and saved successfully!");
  
      } catch (error) {
        console.error("Error during form submission:", error);
        setIsSubmitting(false);
        alert("There was an error submitting the form. Please try again.");
      }
    }
  };

  return (
    <div className="multistep-form-container">
      <Link to="/clubreg" className="home-button ">
                <FaArrowLeft />
                <span>Back</span>
          </Link>
      <div className="form-wrapper">
        

        <div className="form-card">
          <h2 className="form-title">Fill the details to register as a Club</h2>
          <p className="step-indicator">Step {activeSection + 1} of {sections.length}</p>
          
          {/* Progress Indicator */}
          <div className="progress-steps">
            {sections.map((section, index) => (
              <div key={index} className="step-item">
                <div className={`step-circle ${index <= activeSection ? 'active' : ''}`}>
                  {index + 1}
                </div>
                {index < sections.length - 1 && <div className={`step-line ${index < activeSection ? 'active' : ''}`}></div>}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-section">
              {visibleData.map((field, idx) => (
                <div key={idx} className="form-field">
                  <label htmlFor={field.key} className="field-label">
                    {field.label} <span className="required-mark">*</span>
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      id={field.key}
                      name={field.key}
                      className={`form-input textarea ${formErrors[field.key] ? 'error' : ''}`}
                      value={formData[field.key]}
                      onChange={handleChange}
                      rows="4"
                      placeholder={field.label}
                      required
                    />
                  ) : (
                    <input
                      id={field.key}
                      name={field.key}
                      type={field.type}
                      className={`form-input ${formErrors[field.key] ? 'error' : ''}`}
                      value={formData[field.key]}
                      onChange={handleChange}
                      placeholder={field.label}
                      required
                    />
                  )}
                  {formErrors[field.key] && (
                    <div className="error-message">{formErrors[field.key]}</div>
                  )}
                </div>
              ))}
            </div>

            <div className="form-actions">
              {activeSection > 0 && (
                <button 
                  type="button"
                  className="prev-button" 
                  onClick={handlePrevious}
                  disabled={isSubmitting}
                >
                  <FaArrowLeft className="button-icon" />
                  Previous
                </button>
              )}
              
              {activeSection === sections.length - 1 ? (
                <button 
                  type="submit"
                  className="submit-button" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner"></span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit
                      <FaCheckCircle className="button-icon" />
                    </>
                  )}
                </button>
              ) : (
                <button 
                  type="button"
                  className="next-button" 
                  onClick={handleNext}
                  disabled={isSubmitting}
                >
                  Next Step
                  <FaArrowRight className="button-icon" />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClubInfoCard;