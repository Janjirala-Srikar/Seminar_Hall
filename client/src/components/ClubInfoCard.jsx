import React, { useState, useEffect } from 'react';
import emailjs from 'emailjs-com'; // Make sure to import EmailJS

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
    status: false // This will remain in the object but not be shown in UI
  });

  const [activeSection, setActiveSection] = useState(0);
  const [visibleData, setVisibleData] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sections] = useState([
    {
      title: "Basic Info",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
        </svg>
      ),
      fields: [
        { key: "clubName", label: "Club Name", type: "text" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "facultyAdvisorName", label: "Faculty Advisor", type: "text" }
      ]
    },
    {
      title: "Contact",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z"/>
        </svg>
      ),
      fields: [
        { key: "contactEmail", label: "Email", type: "email" },
        { key: "contactPhone", label: "Phone", type: "tel" },
        { key: "departmentAffiliation", label: "Department", type: "text" }
      ]
    },
    {
      title: "Details",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-5 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z"/>
          <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
        </svg>
      ),
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
            // Add this to explicitly set the recipient(s)
            to_email: "lumora911@gmail.com,srikarjanjirala92@gmail.com,shaikafzalelahi@gmail.com,ashishlukka2005@gmail.com,swaroopmallidi7777@gmail.com" // Complete the email that was cut off
          },
          "cDxpGfoDN7I6s16zA"
        );

        console.log('Form submitted with data:', formData);
        setIsSubmitting(false);
        alert("Club information submitted successfully!");
        
      } catch (error) {
        console.error("Error during form submission:", error);
        setIsSubmitting(false);
        alert("There was an error submitting the form. Please try again.");
      }

      //post in database
    }
  };

  // SVG header background
  const HeaderSvgBackground = () => (
    <svg 
      width="100%" 
      height="100%" 
      viewBox="0 0 800 200" 
      xmlns="http://www.w3.org/2000/svg"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.15
      }}
    >
      <defs>
        <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="1" opacity="0.2"/>
        </pattern>
        <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
          <rect width="80" height="80" fill="url(#smallGrid)"/>
          <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="1.5" opacity="0.4"/>
        </pattern>
      </defs>
      
      <rect width="100%" height="100%" fill="url(#grid)" />
      
      <circle cx="150" cy="100" r="30" fill="white" opacity="0.2" />
      <circle cx="650" cy="50" r="20" fill="white" opacity="0.2" />
      <circle cx="700" cy="150" r="40" fill="white" opacity="0.2" />
      <circle cx="400" cy="100" r="50" fill="white" opacity="0.1" />
      <path d="M50,50 Q200,20 400,80 T750,120" stroke="white" strokeWidth="2" fill="none" opacity="0.2" />
    </svg>
  );

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <form onSubmit={handleSubmit}>
            <div className="card shadow-lg rounded-lg overflow-hidden">
              {/* Header */}
              <div className="card-header p-0">
                <div 
                  className="p-4 text-center" 
                  style={{
                    background: 'linear-gradient(135deg, #4b6cb7 0%, #182848 100%)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <HeaderSvgBackground />
                  <h2 className="font-weight-bold text-white mb-1">Club Information Form</h2>
                  <div className="bg-white bg-opacity-25 h-1 w-32 mx-auto my-2 rounded"></div>
                  <p className="text-white opacity-90 mb-0">Please fill in all required fields</p>
                </div>
              </div>
              
              {/* Section Navigation */}
              <div className="card-body p-4">
                <div className="d-flex justify-content-center mb-4 flex-wrap">
                  {sections.map((section, index) => (
                    <button 
                      type="button"
                      key={index}
                      className={`btn mx-2 mb-2 px-4 py-2 rounded-pill d-flex align-items-center ${
                        activeSection === index 
                          ? 'bg-primary text-white shadow-sm' 
                          : 'btn-outline-primary'
                      }`}
                      onClick={() => setActiveSection(index)}
                      style={{
                        transition: 'all 0.3s ease',
                        minWidth: '130px',
                        justifyContent: 'center'
                      }}
                    >
                      <span className="me-2" style={{ display: 'flex', alignItems: 'center' }}>
                        {section.icon}
                      </span>
                      {section.title}
                    </button>
                  ))}
                </div>
                
                {/* Content */}
                <div className="card border-0 shadow-sm rounded-lg overflow-hidden mb-4">
                  <div className="card-header bg-light py-3 d-flex align-items-center">
                    <span className="me-2" style={{ display: 'flex', alignItems: 'center' }}>
                      {sections[activeSection].icon}
                    </span>
                    <h5 className="mb-0 text-gray-700">{sections[activeSection].title}</h5>
                  </div>
                  <div className="card-body p-0">
                    {visibleData.map((field, idx) => (
                      <div 
                        key={idx}
                        className="p-3 border-bottom"
                        style={{
                          backgroundColor: idx % 2 === 0 ? '#f8f9fa' : 'white',
                          transition: 'all 0.3s ease',
                          animation: `fadeIn 0.4s ease-out ${idx * 0.1}s both`
                        }}
                      >
                        <div className="row align-items-center">
                          <div className="col-md-4">
                            <label htmlFor={field.key} className="text-gray-600 mb-0 fw-bold">
                              {field.label}
                              <span className="text-danger">*</span>
                            </label>
                          </div>
                          <div className="col-md-8">
                            {field.type === 'textarea' ? (
                              <textarea
                                id={field.key}
                                name={field.key}
                                className={`form-control ${formErrors[field.key] ? 'is-invalid' : ''}`}
                                value={formData[field.key]}
                                onChange={handleChange}
                                rows="3"
                                required
                              />
                            ) : (
                              <input
                                id={field.key}
                                name={field.key}
                                type={field.type}
                                className={`form-control ${formErrors[field.key] ? 'is-invalid' : ''}`}
                                value={formData[field.key]}
                                onChange={handleChange}
                                required
                              />
                            )}
                            {formErrors[field.key] && (
                              <div className="invalid-feedback">{formErrors[field.key]}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Navigation and Submit Buttons */}
                <div className="d-flex justify-content-between">
                  <button 
                    type="button"
                    className="btn btn-outline-primary rounded-pill px-4 d-flex align-items-center" 
                    onClick={handlePrevious}
                    disabled={activeSection === 0 || isSubmitting}
                    style={{ transition: 'all 0.2s ease' }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                    </svg>
                    Previous
                  </button>
                  
                  {activeSection === sections.length - 1 ? (
                    <button 
                      type="submit"
                      className="btn btn-success rounded-pill px-4 d-flex align-items-center" 
                      style={{ transition: 'all 0.2s ease' }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="ms-2" viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                          </svg>
                        </>
                      )}
                    </button>
                  ) : (
                    <button 
                      type="button"
                      className="btn btn-primary rounded-pill px-4 d-flex align-items-center" 
                      onClick={handleNext}
                      disabled={isSubmitting}
                      style={{ transition: 'all 0.2s ease' }}
                    >
                      Next
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="ms-2" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { 
            opacity: 0; 
            transform: translateY(10px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .spinner-border {
          display: inline-block;
          width: 1rem;
          height: 1rem;
          vertical-align: text-bottom;
          border: 0.2em solid currentColor;
          border-right-color: transparent;
          border-radius: 50%;
          animation: spinner-border .75s linear infinite;
        }
        
        @keyframes spinner-border {
          to { transform: rotate(360deg); }
        }
        
        .bg-gray-100 {
          background-color: #f8f9fa;
        }
        
        .text-gray-600 {
          color: #6c757d;
        }
        
        .text-gray-700 {
          color: #495057;
        }
        
        .text-gray-800 {
          color: #343a40;
        }
        
        .h-1 {
          height: 4px;
        }
        
        .w-32 {
          width: 8rem;
        }
        
        .bg-opacity-25 {
          opacity: 0.25;
        }
        
        .rounded-lg {
          border-radius: 0.5rem;
        }
        
        .rounded-pill {
          border-radius: 50rem;
        }
      `}</style>
    </div>
  );
};

export default ClubInfoCard;