## 🛍️ LUXE STORE - High-End E-Commerce Platform

### [🔗 View Live Demo](https://shop-e-mern.netlify.app/)

## 📖 About the Project
LUXE STORE is a sophisticated, full-stack MERN application designed for a premium shopping experience. This project was built to demonstrate proficiency in secure user authentication, real-time data synchronization, and modern UI/UX principles.

Unlike basic e-commerce tutorials, this platform implements a QR-code-based checkout flow, mimicking high-end boutique payment systems, and features a robust backend architecture focused on security and scalability.

## 🚀 Key Features
Secure Authentication: Custom JWT-based login/signup system with password hashing via bcryptjs.

Real-Time Stock Management: Live inventory updates across all connected clients using Socket.io.

Protected Routes: Frontend and Backend "Gatekeepers" that prevent unauthorized data access.

Luxury UI/UX: A minimalist, premium interface featuring "Skeleton" loading states and smooth quantity controls.

Scalable Media: Product images are served via Cloudinary CDN for optimized performance.

Persistent Sessions: Users stay logged in across browser refreshes via encrypted LocalStorage tokens.

## 🛠️ Technology Stack
Frontend
React.js: Component-based UI logic.

Axios: Interceptor-ready API communication.

Socket.io-client: Real-time event handling.

CSS3: Custom luxury styling (no bloated frameworks).

Backend
Node.js & Express: Scalable REST API architecture.

MongoDB & Mongoose: NoSQL database for flexible product and user schemas.

JSON Web Tokens (JWT): Secure, stateless authentication.

Cloudinary API: Professional image hosting and optimization.

Deployment & DevOps
Render: Automated CI/CD pipeline for backend and frontend.

Git/GitHub: Version control with descriptive commit history.

Environment Variables: Secure management of API keys and database strings.

## ⚙️ Installation & Setup
1. Clone the repository:
   
git clone https://github.com/your-username/luxe-store.git

2. Install Dependencies:

Root folder -
npm install
Client folder -
cd client && npm install
Server folder -
cd ../server && npm install

3. Environment Variables: Create a .env file in the /server directory:

MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

4. Run the Application:

// From the root
npm run dev

## 👤 Author

Utkarsha Shende Full-Stack Developer 

https://www.linkedin.com/in/utkarsha-shende-344b57231/ 

https://utkarsha-s-portfolio.netlify.app/