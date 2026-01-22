import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaInfoCircle, FaShieldAlt, FaTruck, FaUsers, FaBookOpen, FaBriefcase, FaGlobe } from 'react-icons/fa';

const FooterInfoPage = () => {
  const { type } = useParams();
  const navigate = useNavigate();

  const infoData = {
    about: {
      title: "About GaneshShop",
      icon: <FaInfoCircle />,
      content: `GaneshShop is India's premier e-commerce platform, founded in 2026 with a vision to revolutionize the digital shopping landscape. Headquartered in Nagpur, Maharashtra, we have grown from a local startup to a national leader in providing high-quality electronics, fashion, and lifestyle products. 
      
      Our platform is built on the pillars of trust, transparency, and technology. We empower thousands of local sellers by giving them a national stage, while ensuring our customers receive authentic products at the most competitive prices. With over 10 million registered users and a logistics network covering 19,000+ pin codes, we are committed to making premium shopping accessible to every corner of India.`
    },
    stories: {
      title: "Ganesh Stories",
      icon: <FaBookOpen />,
      content: `Ganesh Stories is a celebration of the human spirit and the transformative power of e-commerce. It is a collection of inspiring journeys from our diverse community of sellers and customers. From the artisan in a remote village reaching global markets to the student getting their first laptop for higher education, these stories define who we are.
      
      We believe that every package delivered is a promise kept. Our 'Seller Spotlight' program highlights small business owners who have scaled their dreams through GaneshShop. We are not just moving boxes; we are moving lives and building a community where every individual has the opportunity to succeed in the digital economy.`
    },
    careers: {
      title: "Careers at GaneshShop",
      icon: <FaBriefcase />,
      content: `Join the team that is building the future of Indian retail. At GaneshShop, we don't just offer jobs; we offer careers that challenge you to innovate and grow. We are a fast-paced, inclusive organization that values creativity, data-driven decisions, and a 'customer-first' mindset.
      
      Whether you are an expert in Software Engineering, Logistics, Digital Marketing, or Customer Experience, there is a place for you here. Our employees enjoy a flexible work environment, competitive benefits, and the chance to work on large-scale problems that impact millions of lives every day. Explore our open positions and be part of India's most exciting tech revolution.`
    },
    contact: {
      title: "Contact Us",
      icon: <FaGlobe />,
      content: "For any queries, reach us at support@ganeshshop.com or call our 24/7 helpline at 1800-GANESH. Corporate Office: GaneshShop Internet Pvt Ltd, Buildings Alyssa, Embassy Tech Village, Nagpur, Maharashtra, 440001."
    }
  };

  const pageData = infoData[type] || { 
    title: "Information", 
    icon: <FaInfoCircle />, 
    content: "We are currently updating this section with detailed information. Please check back later!" 
  };

  return (
    <div className="info-page-container">
      <div className="back-nav">
        <button className="back-to-home-btn" onClick={() => navigate("/")}>
          <FaArrowLeft /> Back to Home
        </button>
      </div>

      <div className="info-card-premium">
        <div className="info-header">
           <span className="info-icon">{pageData.icon}</span>
           <h1>{pageData.title}</h1>
        </div>
        <hr className="info-divider" />
        <div className="info-body">
           <p>{pageData.content}</p>
        </div>
      </div>
    </div>
  );
};

export default FooterInfoPage;