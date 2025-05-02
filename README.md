# 📚 Seminar Hall Management System

A comprehensive web application for managing seminar hall bookings and resources in educational institutions. This platform streamlines the process of scheduling, booking, and managing seminar halls efficiently.

## 🚨 Problem Overview

Educational institutions often face challenges with seminar hall management:
- Manual booking processes leading to scheduling conflicts
- Lack of transparency in hall availability
- Inefficient resource allocation and management
- Communication gaps between requesters and administrators
- Limited tracking of usage history and patterns
- Difficulty in managing multiple halls with different capacities

## 🎯 Solution

The **Seminar Hall Management System** provides a digital solution to streamline the entire process of booking and managing seminar halls through an intuitive and comprehensive platform.

## ✨ Features.

1. **📅 Intuitive Booking System**  
   Easy-to-use interface for checking availability and booking seminar halls with conflict prevention.

2. **🔍 Real-time Availability Checker**  
   View real-time availability of all halls with calendar integration for better planning.

3. **🔐 Role-Based Access Control**  
   Separate access levels for:
   - Administrators
   - Faculty
   - Students  
   Ensuring appropriate booking privileges and management capabilities.

4. **📩 Booking Approval Workflow**  
   Request submission, review, and approval process with email notifications at each stage.

5. **💬 Communication Channel**  
   Built-in messaging for clarifications and updates regarding bookings.

6. **📊 Analytics Dashboard**  
   Usage statistics, popular time slots, and resource utilization metrics for administrators.

7. **📱 Responsive Design**  
   Access the system from any device - desktop, tablet, or mobile.

## 🔧 Tech Stack

- **Frontend:** HTML, CSS, JavaScript, React.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** Firebase Authentication
- **Notifications:** EmailJS
- **Styling:** Bootstrap/Tailwind Css

## 🚀 How to Run Locally

```bash
# Clone the repository
git clone https://github.com/Janjirala-Srikar/Seminar_Hall.git
cd Seminar_Hall

# Install dependencies
npm install

# Set up environment variables (.env file)
# Example:
# PORT=5000
# MONGO_URI=your_mongodb_connection_string
# FIREBASE_API_KEY=your_firebase_api_key
# FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
# EMAILJS_SERVICE_ID=your_emailjs_service_id
# EMAILJS_TEMPLATE_ID=your_emailjs_template_id
# EMAILJS_USER_ID=your_emailjs_user_id

# Start the server
npm start
```

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
